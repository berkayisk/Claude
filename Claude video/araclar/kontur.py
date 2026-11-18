#!/usr/bin/env python3
"""Dekupe PNG'ye krem iç + turuncu dış kontur ekler (İlk Ağızdan kartı stili).
Kullanım: python3 araclar/kontur.py girdi.png cikti.png [krem_px=14] [turuncu_px=12]"""
import sys
from PIL import Image, ImageFilter, ImageChops
src, dst = sys.argv[1], sys.argv[2]
k = int(sys.argv[3]) if len(sys.argv) > 3 else 14
t = int(sys.argv[4]) if len(sys.argv) > 4 else 12
im = Image.open(src).convert("RGBA")
pad = k + t + 10
base = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
base.paste(im, (pad, pad), im)
a = base.split()[3].point(lambda v: 255 if v > 100 else 0)
def genislet(m, r):
    m = m.filter(ImageFilter.GaussianBlur(r / 2)).point(lambda v: 255 if v > 8 else 0)
    return m.filter(ImageFilter.GaussianBlur(1.2))
a1 = genislet(a, k); a2 = genislet(a, k + t)
out = Image.new("RGBA", base.size, (0, 0, 0, 0))
out.paste(Image.new("RGBA", base.size, (246, 113, 2, 255)), (0, 0), a2)
out.paste(Image.new("RGBA", base.size, (244, 241, 226, 255)), (0, 0), a1)
out.alpha_composite(base)
out.save(dst); print("kaydedildi:", dst, out.size)
