import {ArrowUpDown,Archive,BookCopy,Bookmark,BookmarkMinus,BookmarkPlus,Braces,Calculator,Combine,Contrast,Crop,Download,Droplets,Eraser,EyeOff,FileCode,FileInput,FileMinus,FilePlus,FileSignature,FileSpreadsheet,FileText,FileType,FileX,Fingerprint,FlipHorizontal,GitCompare,Headphones,Highlighter,ImageDown,Info,KeyRound,LayoutGrid,Link2,ListOrdered,Lock,Maximize,Paperclip,Presentation,ScanText,Scissors,Search,Shrink,Stamp,Tags,Unlock,Wrench} from 'lucide-react';
import {ToolIcon} from '@/components/tool-icon';
const rules:[RegExp,typeof FileText][]=[
[/compress|shrink|reduce/,Shrink],[/merge|combine|join/,Combine],[/split|extract-pages|halve|chapters|burst/,Scissors],
[/delete.*(page|keyword)|remove-pages|remove-blank|blank-page/,FileMinus],[/insert|add-blank|create-pdf|new-page/,FilePlus],
[/links?\b/,Link2],[/remove-bookmark/,BookmarkMinus],[/add-bookmark/,BookmarkPlus],[/bookmark/,Bookmark],
[/word-count|count/,Calculator],[/document-info|metadata|properties/,Info],[/markdown|html/,FileCode],[/json/,Braces],
[/attachment|attach/,Paperclip],[/extract.*image|images-from|pdf-to-(jpg|png|webp|image)/,ImageDown],[/booklet|nup|n-up/,BookCopy],
[/keyword|find|search/,Search],[/highlight/,Highlighter],[/stamp|logo/,Stamp],[/encrypt|protect|password-protect|lock/,Lock],[/decrypt|unlock/,Unlock],
[/excel|xlsx|csv|sheet/,FileSpreadsheet],[/word|docx/,FileType],[/ppt|slides/,Presentation],[/redact|remove-(text|annotation|link)|sanitize|clean/,Eraser],
[/privacy|hide/,EyeOff],[/sign/,FileSignature],[/hash|fingerprint/,Fingerprint],[/flip|mirror/,FlipHorizontal],[/reverse|reorder|sort|organi/,ArrowUpDown],
[/resize|scale/,Maximize],[/crop/,Crop],[/ocr|scan/,ScanText],[/repair|fix/,Wrench],[/number|bates/,ListOrdered],[/audio|read-aloud|speak/,Headphones],
[/compare|diff/,GitCompare],[/watermark/,Droplets],[/gray|invert|contrast/,Contrast],[/key|form-data/,KeyRound],[/form/,FileInput],[/zip|archive/,Archive],
[/label|tag/,Tags],[/export|download/,Download],[/overlay|background|letterhead/,LayoutGrid],[/delete|remove/,FileX]];
export function ToolIdIcon({id,icon}:{id:string;icon:string}){const hit=rules.find(([r])=>r.test(id));if(!hit)return <ToolIcon name={icon}/>;const I=hit[1];return <I size={22} aria-hidden="true"/>;}
