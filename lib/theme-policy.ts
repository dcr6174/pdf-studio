/** Run in the document head before paint; storage failure still follows the device. */
export const themeBootstrapScript="(()=>{try{let t;try{t=localStorage.getItem('pdf-studio-appearance')}catch{}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch{}})()";
