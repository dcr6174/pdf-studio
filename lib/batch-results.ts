/** Quoted CSV with spreadsheet formula neutralization for untrusted file names/errors. */
export function batchResultsCSV(rows:string[][]){
 return [['Input','Status','Output','Bytes','Notes'],...rows].map(row=>row.map(raw=>{const value=/^[\s]*[=+\-@]/.test(raw)?"'"+raw:raw;return '"'+value.replaceAll('"','""')+'"';}).join(',')).join('\r\n');
}
