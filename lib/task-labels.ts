export function formattedNumber(n:number,format='decimal',total=1){
 if(format==='roman'){let value=n,word='';for(const [v,t] of [[1000,'m'],[900,'cm'],[500,'d'],[400,'cd'],[100,'c'],[90,'xc'],[50,'l'],[40,'xl'],[10,'x'],[9,'ix'],[5,'v'],[4,'iv'],[1,'i']] as [number,string][]){while(value>=v){word+=t;value-=v;}}return word;}
 if(format==='alpha'){let word='',value=n;while(value>0){value--;word=String.fromCharCode(65+value%26)+word;value=Math.floor(value/26);}return word;}
 return format==='page'?`Page ${n}`:format==='total'?`${n} of ${total}`:String(n);
}
export function labelText(text:string,page:number,total:number,date=new Date().toLocaleDateString('en-IN')){return text.replaceAll('{page}',String(page)).replaceAll('{total}',String(total)).replaceAll('{date}',date);}
