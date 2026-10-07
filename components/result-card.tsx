'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {ArrowLeft, Download, FolderOpen, Pencil, Copy} from 'lucide-react';
import {formatBytes} from '@/components/file-facts';
import './result-screen.css';
import {Dialog, DialogContent, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {SupportLink} from '@/components/support-link';

type Output = {blob: Blob; name: string; report?: string; inputSize?: number;warnings?:string[];target?:{requestedKB:number;met:boolean}};
export function ResultCard({output, open, onOpenChange, before, compress, onDownload, onOriginal, onContinue, onNextTool, onStartOver, onSave, onSettings, onProtect, error, previewContent}: {
    output: Output; open: boolean; onOpenChange?: (value: boolean) => void;
    before?: {files: number; pages: number; size: number; unit: 'page' | 'image'}; compress?: boolean;
    onDownload: () => void; onOriginal?: () => void; onContinue?: () => void;
    onNextTool?: (id: string) => void; onStartOver?: () => void; onSave?: () => void;
    onSettings: () => void; onProtect?: () => void; error?: string; previewContent?: ReactNode;
}) {
    const [preview, setPreview] = useState(false);const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState('');
    const downloadButton = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!open) return;
        const frame = requestAnimationFrame(() => {
            setPreview(false);setCopied(false);setCopyError('');

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
    return <Dialog open={open} onOpenChange={value=>{onOpenChange?.(value);if(!value)onSettings();}}><DialogContent className="result-dialog" onOpenAutoFocus={event=>{event.preventDefault();downloadButton.current?.focus();}}><section className="result-screen" aria-labelledby="result-heading">
        <div className="result-screen-success" aria-hidden="true">
            <span className="result-success-halo"/>
            <span className="result-success-spark result-success-spark-one"/>
            <span className="result-success-spark result-success-spark-two"/>
            <span className="result-success-spark result-success-spark-three"/>
            <span className="result-success-spark result-success-spark-four"/>
            <svg className="result-success-icon" viewBox="0 0 80 80" fill="none">
                <circle className="result-success-disc" cx="40" cy="40" r="34"/>
                <circle className="result-success-ring" cx="40" cy="40" r="34" pathLength="1"/>
                <path className="result-success-tick" d="M25 40.5 35.5 51 56 30" pathLength="1"/>
            </svg>
        </div>
        <DialogTitle id="result-heading">Your {label} is ready</DialogTitle><DialogDescription>Made on your device. No document upload.</DialogDescription>
        <p className="result-screen-file">{output.name} <span>· {formatBytes(output.blob.size)}</span></p>
        {inputSize > 0 && <p className="result-screen-size">{!compress?`${formatBytes(inputSize)} → ${formatBytes(output.blob.size)}`:saved > 0 ? `${saved}% smaller · ${formatBytes(inputSize)} → ${formatBytes(output.blob.size)}` : larger ? 'The original is smaller. Download it below, or change your settings.' : 'This PDF is already compact. You can download it or change your settings.'}</p>}
        {output.target&&<p className="result-screen-size" role="status">{output.target.met?'Target met':'Target not met'} · Result {(output.blob.size/1000).toFixed(1)} KB / target {output.target.requestedKB} KB</p>}
        {output.warnings?.map(warning=><p key={warning} className="result-output-warning" role="status">{warning}</p>)}
        <div className="result-main-actions"><button ref={downloadButton} className="primary result-screen-download" onClick={larger && onOriginal ? onOriginal : onDownload}><Download size={24}/>{larger && onOriginal ? 'Download original PDF' : `Download ${label}`}</button>{onSave && <button className="secondary" onClick={onSave}><FolderOpen size={17}/>Save to My files</button>}</div>
        <div className="result-screen-return"><button className="link-button" onClick={onSettings}><ArrowLeft size={17}/>Change settings</button>{onStartOver && <button className="link-button" onClick={onStartOver}>Start over</button>}</div>
        {(onContinue || onNextTool) && <details className="result-next-details"><summary>Use another tool</summary><section className="result-screen-next" aria-label="Continue with your PDF"><h2>Continue with this PDF</h2><div>{onContinue && <button className="secondary" onClick={onContinue}><Pencil size={17}/>Continue editing</button>}{onNextTool && (onContinue ? [['compress', 'Compress'], ['sign', 'Sign']] : [['edit', 'Edit PDF'], ['compress', 'Compress'], ['sign', 'Sign']]).map(([id, text]) => <button className="secondary" key={id} onClick={() => onNextTool(id)}>{text}</button>)}</div></section></details>}
        {error && <p className="native-error" role="alert">{error}</p>}
        {!pdf&&output.report&&<button className="secondary" onClick={()=>{void navigator.clipboard.writeText(output.report!).then(()=>setCopied(true)).catch(()=>setCopyError('Copy unavailable. Select the text in What changed or download the report.'));}}><Copy size={16}/>{copied?'Copied':'Copy report'}</button>}{copyError&&<p role="status">{copyError}</p>}<div className="result-screen-details">
            {pdf && previewContent && <details onToggle={event => setPreview(event.currentTarget.open)}><summary>Preview PDF</summary>{preview && previewContent}</details>}
            {(onOriginal || onProtect) && <details><summary>More options</summary><div className="result-screen-options">{onOriginal && <button className="secondary" onClick={larger ? onDownload : onOriginal}>{larger ? 'Download processed PDF' : 'Download original PDF'}</button>}{onProtect && <button className="secondary" onClick={onProtect}>Add password</button>}</div></details>}
            {output.report && <details open={!pdf}><summary>What changed</summary><pre>{output.report}</pre></details>}
        </div>
        <SupportLink success/>
    </section></DialogContent></Dialog>;
}
