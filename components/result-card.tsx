'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {ArrowLeft, Check, Download, FolderOpen, Pencil} from 'lucide-react';
import {formatBytes} from '@/components/file-facts';
import './result-screen.css';

type Output = {blob: Blob; name: string; report?: string; inputSize?: number};
export function ResultCard({output, open, before, compress, onDownload, onOriginal, onContinue, onNextTool, onStartOver, onSave, onSettings, onProtect, error, previewContent}: {
    output: Output; open: boolean; onOpenChange?: (value: boolean) => void;
    before?: {files: number; pages: number; size: number; unit: 'page' | 'image'}; compress?: boolean;
    onDownload: () => void; onOriginal?: () => void; onContinue?: () => void;
    onNextTool?: (id: string) => void; onStartOver?: () => void; onSave?: () => void;
    onSettings: () => void; onProtect?: () => void; error?: string; previewContent?: ReactNode;
}) {
    const [preview, setPreview] = useState(false);
    const downloadButton = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!open) return;
        const frame = requestAnimationFrame(() => {
            window.scrollTo({top: 0, behavior: 'instant'});
            downloadButton.current?.focus({preventScroll: true});
        });
        return () => cancelAnimationFrame(frame);
    }, [open, output]);
    if (!open) return null;
    const pdf = output.blob.type === 'application/pdf';
    const extension = output.name.split('.').pop()?.toUpperCase();
    const label = pdf ? 'PDF' : extension && extension.length <= 5 ? extension : 'file';
    const inputSize = output.inputSize ?? before?.size ?? 0;
    const larger = !!compress && inputSize > 0 && output.blob.size > inputSize;
    const saved = compress && inputSize > output.blob.size ? Math.round((1 - output.blob.size / inputSize) * 100) : 0;
    return <section className="result-screen" aria-labelledby="result-heading">
        <div className="result-screen-success" aria-hidden="true"><Check size={28}/></div>
        <h1 id="result-heading">Your {label} is ready</h1>
        <p className="result-screen-file">{output.name} <span>· {formatBytes(output.blob.size)}</span></p>
        {compress && inputSize > 0 && <p className="result-screen-size">{saved > 0 ? `${saved}% smaller · ${formatBytes(inputSize)} → ${formatBytes(output.blob.size)}` : larger ? 'The original is smaller. Download it below, or change your settings.' : 'This PDF is already compact. You can download it or change your settings.'}</p>}
        <button ref={downloadButton} className="primary result-screen-download" onClick={larger && onOriginal ? onOriginal : onDownload}><Download size={24}/>{larger && onOriginal ? 'Download original PDF' : `Download ${label}`}</button>
        <div className="result-screen-return"><button className="link-button" onClick={onSettings}><ArrowLeft size={17}/>Change settings</button>{onStartOver && <button className="link-button" onClick={onStartOver}>Start over</button>}</div>
        {(onContinue || onNextTool) && <section className="result-screen-next" aria-label="Continue with your PDF"><h2>Continue with this PDF</h2><div>{onContinue && <button className="secondary" onClick={onContinue}><Pencil size={17}/>Continue editing</button>}{onNextTool && (onContinue ? [['compress', 'Compress'], ['sign', 'Sign']] : [['edit', 'Edit PDF'], ['compress', 'Compress'], ['sign', 'Sign']]).map(([id, text]) => <button className="secondary" key={id} onClick={() => onNextTool(id)}>{text}</button>)}</div></section>}
        {error && <p className="native-error" role="alert">{error}</p>}
        <div className="result-screen-details">
            {pdf && previewContent && <details onToggle={event => setPreview(event.currentTarget.open)}><summary>Preview PDF</summary>{preview && previewContent}</details>}
            {(onSave || onOriginal || onProtect) && <details><summary>More options</summary><div className="result-screen-options">{onSave && <button className="secondary" onClick={onSave}><FolderOpen size={17}/>Save to My files</button>}{onOriginal && <button className="secondary" onClick={larger ? onDownload : onOriginal}>{larger ? 'Download processed PDF' : 'Download original PDF'}</button>}{onProtect && <button className="secondary" onClick={onProtect}>Add password</button>}</div></details>}
            {output.report && <details><summary>Processing details</summary><pre>{output.report}</pre></details>}
        </div>
    </section>;
}
