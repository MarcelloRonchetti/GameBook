#!/usr/bin/env python3
"""
Converte i PNG di backgrounds/characters/hints in WebP qualita' 85.

Effetto: file 50-70% piu' piccoli rispetto al PNG, decode bitmap su Android
piu' veloce e meno memoria allocata. Risolve i lag e i "carica solo dopo
uscire e rientrare" sui telefoni.

Idempotente: se il .webp esiste gia' ed e' piu' recente del .png, salta.
Cancella il .png originale dopo la conversione (l'originale resta in git).

Asset NON convertiti (restano PNG):
  - map/* (asset piccoli, anche il banner usa tintColor che spesso
    funziona meglio con PNG)
  - app-icons/* (Expo richiede PNG per icon/adaptive-icon/splash/favicon)
"""
import os
import sys
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ASSETS = os.path.join(ROOT, 'assets')

# (cartella, longest_side_max, webp_quality)
TARGETS = [
    ('backgrounds', 1280, 85),  # full-screen scene background — 1280 sufficiente per phone
    ('characters',  1024, 90),  # sprite NPC — quality leggermente piu' alta per i bordi
    ('hints',       1024, 88),  # hint flash sopra il bg
]


def convert_to_webp(png_path, max_side, quality):
    """Converte un PNG in WebP. Ritorna (size_before, size_after) o None se skip."""
    webp_path = os.path.splitext(png_path)[0] + '.webp'

    # Idempotente: se il WebP esiste ed e' piu' recente, salta.
    if os.path.exists(webp_path):
        if os.path.getmtime(webp_path) >= os.path.getmtime(png_path):
            # WebP gia' aggiornato. Cancella eventuale PNG residuo per pulizia.
            size_before = os.path.getsize(png_path)
            os.remove(png_path)
            return ('cleaned', size_before, os.path.getsize(webp_path))

    img = Image.open(png_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Ridimensiona se sopra il target
    w, h = img.size
    longest = max(w, h)
    if longest > max_side:
        ratio = max_side / longest
        new_w = max(1, round(w * ratio))
        new_h = max(1, round(h * ratio))
        img = img.resize((new_w, new_h), Image.LANCZOS)

    size_before = os.path.getsize(png_path)
    img.save(webp_path, 'WEBP', quality=quality, method=6)
    size_after = os.path.getsize(webp_path)

    # Cancella l'originale PNG (resta in git history)
    os.remove(png_path)

    return ('converted', size_before, size_after)


def fmt_bytes(n):
    for unit in ('B', 'KB', 'MB'):
        if n < 1024:
            return f"{n:6.1f} {unit}"
        n /= 1024
    return f"{n:6.1f} GB"


def main():
    total_before = 0
    total_after = 0
    converted_count = 0
    cleaned_count = 0
    for folder, max_side, quality in TARGETS:
        full_path = os.path.join(ASSETS, folder)
        if not os.path.isdir(full_path):
            print(f"SKIP {folder}: dir non trovata ({full_path})")
            continue
        print(f"\n=== {folder} (max {max_side}px, quality {quality}) ===")
        for fname in sorted(os.listdir(full_path)):
            if not fname.lower().endswith('.png'):
                continue
            fpath = os.path.join(full_path, fname)
            try:
                result = convert_to_webp(fpath, max_side, quality)
            except Exception as e:
                print(f"  ERROR {fname}: {e}")
                continue
            if result is None:
                continue
            action, sb, sa = result
            total_before += sb
            total_after += sa
            if action == 'converted':
                converted_count += 1
                print(f"  conv {fname:30s} {fmt_bytes(sb)} -> {fmt_bytes(sa)}  ({100*(sb-sa)/sb:.0f}% saved)")
            else:
                cleaned_count += 1
                print(f"  clean {fname:30s} (residuo PNG eliminato)")

    print(f"\n=== TOTALE ===")
    print(f"convertiti: {converted_count} | cleanup: {cleaned_count}")
    print(f"prima:  {fmt_bytes(total_before)}")
    print(f"dopo:   {fmt_bytes(total_after)}")
    saved = total_before - total_after
    if total_before > 0:
        print(f"risparmio: {fmt_bytes(saved)} ({100*saved/total_before:.1f}%)")


if __name__ == '__main__':
    main()
