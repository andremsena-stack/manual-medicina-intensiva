from PIL import Image, ImageChops
import os

HERE = os.path.dirname(os.path.abspath(__file__))
raw = os.path.join(HERE, 'iphone_mockup_raw.png')
out = os.path.join(HERE, 'iphone_mockup.png')

img = Image.open(raw).convert('RGBA')
r, g, b, a = img.split()
# min(R,G,B) per pixel via two ImageChops.darker passes (operacao em C, rapida)
min_rgb = ImageChops.darker(ImageChops.darker(r, g), b)
# constroi novo canal alpha:
#   min > 240  -> 0   (branco -> transparente)
#   min > 220  -> 80  (sombra suave -> semi-transparente)
#   senao      -> 255 (mantem opacidade)
new_alpha = min_rgb.point(lambda p: 0 if p > 240 else (80 if p > 220 else 255))
out_img = Image.merge('RGBA', (r, g, b, new_alpha))
out_img.save(out)
print('OK', os.path.getsize(out), 'bytes')
