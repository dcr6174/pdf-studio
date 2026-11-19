// Bridge between the website and the PDF Studio Android app (Capacitor shell).
// All functions are safe no-ops in a regular browser.
type NativeFilesPlugin = {
  saveToDownloads?: (args: {name: string; data: string}) => Promise<void>;
  getPendingOpen?: () => Promise<{hasFile?: boolean; name?: string; data?: string; dest?: string}>;
};
type CapWindow = Window & {Capacitor?: {isNativePlatform?: () => boolean; Plugins?: {NativeFiles?: NativeFilesPlugin}}};

export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as CapWindow).Capacitor;
  try { return !!cap?.isNativePlatform?.(); } catch { return false; }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve(url.slice(url.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Saves a generated file into the device's public Downloads folder.
// Returns true when the app handled it (caller should skip the browser download).
export async function nativeSaveToDownloads(blob: Blob, name: string): Promise<boolean> {
  if (!isNativeApp()) return false;
  const plugin = (window as CapWindow).Capacitor?.Plugins?.NativeFiles;
  if (!plugin?.saveToDownloads) return false;
  try {
    const data = await blobToBase64(blob);
    await plugin.saveToDownloads({name, data});
    return true;
  } catch (e) {
    console.error('native save failed', e);
    return false;
  }
}

export type PendingOpen = {name: string; data: string; dest?: string} | null;

// Returns a PDF the user sent into the app via Open with / share sheet, once.
export async function nativeTakePendingOpen(): Promise<PendingOpen> {
  if (!isNativeApp()) return null;
  const plugin = (window as CapWindow).Capacitor?.Plugins?.NativeFiles;
  if (!plugin?.getPendingOpen) return null;
  try {
    const r = await plugin.getPendingOpen();
    if (r?.hasFile && typeof r.data === 'string') return {name: r.name || 'document.pdf', data: r.data, dest: typeof r.dest === 'string' ? r.dest : 'reader'};
  } catch { /* ignore */ }
  return null;
}
