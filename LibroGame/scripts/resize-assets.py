#!/usr/bin/env python3
"""
Ridimensiona gli asset PNG dell'app a dimensioni realistiche di rendering.

Riduce drasticamente il peso file e il tempo di decodifica delle immagini
mantenendo il margine necessario per display retina (2x).

Idempotente: salta i file gia' sotto il target size.
Sovrascrive i PNG in place. Usare git per recuperare gli originali in caso di problemi.
"""
import os
import sys
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ASSETS = os.path.join(ROOT, 'assets')

# (cartella, longest_side_max) — calibrato su dimensioni reali di rendering
# Con ARCH_SCALE=3, TENT_SCALE=3.8 e size 48-110, i nodi mappa sono renderizzati
# a max ~420px lato lungo. 1024 da' un margine 2.5x abbondante per retina.
TARGETS = [
    ('map',         1024),  # circus_map, node_frame, node_tents, node_banner
    ('characters',  1200),  # sprite NPC (mostrati anche full-bleed in CircoStanza)
    ('backgrounds', 2048),  # sfondi stanze (mostrati full screen)
    ('hints',       1200),  # hint ritagli (mostrati sopra al background)
]


def resize_png(path, max_side):
    img = Image.open(path)
    w, h = img.size
    longest = max(w, h)
    if longest <= max_side:
        return None  # gia' ok, skip
    ratio = max_side / longest
    new_w = max(1, round(w * ratio))
    new_h = max(1, round(h * ratio))
    resized = img.resize((new_w, new_h), Image.LANCZOS)
    # Forza RGBA per coerenza (alcuni PNG potrebbero essere P o RGB)
    if resized.mode != 'RGBA':
        resized = resized.convert('RGBA')
    # optimize=True e compress_level=9 riducono ulteriormente il peso
    resized.save(path, 'PNG', optimize=True, compress_level=9)
    return (w, h, new_w, new_h)


def fmt_bytes(n):
    for unit in ('B', 'KB', 'MB'):
        if n < 1024:
            return f"{n:6.1f} {unit}"
        n /= 1024
    return f"{n:6.1f} GB"


def main():
    total_before = 0
    total_after = 0
    for folder, max_side in TARGETS:
        full_path = os.path.join(ASSETS, folder)
        if not os.path.isdir(full_path):
            print(f"SKIP {folder}: dir non trovata ({full_path})")
            continue
        print(f"\n=== {folder} (max {max_side}px) ===")
        for fname in sorted(os.listdir(full_path)):
            if not fname.lower().endswith('.png'):
                continue
            fpath = os.path.join(full_path, fname)
            size_before = os.path.getsize(fpath)
            total_before += size_before
            try:
                result = resize_png(fpath, max_side)
            except Exception as e:
                print(f"  ERROR {fname}: {e}")
                total_after += size_before
                continue
            size_after = os.path.getsize(fpath)
            total_after += size_after
            if result is None:
                print(f"  skip {fname:30s} ({fmt_bytes(size_before)}, gia' sotto target)")
            else:
                w, h, nw, nh = result
                print(f"  ok   {fname:30s} {w}x{h} -> {nw}x{nh}  "
                      f"{fmt_bytes(size_before)} -> {fmt_bytes(size_after)}")

    print(f"\n=== TOTALE ===")
    print(f"prima: {fmt_bytes(total_before)}")
    print(f"dopo:  {fmt_bytes(total_after)}")
    saved = total_before - total_after
    if total_before > 0:
        print(f"risparmio: {fmt_bytes(saved)} ({100*saved/total_before:.1f}%)")


if __name__ == '__main__':
    main()
