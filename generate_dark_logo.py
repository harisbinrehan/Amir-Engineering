from PIL import Image

def process_image():
    img = Image.open('public/brand/amir-engineering-logo-cropped.png').convert('RGBA')
    data = img.getdata()
    
    new_data = []
    for r, g, b, a in data:
        if a == 0:
            new_data.append((r, g, b, a))
            continue
            
        # Check if it's dark blueish (text and inner gear)
        # Dark blue colors are usually R<100, G<150, B<180
        # Wait, what if it's anti-aliased edges? We need to retain the alpha but change the color.
        # Actually, let's boost lightness of dark pixels to white.
        # If R, G, B are all relatively low, we just make it white.
        # Orange is high R, medium G, low B.
        if r < 180 and b > r: # Blue is dominant or it's dark
            # Make it white
            # To handle anti-aliasing smoothly, we can blend or just set to 255.
            new_data.append((255, 255, 255, a))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    img.save('public/brand/amir-engineering-logo-dark.png')

process_image()
