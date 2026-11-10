import {BookmarkMinus,Paperclip,Unlink,Bookmark,Columns2,BookOpen,MessageSquareOff,ListTodo,Merge,Grid2X2,Scissors,Files,Minimize2,RotateCw,ArrowDownUp,Copy,ArrowLeftRight,LayoutGrid,Crop,Maximize2,FlipHorizontal2,TextCursorInput,PenLine,Signature,ShieldCheck,Droplets,Hash,ListOrdered,PanelTop,Layers,ClipboardList,FileText,Images,Image,FileType,Code2,Presentation,Table,Plus,Braces,FileSpreadsheet,ScanText,Volume2,Columns3,LockKeyhole,UnlockKeyhole,Search,Brush,Fingerprint,Archive,Wrench,SunMoon,Camera} from 'lucide-react';
export const toolIcons:Record<string,typeof FileText>={
 'pdf-to-handwriting':PenLine,workflow:ListTodo,'blank-check':Search,reader:BookOpen,'split-chapters':Bookmark,webp:Image,'remove-bookmarks':BookmarkMinus,'remove-attachments':Paperclip,'remove-links':Unlink,
 bookmarks:Bookmark,halve:Columns2,viewer:BookOpen,'remove-annotations':MessageSquareOff,'create-form':ListTodo,
 merge:Merge,organize:Grid2X2,split:Scissors,'split-all':Files,compress:Minimize2,rotate:RotateCw,reverse:ArrowDownUp,duplicate:Copy,interleave:ArrowLeftRight,nup:LayoutGrid,crop:Crop,resize:Maximize2,flip:FlipHorizontal2,
 'native-text':TextCursorInput,edit:PenLine,sign:Signature,redact:ShieldCheck,watermark:Droplets,numbers:Hash,bates:ListOrdered,headers:PanelTop,flatten:Layers,form:ClipboardList,metadata:FileText,
 scan:Camera,images:Images,jpg:Image,png:Image,text:FileType,word:FileText,html:Code2,epub:BookOpen,pptx:Presentation,xlsx:Table,csv:Table,create:Plus,markdown:Braces,docx:FileText,sheet:FileSpreadsheet,ebook:BookOpen,grayscale:Brush,invert:SunMoon,ocr:ScanText,audio:Volume2,compare:Columns3,encrypt:LockKeyhole,decrypt:UnlockKeyhole,privacy:Search,clean:Brush,hash:Fingerprint,zip:Archive,repair:Wrench
};
import {FilePlus2 as L_FilePlus2,Frame as L_Frame,ListFilter as L_ListFilter,Paperclip as L_Paperclip,Scan as L_Scan,Slice as L_Slice} from 'lucide-react';
toolIcons["add-blank-pages"]=L_FilePlus2;
toolIcons["split-by-page-count"]=L_Slice;
toolIcons["odd-even-pages"]=L_ListFilter;
toolIcons["add-page-border"]=L_Frame;
toolIcons["add-pdf-margins"]=L_Scan;
toolIcons["extract-pdf-attachments"]=L_Paperclip;
import {FileInput as L_FileInput,FileOutput as L_FileOutput,Highlighter as L_Highlighter,ImagePlus as L_ImagePlus,Layers as L_Layers,Lock as L_Lock,ShieldCheck as L_ShieldCheck,Stamp as L_Stamp} from 'lucide-react';
toolIcons["insert-pdf-pages"]=L_FileInput;
toolIcons["overlay-pdf"]=L_Layers;
toolIcons["add-pdf-background"]=L_Frame;
toolIcons["stamp-pdf"]=L_Stamp;
toolIcons["add-logo-to-pdf"]=L_ImagePlus;
toolIcons["highlight-text-in-pdf"]=L_Highlighter;
toolIcons["flatten-form-fields"]=L_ShieldCheck;
toolIcons["lock-form-fields"]=L_Lock;
toolIcons["export-pdf-form-data"]=L_FileOutput;
