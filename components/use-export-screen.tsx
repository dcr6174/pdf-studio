'use client';
import {brandDownloadName} from '@/lib/export-filename';
import {useState} from 'react';
import {ResultCard} from '@/components/result-card';
import {ResultPreview} from '@/components/result-preview';

export function useExportScreen(afterDownload?: (output: {blob: Blob; name: string}) => void) {
    const [output, setOutput] = useState<{blob: Blob; name: string;title?:string;report?:string}>();
    const [visible, setVisible] = useState(false);
    function prepare(blob: Blob, name: string,title?:string,report?:string) {setOutput({blob, name:brandDownloadName(name),title,report}); setVisible(true);}
    const screen = output && <ResultCard resultTitle={output.title} previewContent={output.blob.type==='application/pdf'?<ResultPreview output={output}/>:undefined} output={output} open={visible} onOpenChange={setVisible} onSettings={() => {
        setVisible(false);
        requestAnimationFrame(() => {window.scrollTo({top: 0, behavior: 'instant'}); document.querySelector<HTMLElement>('[data-export-workspace]')?.focus({preventScroll: true});});
    }} onDownload={() => {
        void (async () => {
        const {nativeSaveToDownloads} = await import('@/lib/app-bridge');
        if (await nativeSaveToDownloads(output.blob, output.name)) { afterDownload?.(output); return; }
        const url = URL.createObjectURL(output.blob), anchor = document.createElement('a');
        anchor.href = url; anchor.download = output.name; anchor.hidden = true; document.body.appendChild(anchor); anchor.click(); anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        afterDownload?.(output);
        })();
    }}/>;
    return {prepare, visible, screen};
}
