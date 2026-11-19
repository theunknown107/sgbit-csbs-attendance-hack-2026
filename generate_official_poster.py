import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1600, 2260
im = Image.new('RGB', (W, H), '#ffffff')
draw = ImageDraw.Draw(im)

# Colors
NAVY_DEEP = (10, 25, 47)
NAVY_LIGHT = (15, 34, 64)
GOLD = (217, 119, 6)
GOLD_LIGHT = (251, 191, 36)
RED_ACCENT = (225, 29, 72)
TEXT_DARK = (15, 23, 42)
TEXT_MUTED = (71, 85, 105)
CARD_BG = (248, 250, 252)
BORDER_COLOR = (226, 232, 240)

# Fonts
def get_font(name, size):
    path = os.path.join('C:/Windows/Fonts', name)
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

font_title_bold = get_font('segoeuib.ttf', 44)
font_dept = get_font('segoeuib.ttf', 38)
font_sub = get_font('segoeui.ttf', 26)
font_headline = get_font('segoeuib.ttf', 68)
font_headline_sub = get_font('segoeuib.ttf', 36)
font_body = get_font('segoeui.ttf', 28)
font_body_bold = get_font('segoeuib.ttf', 28)
font_small = get_font('segoeui.ttf', 22)
font_small_bold = get_font('segoeuib.ttf', 22)
font_mono = get_font('consolab.ttf', 26)

# 1. Top Institutional Banner
draw.rectangle([(0, 0), (W, 280)], fill=NAVY_DEEP)
draw.rectangle([(0, 280), (W, 290)], fill=GOLD)

# Load SGBIT Logo
logo_path = 'assets/sgbit_logo.png'
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    logo = logo.resize((210, 210), Image.Resampling.LANCZOS)
    im.paste(logo, (70, 35), logo)

# Header Text
draw.text((310, 45), "S. S. EDUCATION TRUST'S", fill=GOLD_LIGHT, font=font_small_bold)
draw.text((310, 75), "S. G. BALEKUNDRI INSTITUTE OF TECHNOLOGY", fill=(255, 255, 255), font=font_title_bold)
draw.text((310, 135), "Affiliated to VTU, Belagavi | Approved by AICTE, New Delhi | Accredited by NAAC", fill=(203, 213, 225), font=font_sub)
draw.text((310, 180), "DEPARTMENT OF COMPUTER SCIENCE & BUSINESS SYSTEMS (CSBS)", fill=GOLD_LIGHT, font=font_dept)

# 2. Urgent Circular Tag
draw.rectangle([(80, 320), (W - 80, 390)], fill=(254, 242, 242), outline=RED_ACCENT, width=2)
draw.text((W // 2, 355), "OFFICIAL ACADEMIC NOTICE • SESSION ATTENDANCE VERIFICATION", fill=RED_ACCENT, font=font_body_bold, anchor="mm")

# 3. Main Headline
draw.text((W // 2, 460), "SCAN FOR FREE ATTENDANCE", fill=TEXT_DARK, font=font_headline, anchor="mm")
draw.text((W // 2, 530), "Mandatory Student Check-In & Central VTU Ledger Credit", fill=GOLD, font=font_headline_sub, anchor="mm")
draw.text((W // 2, 580), "Scan the official QR code below to record your presence for today's session.", fill=TEXT_MUTED, font=font_body, anchor="mm")

# 4. Central QR Code Card
card_x1, card_y1 = (W - 740) // 2, 630
card_x2, card_y2 = card_x1 + 740, card_y1 + 830

# Drop shadow & card
draw.rectangle([(card_x1 + 8, card_y1 + 8), (card_x2 + 8, card_y2 + 8)], fill=(226, 232, 240))
draw.rectangle([(card_x1, card_y1), (card_x2, card_y2)], fill=(255, 255, 255), outline=NAVY_DEEP, width=4)

# Inner gold accent corners
corner_len = 35
# Top Left
draw.line([(card_x1 + 10, card_y1 + 10), (card_x1 + 10 + corner_len, card_y1 + 10)], fill=GOLD, width=4)
draw.line([(card_x1 + 10, card_y1 + 10), (card_x1 + 10, card_y1 + 10 + corner_len)], fill=GOLD, width=4)
# Top Right
draw.line([(card_x2 - 10, card_y1 + 10), (card_x2 - 10 - corner_len, card_y1 + 10)], fill=GOLD, width=4)
draw.line([(card_x2 - 10, card_y1 + 10), (card_x2 - 10, card_y1 + 10 + corner_len)], fill=GOLD, width=4)
# Bottom Left
draw.line([(card_x1 + 10, card_y2 - 10), (card_x1 + 10 + corner_len, card_y2 - 10)], fill=GOLD, width=4)
draw.line([(card_x1 + 10, card_y2 - 10), (card_x1 + 10, card_y2 - 10 - corner_len)], fill=GOLD, width=4)
# Bottom Right
draw.line([(card_x2 - 10, card_y2 - 10), (card_x2 - 10 - corner_len, card_y2 - 10)], fill=GOLD, width=4)
draw.line([(card_x2 - 10, card_y2 - 10), (card_x2 - 10, card_y2 - 10 - corner_len)], fill=GOLD, width=4)

# Generate high-res QR code
target_url = 'https://theunknown107.github.io/sgbit-csbs-attendance-hack-2026/'
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=16,
    border=2,
)
qr.add_data(target_url)
qr.make(fit=True)
qr_img = qr.make_image(fill_color=NAVY_DEEP, back_color='white').convert('RGB')
qr_img = qr_img.resize((620, 620), Image.Resampling.LANCZOS)

# Paste QR in center of card
im.paste(qr_img, ((W - 620) // 2, card_y1 + 50))

# Card sub-labels
draw.text((W // 2, card_y1 + 710), "SCAN WITH ANY SMARTPHONE CAMERA / GOOGLE LENS", fill=NAVY_DEEP, font=font_small_bold, anchor="mm")
draw.text((W // 2, card_y1 + 750), "Direct Link: theunknown107.github.io/sgbit-csbs-attendance-hack-2026", fill=TEXT_MUTED, font=font_small, anchor="mm")
draw.rectangle([(card_x1 + 80, card_y1 + 785), (card_x2 - 80, card_y1 + 787)], fill=BORDER_COLOR)

# 5. Instructions Section
draw.rectangle([(80, 1500), (W - 80, 1860)], fill=CARD_BG, outline=BORDER_COLOR, width=2)

draw.text((120, 1530), "PROCEDURE FOR ATTENDANCE CLAIM:", fill=NAVY_DEEP, font=font_body_bold)

steps = [
    ("1", "Scan QR Code", "Aim your camera at the QR code above or tap the departmental portal link."),
    ("2", "Input Student USN", "Enter your 10-digit University Seat Number (e.g., 2BU24CB076) and Full Name."),
    ("3", "Select Division & Verify", "Choose your division (Div A, B, or C) and tap 'Claim Free Attendance'.")
]

step_y = 1590
for num, title, desc in steps:
    # Step Number Badge
    draw.ellipse([(120, step_y), (170, step_y + 50)], fill=NAVY_DEEP)
    draw.text((145, step_y + 25), num, fill=(255, 255, 255), font=font_body_bold, anchor="mm")
    
    # Step Text
    draw.text((195, step_y + 8), title, fill=TEXT_DARK, font=font_body_bold)
    draw.text((195, step_y + 42), desc, fill=TEXT_MUTED, font=font_sub)
    step_y += 85

# 6. Important Notice Box
draw.rectangle([(80, 1890), (W - 80, 2030)], fill=(255, 251, 235), outline=GOLD, width=2)
draw.text((120, 1925), "ATTENTION ALL CSBS STUDENTS:", fill=GOLD, font=font_body_bold)
draw.text((120, 1965), "Each student is permitted exactly one entry per session. Session credits are synced directly with the VTU", fill=TEXT_DARK, font=font_sub)
draw.text((120, 1995), "central database. Do not share your credentials with unauthorized individuals.", fill=TEXT_DARK, font=font_sub)

# 7. Official Seal / Footer
draw.line([(80, 2070), (W - 80, 2070)], fill=BORDER_COLOR, width=2)
draw.text((100, 2110), "REF NO: SGBIT/CSBS/2026/ATTN-04", fill=TEXT_MUTED, font=font_small_bold)
draw.text((100, 2145), "PORTAL: VTU ACADEMIC REGISTRY NODE 04", fill=TEXT_MUTED, font=font_small)

draw.text((W // 2, 2125), "STATUS: SYSTEM ACTIVE & LOGGING", fill=RED_ACCENT, font=font_small_bold, anchor="mm")

draw.text((W - 100, 2110), "AUTHORIZED SIGNATORY", fill=TEXT_DARK, font=font_small_bold, anchor="ra")
draw.text((W - 100, 2145), "Dept. of CSBS, SGBIT Belagavi", fill=TEXT_MUTED, font=font_small, anchor="ra")

# Bottom Navy Stripe
draw.rectangle([(0, 2220), (W, H)], fill=NAVY_DEEP)

# Save
im.save('assets/poster_free_attendance.png', quality=95)
im.save('assets/poster_free_attendance.jpg', quality=95)
print('Official poster generated successfully at 1600x2260')
