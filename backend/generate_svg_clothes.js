const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

function createShirtSVG(color, pattern = 'solid', label = 'SHIRT') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" fill="#f8fafc" rx="16"/>
  <g transform="translate(40, 30)">
    <!-- Collar & Body -->
    <path d="M 60 50 L 110 30 L 160 50 L 200 80 L 180 120 L 160 100 L 160 230 L 60 230 L 60 100 L 40 120 L 20 80 Z" fill="${color}" stroke="#1e293b" stroke-width="3" stroke-linejoin="round"/>
    <!-- Collar Triangles -->
    <polygon points="110,30 85,65 110,75" fill="#ffffff" opacity="0.3"/>
    <polygon points="110,30 135,65 110,75" fill="#ffffff" opacity="0.2"/>
    <!-- Button Placket -->
    <line x1="110" y1="75" x2="110" y2="230" stroke="#1e293b" stroke-width="3"/>
    <circle cx="110" cy="95" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
    <circle cx="110" cy="130" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
    <circle cx="110" cy="165" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
    <circle cx="110" cy="200" r="4" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
    <!-- Pocket -->
    <rect x="70" y="105" width="30" height="35" rx="3" fill="none" stroke="#1e293b" stroke-width="2"/>
  </g>
  <rect x="20" y="250" width="260" height="32" rx="8" fill="#0f172a" opacity="0.85"/>
  <text x="150" y="271" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle">${label}</text>
</svg>`;
}

function createPantsSVG(color, label = 'PANTS') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" fill="#f8fafc" rx="16"/>
  <g transform="translate(50, 25)">
    <!-- Waistband -->
    <rect x="30" y="20" width="140" height="25" rx="4" fill="${color}" stroke="#1e293b" stroke-width="3"/>
    <!-- Belt Loops -->
    <rect x="45" y="17" width="6" height="31" fill="#1e293b"/>
    <rect x="97" y="17" width="6" height="31" fill="#1e293b"/>
    <rect x="149" y="17" width="6" height="31" fill="#1e293b"/>
    <!-- Legs -->
    <path d="M 30 45 L 30 220 L 90 220 L 100 110 L 110 220 L 170 220 L 170 45 Z" fill="${color}" stroke="#1e293b" stroke-width="3" stroke-linejoin="round"/>
    <!-- Pockets & Seams -->
    <path d="M 30 70 Q 60 70 65 45" stroke="#1e293b" stroke-width="2.5" fill="none"/>
    <path d="M 170 70 Q 140 70 135 45" stroke="#1e293b" stroke-width="2.5" fill="none"/>
    <line x1="100" y1="45" x2="100" y2="110" stroke="#1e293b" stroke-width="2.5"/>
  </g>
  <rect x="20" y="250" width="260" height="32" rx="8" fill="#0f172a" opacity="0.85"/>
  <text x="150" y="271" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle">${label}</text>
</svg>`;
}

function createGroupSVG(bgColor, shirtColor, label = 'GROUP SHIRTS') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" fill="#f8fafc" rx="16"/>
  <g transform="translate(20, 30)">
    <!-- Back Shirt -->
    <g transform="translate(60, 0) scale(0.65)">
      <path d="M 60 50 L 110 30 L 160 50 L 200 80 L 180 120 L 160 100 L 160 230 L 60 230 L 60 100 L 40 120 L 20 80 Z" fill="${bgColor}" stroke="#1e293b" stroke-width="4"/>
    </g>
    <!-- Left Shirt -->
    <g transform="translate(10, 40) scale(0.7)">
      <path d="M 60 50 L 110 30 L 160 50 L 200 80 L 180 120 L 160 100 L 160 230 L 60 230 L 60 100 L 40 120 L 20 80 Z" fill="${shirtColor}" stroke="#1e293b" stroke-width="4"/>
    </g>
    <!-- Main Center Shirt -->
    <g transform="translate(70, 45) scale(0.75)">
      <path d="M 60 50 L 110 30 L 160 50 L 200 80 L 180 120 L 160 100 L 160 230 L 60 230 L 60 100 L 40 120 L 20 80 Z" fill="${shirtColor}" stroke="#1e293b" stroke-width="4"/>
      <circle cx="110" cy="95" r="5" fill="#fff"/>
      <circle cx="110" cy="135" r="5" fill="#fff"/>
    </g>
  </g>
  <rect x="20" y="250" width="260" height="32" rx="8" fill="#7c3aed" opacity="0.95"/>
  <text x="150" y="271" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#ffffff" text-anchor="middle">👑 ${label}</text>
</svg>`;
}

const items = [
    // Shirts
    { name: 'shirt_skyblue.svg', content: createShirtSVG('#38bdf8', 'solid', 'SKY BLUE FORMAL') },
    { name: 'shirt_cream.svg', content: createShirtSVG('#fef08a', 'solid', 'CREAM LINEN') },
    { name: 'shirt_navycheck.svg', content: createShirtSVG('#1e3a8a', 'check', 'NAVY BLUE CHECK') },
    { name: 'shirt_maroon.svg', content: createShirtSVG('#881337', 'solid', 'ROYAL MAROON SILK') },
    { name: 'shirt_olivegreen.svg', content: createShirtSVG('#4d7c0f', 'solid', 'OLIVE GREEN COTTON') },
    { name: 'shirt_charcoal.svg', content: createShirtSVG('#334155', 'solid', 'CHARCOAL GREY FORMAL') },
    { name: 'shirt_hawaiian.svg', content: createShirtSVG('#06b6d4', 'print', 'HAWAIIAN BEACH PRINT') },
    { name: 'shirt_redblack.svg', content: createShirtSVG('#991b1b', 'check', 'RED & BLACK CHECK') },
    { name: 'shirt_oxfordstripe.svg', content: createShirtSVG('#0284c7', 'stripe', 'OXFORD STRIPE BLUE') },
    { name: 'shirt_black.svg', content: createShirtSVG('#0f172a', 'solid', 'MIDNIGHT BLACK SATIN') },
    { name: 'shirt_mandarin.svg', content: createShirtSVG('#e2e8f0', 'solid', 'COTTON MANDARIN WHITE') },
    { name: 'shirt_denim.svg', content: createShirtSVG('#2563eb', 'solid', 'CASUAL BLUE DENIM') },
    { name: 'shirt_pink.svg', content: createShirtSVG('#f472b6', 'solid', 'PASTEL PINK FORMAL') },
    { name: 'shirt_gold.svg', content: createShirtSVG('#eab308', 'solid', 'GOLDEN YELLOW SILK') },
    { name: 'shirt_white.svg', content: createShirtSVG('#ffffff', 'solid', 'EXECUTIVE WHITE COTTON') },

    // Pants
    { name: 'jeans_black.svg', content: createPantsSVG('#1e293b', 'PITCH BLACK JEANS') },
    { name: 'jeans_darkindigo.svg', content: createPantsSVG('#1e1b4b', 'DARK INDIGO RAW DENIM') },
    { name: 'jeans_lightblue.svg', content: createPantsSVG('#60a5fa', 'LIGHT BLUE DISTRESSED') },
    { name: 'jeans_greyfade.svg', content: createPantsSVG('#475569', 'CHARCOAL GREY FADE') },
    { name: 'jeans_classicblue.svg', content: createPantsSVG('#1d4ed8', 'CLASSIC BLUE JEANS') },

    { name: 'trousers_navy.svg', content: createPantsSVG('#0f172a', 'NAVY BLUE CHINO') },
    { name: 'trousers_beige.svg', content: createPantsSVG('#d97706', 'KHAKI BEIGE TROUSERS') },
    { name: 'trousers_charcoal.svg', content: createPantsSVG('#334155', 'CHARCOAL SLIM DRESS') },
    { name: 'trousers_black.svg', content: createPantsSVG('#09090b', 'EXECUTIVE BLACK PLEATED') },
    { name: 'trousers_olive.svg', content: createPantsSVG('#3f6212', 'OLIVE GREEN CASUAL') },

    // Group Shirts
    { name: 'groupshirt_royal.svg', content: createGroupSVG('#7c3aed', '#f43f5e', 'ROYAL CELEBRATION (PACK OF 5)') },
    { name: 'groupshirt_tropical.svg', content: createGroupSVG('#0ea5e9', '#10b981', 'TEAM OUTING PRINTED (PACK OF 4)') },
    { name: 'groupshirt_traditional.svg', content: createGroupSVG('#d97706', '#eab308', 'WEDDING FUNCTION (PACK OF 6)') },
    { name: 'groupshirt_yellow.svg', content: createGroupSVG('#ca8a04', '#fef08a', 'FESTIVAL YELLOW SILK (PACK OF 4)') },
    { name: 'groupshirt_reunion.svg', content: createGroupSVG('#475569', '#3b82f6', 'COLLEGE REUNION CHECK (PACK OF 5)') },
    { name: 'groupshirt_white.svg', content: createGroupSVG('#64748b', '#ffffff', 'TEMPLE WHITE COTTON (PACK OF 4)') }
];

items.forEach(item => {
    fs.writeFileSync(path.join(uploadsDir, item.name), item.content, 'utf8');
});

console.log(`Successfully generated ${items.length} colored clothing SVG pictures!`);
