"""Maintainer-only: collect SIL OFL fonts from a pinned Google Fonts revision."""
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import quote
from concurrent.futures import ThreadPoolExecutor
import json

REVISION = '7085eb89a950e85db5b166b7a58d414544b4140c'
FONTS = [
 ('caveat', 'Caveat[wght].ttf', 'Casual'),
 ('patrickhand', 'PatrickHand-Regular.ttf', 'Neat print'),
 ('kalam', 'Kalam-Regular.ttf', 'Soft pen'),
 ('indieflower', 'IndieFlower-Regular.ttf', 'Notebook'),
 ('shadowsintolight', 'ShadowsIntoLight.ttf', 'Tall pen'),
 ('architectsdaughter', 'ArchitectsDaughter-Regular.ttf', 'Architect'),
 ('handlee', 'Handlee-Regular.ttf', 'Rounded'),
 ('pangolin', 'Pangolin-Regular.ttf', 'Friendly'),
 ('coveredbyyourgrace', 'CoveredByYourGrace.ttf', 'School notes'),
 ('gloriahallelujah', 'GloriaHallelujah.ttf', 'Loose print'),
 ('gochihand', 'GochiHand-Regular.ttf', 'Bold pen'),
 ('petemoss', 'Petemoss-Regular.ttf', 'Narrow'),
 ('badscript', 'BadScript-Regular.ttf', 'Everyday'),
 ('reeniebeanie', 'ReenieBeanie.ttf', 'Quick notes'),
 ('nothingyoucoulddo', 'NothingYouCouldDo.ttf', 'Personal'),
 ('caveatbrush', 'CaveatBrush-Regular.ttf', 'Marker'),
 ('cedarvillecursive', 'Cedarville-Cursive.ttf', 'Joined script'),
 ('dancingscript', 'DancingScript[wght].ttf', 'Flowing'),
 ('allura', 'Allura-Regular.ttf', 'Elegant'),
 ('sacramento', 'Sacramento-Regular.ttf', 'Light cursive'),
]
root = Path(__file__).resolve().parents[1]
target = root / 'public/fonts/handwriting'
target.mkdir(parents=True, exist_ok=True)

def collect(entry):
    folder, filename, label = entry
    base = f'https://raw.githubusercontent.com/google/fonts/{REVISION}/ofl/{folder}/'
    with urlopen(base + quote(filename), timeout=60) as response:
        data = response.read()
    with urlopen(base + 'OFL.txt', timeout=60) as response:
        license_text = response.read()
    if b'SIL OPEN FONT LICENSE' not in license_text:
        raise ValueError(f'Missing OFL: {folder}')
    if data[:4] not in [b'\x00\x01\x00\x00', b'OTTO']:
        raise ValueError(f'Invalid font: {folder}')
    (target / f'{folder}.ttf').write_bytes(data)
    (target / f'{folder}-OFL.txt').write_bytes(license_text)
    return {'id':folder,'label':label,'file':f'{folder}.ttf','source':base+quote(filename)}

with ThreadPoolExecutor(max_workers=6) as pool:
    fonts = list(pool.map(collect, FONTS))
(target/'sources.json').write_text(json.dumps({'revision':REVISION,'fonts':fonts}, indent=2)+'\n')
print(f'Collected {len(fonts)} licensed handwriting fonts.')
