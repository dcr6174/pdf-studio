from pathlib import Path
import zipfile,json
root=Path(__file__).resolve().parent.parent
output=root/'public/pdf-studio-source.zip'
skip={'node_modules','.git','.openai','.sites-runtime','.wrangler','.vinext','.next','dist','outputs','work','.agents','.codex','checks/__pycache__'}
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(root.rglob('*')):
        if not p.is_file(): continue
        rel=p.relative_to(root)
        if any(part in skip for part in rel.parts): continue
        if p==output or p.name in {'openpdf-source.zip','wrangler.public.json','.dev.vars'} or p.name.startswith('.dev.vars.') or (p.name.startswith('.env') and p.name!='.env.example') or p.name.endswith('.tsbuildinfo') or p.name.startswith('.verify-') or p.name.endswith('.log'): continue
        z.write(p,'pdf-studio/'+str(rel))
print(f'{output} ({output.stat().st_size} bytes)')
