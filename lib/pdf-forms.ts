import {PDFDocument, PDFDict, PDFName, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup, PDFOptionList, PDFSignature, type PDFField} from 'pdf-lib';
import {flattenFormSafely} from './form-safe';

export type FormValue = string | boolean | string[];
export type FormWidget = {page: number; rect: [number, number, number, number]; rotation: number; option?: string};
export type FormField = {
  name: string; label: string; kind: 'text' | 'checkbox' | 'select' | 'radio' | 'list' | 'unsupported';
  value: FormValue; choices: string[]; widgets: FormWidget[]; readOnly: boolean; required: boolean;
  multiline: boolean; maxLength?: number; multiselect: boolean; editable: boolean;
};
const hidden = (flags: number) => Boolean(flags & (1 | 2 | 32));

function requireAcroForm(document: PDFDocument) {
  // PDFDocument.getForm() deletes XFA data, so inspect before calling it.
  const acroForm = document.catalog.lookup(PDFName.of('AcroForm'));
  if (acroForm instanceof PDFDict && acroForm.has(PDFName.of('XFA')))
    throw new Error('This PDF uses an XFA form. Open it in its original desktop form editor; PDF Studio cannot safely fill or export XFA forms.');
  const form = document.getForm();
  if (form.getFields().some(field => field instanceof PDFSignature && field.acroField.dict.has(PDFName.of('V'))))
    throw new Error('This PDF contains a digital signature. Filling or flattening would invalidate it. Use an unsigned original.');
  return form;
}

function fieldValue(field: PDFField): FormValue {
  if (field instanceof PDFTextField) return field.getText() ?? '';
  if (field instanceof PDFCheckBox) return field.isChecked();
  if (field instanceof PDFRadioGroup) return field.getSelected() ?? '';
  if (field instanceof PDFDropdown || field instanceof PDFOptionList)
    return field.isMultiselect() ? field.getSelected() : field.getSelected()[0] ?? '';
  return '';
}

export function inspectForm(document: PDFDocument): FormField[] {
  const form = requireAcroForm(document);
  const pages = new Map<PDFDict, number>();
  document.getPages().forEach((page, index) => {
    const annotations = page.node.Annots();
    if (annotations) for (let i = 0; i < annotations.size(); i++) {
      const annotation = document.context.lookup(annotations.get(i));
      if (annotation instanceof PDFDict) pages.set(annotation, index);
    }
  });
  return form.getFields().map(field => {
    const choiceField = field instanceof PDFDropdown || field instanceof PDFOptionList || field instanceof PDFRadioGroup;
    const choices = choiceField ? field.getOptions() : [];
    const widgets = field.acroField.getWidgets().flatMap((widget, index): FormWidget[] => {
      const page = pages.get(widget.dict), rect = widget.getRectangle();
      if (page === undefined || hidden(widget.getFlags() ?? 0) || rect.width <= 0 || rect.height <= 0) return [];
      return [{page, rect: [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height], rotation: widget.getAppearanceCharacteristics()?.getRotation() ?? 0,
        option: field instanceof PDFRadioGroup ? choices[index] ?? widget.getOnValue()?.decodeText() : undefined}];
    });
    const alternate = field.acroField.dict.lookup(PDFName.of('TU'));
    const label = alternate && 'decodeText' in alternate && typeof alternate.decodeText === 'function' ? alternate.decodeText() : field.getName();
    return {
      name: field.getName(), label: String(label),
      kind: field instanceof PDFTextField ? 'text' : field instanceof PDFCheckBox ? 'checkbox' : field instanceof PDFDropdown ? 'select' : field instanceof PDFRadioGroup ? 'radio' : field instanceof PDFOptionList ? 'list' : 'unsupported',
      value: fieldValue(field), choices: field instanceof PDFRadioGroup ? [...new Set(widgets.flatMap(widget=>widget.option ? [widget.option] : []))] : choices, widgets, readOnly: field.isReadOnly(), required: field.isRequired(),
      multiline: field instanceof PDFTextField && field.isMultiline(),
      maxLength: field instanceof PDFTextField ? field.getMaxLength() : undefined,
      multiselect: (field instanceof PDFDropdown || field instanceof PDFOptionList) && field.isMultiselect(),
      editable: field instanceof PDFDropdown && field.isEditable(),
    } satisfies FormField;
  }).filter(field => field.widgets.length > 0);
}

export async function readFormFields(bytes: Uint8Array) {
  return inspectForm(await PDFDocument.load(bytes, {updateMetadata: false}));
}

/** Only writable, visible, supported fields are accepted. Unsubmitted values stay intact. */
export async function applyFormValues(document: PDFDocument, values: Record<string, FormValue>) {
  const fields = inspectForm(document), form = requireAcroForm(document);
  let unicodeFont: import('pdf-lib').PDFFont | undefined;
  for (const info of fields) {
    if (info.readOnly || info.kind === 'unsupported' || !Object.hasOwn(values, info.name)) continue;
    const value = values[info.name];
    if (JSON.stringify(value) === JSON.stringify(info.value)) continue;
    const field = form.getField(info.name);
    if (field instanceof PDFTextField) {
      if (typeof value !== 'string') throw new Error(`Enter text for “${info.label}”.`);
      if (info.maxLength !== undefined && value.length > info.maxLength) throw new Error(`“${info.label}” allows at most ${info.maxLength} characters.`);
      if (/[^\x00-\x7f]/.test(value)) {
        if (!unicodeFont) {
          document.registerFontkit((await import('@pdf-lib/fontkit')).default);
          const response = await fetch('/fonts/NotoSans-Regular.ttf');
          if (!response.ok) throw new Error('The form font could not load. Retry when online.');
          unicodeFont = await document.embedFont(await response.arrayBuffer(), {subset: true});
        }
        const supported = new Set(unicodeFont.getCharacterSet());
        if ([...value].some(character => !/\s/.test(character) && !supported.has(character.codePointAt(0)!)))
          throw new Error(`“${info.label}” contains characters the form font cannot display.`);
        field.setText(value);
        field.updateAppearances(unicodeFont);
      } else field.setText(value);
    } else if (field instanceof PDFCheckBox) {
      if (typeof value !== 'boolean') throw new Error(`Choose a checkbox value for “${info.label}”.`);
      if (value) field.check(); else field.uncheck();
    } else if (field instanceof PDFRadioGroup) {
      if (typeof value !== 'string' || (value && !info.choices.includes(value))) throw new Error(`Choose a listed option for “${info.label}”.`);
      if (value) field.select(value); else field.clear();
    } else if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
      const selected = Array.isArray(value) ? value : typeof value === 'string' ? (value ? [value] : []) : null;
      if (!selected || (!info.multiselect && selected.length > 1) || selected.some(option => !info.choices.includes(option) && !info.editable))
        throw new Error(`Choose a listed option for “${info.label}”.`);
      if (selected.length) field.select(selected); else field.clear();
    }
  }
  form.acroForm.dict.delete(PDFName.of('NeedAppearances'));
}

/** pdf-lib flattens hidden widgets too; remove them before drawing appearances. */
export function flattenVisibleForm(document: PDFDocument) {
  const form = requireAcroForm(document), removed = new Set<PDFDict>();
  for (const field of form.getFields()) {
    const widgets = field.acroField.getWidgets();
    for (let i = widgets.length - 1; i >= 0; i--) if (hidden(widgets[i].getFlags() ?? 0)) {
      removed.add(widgets[i].dict);
      field.acroField.removeWidget(i);
    }
  }
  for (const page of document.getPages()) {
    const annotations = page.node.Annots();
    if (!annotations) continue;
    for (let i = annotations.size() - 1; i >= 0; i--) {
      const dict = document.context.lookup(annotations.get(i));
      if (dict instanceof PDFDict && removed.has(dict)) annotations.remove(i);
    }
  }
  flattenFormSafely(document);
}
