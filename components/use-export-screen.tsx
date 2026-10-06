'use client';
import {useState} from 'react';
import {ResultCard} from '@/components/result-card';

export function useExportScreen(afterDownload?: () => void) {
    const [output, setOutput] = useState<{blob: Blob; name: string}>();
    const [visible, setVisible] = useState(false);
    function prepare(blob: Blob, name: string) {setOutput({blob, name}); setVisible(true);}
    const screen = output && <ResultCard output={output} open={visible} onSettings={() => {
        setVisible(false);
        requestAnimationFrame(() => {window.scrollTo({top: 0, behavior: 'instant'}); document.querySelector<HTMLElement>('[data-export-workspace]')?.focus({preventScroll: true});});
    }} onDownload={() => {
        const url = URL.createObjectURL(output.blob), anchor = document.createElement('a');
        anchor.href = url; anchor.download = output.name; anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        afterDownload?.();
    }}/>;
    return {prepare, visible, screen};
}
