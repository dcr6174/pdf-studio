/** Shared labels/engine values for desktop radios and the compact mobile selector. */
export const compressionPresets=[
 {value:'compact',name:'Keep quality',hint:'Lossless repacking. Original image quality.'},
 {value:'images',name:'Balanced',hint:'Smaller images. Text stays selectable.'},
 {value:'image-small',name:'Smaller file',hint:'Stronger image reduction. Check fine print.'},
] as const;
