import base64
from PIL import Image, ImageDraw

mono = Image.open('public/brand/logo-monogram.png').convert('RGBA')

def create_card(size, corner_radius, padding):
    card = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)
    
    # Draw rounded rectangle in ivory #F7F2EA with gold border #C9A96B
    draw.rounded_rectangle([(1, 1), (size - 2, size - 2)], radius=corner_radius, fill='#F7F2EA', outline='#C9A96B', width=max(1, size // 32))
    
    # Resize mono preserving aspect ratio
    available = size - 2 * padding
    mono_ratio = mono.width / mono.height
    if mono_ratio > 1:
        w = available
        h = int(w / mono_ratio)
    else:
        h = available
        w = int(h * mono_ratio)
    
    resized_mono = mono.resize((w, h), Image.Resampling.LANCZOS)
    x = (size - w) // 2
    y = (size - h) // 2
    card.paste(resized_mono, (x, y), resized_mono)
    return card

# 1. Generate PNGs
ico_16 = create_card(16, 3, 2)
ico_32 = create_card(32, 6, 4)
ico_48 = create_card(48, 9, 6)
ico_32.save('public/favicon-32x32.png')
ico_16.save('public/favicon-16x16.png')

# 2. Multi-resolution ICO
ico_32.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[ico_16, ico_48])

# 3. Apple Touch Icon (180x180)
apple_icon = create_card(180, 36, 24)
apple_icon.save('public/apple-touch-icon.png')

# 4. Vector SVG Favicon with embedded high-res brand monogram
with open('public/brand/logo-monogram.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect x="3" y="3" width="122" height="122" rx="24" fill="#F7F2EA" stroke="#C9A96B" stroke-width="4"/>
  <image href="data:image/png;base64,{b64}" x="16" y="16" width="96" height="96" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("All favicons successfully generated!")

