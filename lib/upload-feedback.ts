/** Keep validation limits visible only when an input is rejected. */
export function uploadFeedback(error:unknown):{message:string;technical?:string;reload:boolean}{
 const raw=error instanceof Error?error.message:'';
 const reload=/dynamically imported module|loading chunk|chunkloaderror|failed to fetch module|setting up fake worker failed|worker.*(load|fetch).*failed|wasm.*(fetch|load).*failed|(?:font|tool asset|recognition).*(?:could not load|failed to load)/i.test(raw);
 if(reload)return {message:'A tool asset could not load after an update or network interruption. Your document is retained. Save your draft and reload this tool to retry.',reload:true};
 if(/encrypted|password/i.test(raw))return {message:'This PDF is password-protected. Open Remove password and enter a password you know, then continue editing.',reload:false};
 // Validation messages are intentionally specific, including the limit that rejected the input.
 if(/^(Choose |This tool accepts|These files total|This would create|You selected|This document |This image |This page |This photo |Opening |Could not decode|The image |Image |.*megapixels)/i.test(raw))return {message:raw,reload:false};
 return {message:'This file could not be read. Choose another file, or try opening and saving it in your PDF viewer first.',technical:raw||undefined,reload:false};
}
