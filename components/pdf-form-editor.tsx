'use client';
import {useEffect, useRef, useState, type CSSProperties} from 'react';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import {ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, ListChecks} from 'lucide-react';
import {renderer, type Loaded} from '@/lib/pdf-client';
import type {FormField, FormValue, FormWidget} from '@/lib/pdf-forms';

type ControlProps = {field: FormField; value: FormValue; onChange: (value: FormValue) => void; widget?: FormWidget; id: string};
function FormControl({field, value, onChange, widget, id}: ControlProps) {
  const common = {id, 'aria-label': field.label, 'aria-required': field.required, disabled: field.readOnly, title: field.label};
  if (field.kind === 'checkbox') return <input {...common} type="checkbox" checked={value === true} onChange={e => onChange(e.target.checked)}/>;
  if (field.kind === 'radio') {
    if (widget) return <input {...common} aria-label={`${field.label}: ${widget.option}`} type="radio" name={`pdf-${field.name}`} checked={value === widget.option} onChange={() => widget.option && onChange(widget.option)}/>;
    return <div className="form-radio-list" role="radiogroup" aria-label={field.label}>{field.choices.map(choice => <label key={choice}><input type="radio" name={`list-${field.name}`} disabled={field.readOnly} checked={value === choice} onChange={() => onChange(choice)}/><span>{choice}</span></label>)}{!field.readOnly && <button type="button" className="link-button" onClick={() => onChange('')}>Clear selection</button>}</div>;
  }
  if (field.kind === 'select' || field.kind === 'list') {
    if (field.editable && !field.multiselect) return <><input {...common} list={`${id}-choices`} value={String(value)} onChange={e => onChange(e.target.value)}/><datalist id={`${id}-choices`}>{field.choices.map(choice => <option key={choice} value={choice}/>)}</datalist></>;
    return <select {...common} multiple={field.multiselect} size={field.multiselect || field.kind === 'list' ? Math.min(5, Math.max(2, field.choices.length)) : undefined} value={field.multiselect ? (Array.isArray(value) ? value : value ? [String(value)] : []) : String(value)} onChange={e => onChange(field.multiselect ? Array.from(e.target.selectedOptions, option => option.value) : e.target.value)}>
      {!field.multiselect && <option value="">Choose an option</option>}{field.choices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
    </select>;
  }
  if (field.multiline) return <textarea {...common} maxLength={field.maxLength} value={String(value)} onChange={e => onChange(e.target.value)}/>;
  return <input {...common} type="text" maxLength={field.maxLength} autoComplete="off" value={String(value)} onChange={e => onChange(e.target.value)}/>;
}

type PositionedWidget = {field: FormField; widget: FormWidget; style: CSSProperties; controlStyle: CSSProperties; key: string};
export function PDFFormEditor({file, fields, values, onChange, flatten, onFlatten, loading, error, onRetry, onEditPDF}: {
  file: Loaded; fields: FormField[]; values: Record<string, FormValue>; onChange: (name: string, value: FormValue) => void;
  flatten: boolean; onFlatten: (value: boolean) => void; loading: boolean; error: string; onRetry: () => void; onEditPDF: () => void;
}) {
  const [document, setDocument] = useState<PDFDocumentProxy>();
  const [page, setPage] = useState(1), [zoom, setZoom] = useState(1), [width, setWidth] = useState(700);
  const [mode, setMode] = useState<'page' | 'fields'>('page');
  const [renderError, setRenderError] = useState(''), [rendering, setRendering] = useState(true), [retry, setRetry] = useState(0);
  const [surface, setSurface] = useState({width: 1, height: 1, widgets: [] as PositionedWidget[]});
  const host = useRef<HTMLDivElement>(null), canvasHost = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true, opened: PDFDocumentProxy | undefined;
    renderer(file.bytes).then(doc => {opened = doc; if (active) setDocument(doc); else void doc.destroy();}).catch(() => {if (active) setRenderError('The PDF preview could not open. You can still use the field list, or retry the preview.');});
    return () => {active = false; if (opened) void opened.destroy();};
  }, [file.bytes, retry]);
  useEffect(() => {
    const element = host.current; if (!element) return;
    const observer = new ResizeObserver(entries => {const size = entries[0].contentRect.width; if (size > 0) setWidth(size);});
    observer.observe(element); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const root = canvasHost.current;
    if (!document || !root || mode !== 'page') return;
    let active = true, task: {cancel: () => void; promise: Promise<unknown>} | undefined;
    const canvas = window.document.createElement('canvas');
    root.replaceChildren(canvas);
    void (async () => {
      try {
        setRendering(true); setRenderError('');
        const pdfPage = await document.getPage(page); if (!active) return;
        const base = pdfPage.getViewport({scale: 1});
        const view = pdfPage.getViewport({scale: Math.max(0.1, (width - 32) / base.width) * zoom});
        const density = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4000000 / (view.width * view.height)));
        canvas.width = Math.ceil(view.width * density); canvas.height = Math.ceil(view.height * density);
        canvas.style.width = `${view.width}px`; canvas.style.height = `${view.height}px`;
        canvas.setAttribute('aria-label', `PDF page ${page}`); canvas.setAttribute('role', 'img');
        const widgets: PositionedWidget[] = [];
        fields.forEach((field, fieldIndex) => field.widgets.forEach((widget, widgetIndex) => {
          if (widget.page !== page - 1 || field.kind === 'unsupported') return;
          const box = view.convertToViewportRectangle(widget.rect);
          const left = Math.max(0, Math.min(box[0], box[2])), top = Math.max(0, Math.min(box[1], box[3]));
          const right = Math.min(view.width, Math.max(box[0], box[2])), bottom = Math.min(view.height, Math.max(box[1], box[3]));
          if (right <= left || bottom <= top) return;
          const angle = ((pdfPage.rotate + widget.rotation) % 360 + 360) % 360, quarterTurn = angle === 90 || angle === 270;
          widgets.push({field, widget, controlStyle: {width: quarterTurn ? bottom - top : right - left, height: quarterTurn ? right - left : bottom - top, transform: `translate(-50%, -50%) rotate(${angle}deg)`}, key: `${fieldIndex}-${widgetIndex}`, style: {left, top, width: right - left, height: bottom - top}});
        }));
        setSurface({width: view.width, height: view.height, widgets});
        const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas unavailable');
        // Keep original appearances for unsupported buttons; HTML controls cover supported widgets.
        task = pdfPage.render({canvasContext: context, viewport: view, transform: [density, 0, 0, density, 0, 0]});
        await task.promise;
        if (active) setRendering(false);
      } catch (cause) {
        if (active && !(cause instanceof Error && cause.name === 'RenderingCancelledException')) {setRenderError('This page could not render. Try another page, or use the field list.'); setRendering(false);}
      }
    })();
    return () => {active = false; task?.cancel(); root.replaceChildren(); canvas.width = 0; canvas.height = 0;};
  }, [document, page, width, zoom, fields, mode]);
  const editable = fields.filter(field => field.kind !== 'unsupported');
  const pageFields = editable.filter(field => field.widgets.some(widget => widget.page === page - 1));
  const unsupported = fields.filter(field => field.kind === 'unsupported').length;
  return <section className="pdf-form-editor" aria-label="PDF form workspace">
    <div className="form-workbench">
      <div className="form-toolbar">
        <div className="form-view-switch" role="group" aria-label="Form view"><button type="button" aria-pressed={mode === 'page'} onClick={() => setMode('page')}><FileText size={17}/>On page</button><button type="button" aria-pressed={mode === 'fields'} onClick={() => setMode('fields')}><ListChecks size={17}/>Field list</button></div>
        <div className="form-zoom"><button type="button" aria-label="Zoom out" disabled={zoom <= 1 || mode !== 'page'} onClick={() => setZoom(value => Math.max(1, value - .25))}><ZoomOut size={18}/></button><button type="button" disabled={mode !== 'page'} onClick={() => setZoom(1)} aria-label="Fit PDF to width">{zoom === 1 ? 'Fit width' : `${Math.round(zoom * 100)}%`}</button><button type="button" aria-label="Zoom in" disabled={zoom >= 3 || mode !== 'page'} onClick={() => setZoom(value => Math.min(3, value + .25))}><ZoomIn size={18}/></button></div>
      </div>
      <nav className="form-pager" aria-label="PDF form pages"><button type="button" aria-label="Previous form page" disabled={page <= 1} onClick={() => setPage(value => value - 1)}><ChevronLeft size={18}/></button><label>Page <select aria-label="Form page" value={page} onChange={e => setPage(Number(e.target.value))}>{Array.from({length: file.pages}, (_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}</select> of {file.pages}</label><button type="button" aria-label="Next form page" disabled={page >= file.pages} onClick={() => setPage(value => value + 1)}><ChevronRight size={18}/></button></nav>
      {loading && <p className="form-status" role="status">Reading form fields…</p>}
      {!loading && !error && !editable.some(field=>!field.readOnly) && <div className="form-status" role="status"><p>This PDF has no writable form fields. Use Edit PDF to add text to the page.</p><button type="button" className="link-button" onClick={onEditPDF}>Add text with Edit PDF</button></div>}
      {error && <div className="form-status" role="alert"><p>{error}</p><button type="button" className="secondary" onClick={onRetry}>Retry fields</button></div>}
      {renderError && <div className="form-status" role="alert"><p>{renderError}</p><button type="button" className="secondary" onClick={() => {setDocument(undefined); setRenderError(''); setRetry(value => value + 1);}}>Retry preview</button></div>}
      <div className="form-page-scroll" ref={host} hidden={mode !== 'page'} tabIndex={0} aria-label="PDF page, scroll to see zoomed content">
        {rendering && !renderError && <p className="form-status" role="status">Rendering page {page}…</p>}
        <div className="form-page-surface" style={{width: surface.width, height: surface.height}}>
          <div ref={canvasHost}/>
          {!rendering && !renderError && !loading && !error && surface.widgets.map(({field, widget, style, controlStyle, key}) => <div key={key} className={`form-widget form-widget-${field.kind}`} style={style}><div className="form-widget-control" style={controlStyle}><FormControl field={field} widget={widget} id={`page-field-${key}`} value={values[field.name] ?? field.value} onChange={value => onChange(field.name, value)}/></div></div>)}
        </div>
      </div>
      {mode === 'fields' && <div className="form-field-list">{pageFields.map((field, index) => <div key={field.name} className="form-list-row"><label htmlFor={`large-field-${index}`}>{field.label}{field.required && <span> · Required</span>}{field.readOnly && <span> · Read only</span>}</label><FormControl field={field} id={`large-field-${index}`} value={values[field.name] ?? field.value} onChange={value => onChange(field.name, value)}/>{field.multiselect && <small>Select multiple options. On a desktop, use Ctrl or ⌘ to select more than one.</small>}</div>)}{!pageFields.length && !loading && !error && <p className="muted">No supported fields on this page. Check another page or use Edit PDF to add text.</p>}</div>}
    </div>
    <aside className="form-options" aria-label="Form export options"><span className="eyebrow">Fill & finish</span><h2>Export options</h2><p>{editable.length} visible {editable.length === 1 ? 'field' : 'fields'} · {file.pages} {file.pages === 1 ? 'page' : 'pages'}</p><label className="field">After export<select value={flatten ? 'flatten' : 'editable'} onChange={e => onFlatten(e.target.value === 'flatten')}><option value="editable">Keep fields editable</option><option value="flatten">Flatten · make fields read only</option></select></label><p className="muted">{flatten ? 'Values become part of the page. Keep your original if you need to edit the fields later.' : 'You can open the downloaded PDF and continue filling its fields.'}</p><div className="form-help"><b>Small fields?</b><p>Switch to Field list for larger controls. Your entries stay in sync with the page.</p></div><details className="form-limitations"><summary>Form support{unsupported ? ` · ${unsupported} inactive ${unsupported === 1 ? 'item' : 'items'}` : ''}</summary><p>Text, checkboxes, radio buttons, dropdowns and lists are supported. PDF scripts, calculations, submit/reset buttons, links and digital signing do not run here. Inactive items stay drawn on the page. Check calculated totals in the original form editor.</p></details></aside>
  </section>;
}
