"""Optimiza las texturas de un modelo .glb para el visor web.

Uso (requiere Python 3 y Pillow):
    python3 scripts/optimize-glb.py original.glb public/models/characters/Nombre.glb [2048]

- Reduce las texturas a 2048 px (o el tamaño indicado).
- Sin transparencia -> JPEG (mapas normales con 4:4:4 y mayor calidad).
- Con transparencia -> PNG optimizado.
- Geometría, materiales, esqueleto y animaciones no se modifican.

Después de reemplazar un modelo, cambiar MODELS_VERSION en
src/modelsVersion.ts para que la caché sin conexión descargue la versión nueva.
"""
import sys, struct, json, io
from PIL import Image

MAX = int(sys.argv[3]) if len(sys.argv) > 3 else 2048

def pad4(b, fill=b'\x00'):
    return b + fill * ((4 - len(b) % 4) % 4)

def main(src, dst):
    raw = open(src, 'rb').read()
    magic, version, _ = struct.unpack_from('<III', raw, 0)
    assert magic == 0x46546C67 and version == 2, 'no es GLB 2.0'
    jlen, jtype = struct.unpack_from('<II', raw, 12)
    g = json.loads(raw[20:20 + jlen])
    boff = 20 + jlen
    blen, btype = struct.unpack_from('<II', raw, boff)
    binc = raw[boff + 8: boff + 8 + blen]

    roles = {}
    for mat in g.get('materials', []):
        if mat.get('normalTexture'):
            roles.setdefault(g['textures'][mat['normalTexture']['index']]['source'], set()).add('normal')

    views = g['bufferViews']
    new_data = {}
    for i, img in enumerate(g.get('images', [])):
        v = views[img['bufferView']]
        data = binc[v.get('byteOffset', 0): v.get('byteOffset', 0) + v['byteLength']]
        im = Image.open(io.BytesIO(data))
        im.load()
        has_alpha = im.mode in ('RGBA', 'LA', 'PA') and im.convert('RGBA').getchannel('A').getextrema() != (255, 255)
        if max(im.size) > MAX:
            s = MAX / max(im.size)
            im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        out = io.BytesIO()
        if has_alpha:
            im.save(out, 'PNG', optimize=True)
            mime = 'image/png'
        else:
            normal = 'normal' in roles.get(i, ())
            im.convert('RGB').save(out, 'JPEG', quality=92 if normal else 88,
                                   subsampling=0 if normal else 2, optimize=True, progressive=False)
            mime = 'image/jpeg'
        enc = out.getvalue()
        if len(enc) >= len(data) and mime == img.get('mimeType'):
            enc = data  # no empeorar
        new_data[img['bufferView']] = enc
        img['mimeType'] = mime

    # Reconstruir el BIN en el mismo orden, alineado a 4 bytes.
    chunks, offset = [], 0
    for idx, v in enumerate(views):
        data = new_data.get(idx)
        if data is None:
            data = binc[v.get('byteOffset', 0): v.get('byteOffset', 0) + v['byteLength']]
        v['byteOffset'] = offset
        v['byteLength'] = len(data)
        chunks.append(pad4(data))
        offset += len(chunks[-1])
    newbin = b''.join(chunks)
    g['buffers'][0]['byteLength'] = len(newbin)

    js = pad4(json.dumps(g, separators=(',', ':')).encode(), b' ')
    total = 12 + 8 + len(js) + 8 + len(newbin)
    with open(dst, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(js), 0x4E4F534A)); f.write(js)
        f.write(struct.pack('<II', len(newbin), 0x004E4942)); f.write(newbin)
    print(f'{src.split("/")[-1]}: {len(raw)/1e6:.1f} MB -> {total/1e6:.1f} MB')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
