// Complete Seed Dataset for Kiskintha Mens Wear - 130 Unique Products with All Local Cotton & Linen Pictures

const categories = [
  { id: 1, name: 'Shirts', slug: 'shirts', description: 'Premium formal, casual, linen, cotton, and checked shirts for men.', image: '/picture/COTTON SHIRTS.jpg' },
  { id: 2, name: 'Pants', slug: 'pants', description: 'Stylish jeans, chinos, cargo, and relaxed fit pants.', image: '/picture/JEAN PANT.jpg' },
  { id: 3, name: 'Trousers', slug: 'trousers', description: 'Tailored office wear, formal, pleated, and stretch trousers.', image: '/picture/COTTON PANT.jpg' },
  { id: 4, name: 'T-Shirts', slug: 't-shirts', description: 'Casual, oversized, polo, graphic, and round neck t-shirts.', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop' },
  { id: 5, name: 'Group Shirts', slug: 'group-shirts', description: 'Matching check, print, and party group shirts for events & teams.', image: '/picture/linen 2.jpg' }
];

const subcategories = [
  // Shirts Subcategories
  { id: 1, category_id: 1, name: 'Formal Shirts', slug: 'formal-shirts' },
  { id: 2, category_id: 1, name: 'Casual Shirts', slug: 'casual-shirts' },
  { id: 3, category_id: 1, name: 'Checked Shirts', slug: 'checked-shirts' },
  { id: 4, category_id: 1, name: 'Cotton Shirts', slug: 'cotton-shirts' },
  { id: 5, category_id: 1, name: 'Linen Shirts', slug: 'linen-shirts' },

  // Pants Subcategories
  { id: 6, category_id: 2, name: 'Jeans', slug: 'jeans' },
  { id: 7, category_id: 2, name: 'Chinos', slug: 'chinos' },
  { id: 8, category_id: 2, name: 'Cotton Pants', slug: 'cotton-pants' },
  { id: 9, category_id: 2, name: 'Cargo Pants', slug: 'cargo-pants' },
  { id: 10, category_id: 2, name: 'Casual Pants', slug: 'casual-pants' },

  // Trousers Subcategories
  { id: 11, category_id: 3, name: 'Formal Trousers', slug: 'formal-trousers' },
  { id: 12, category_id: 3, name: 'Slim Fit Trousers', slug: 'slim-fit-trousers' },
  { id: 13, category_id: 3, name: 'Cotton Trousers', slug: 'cotton-trousers' },
  { id: 14, category_id: 3, name: 'Office Wear Trousers', slug: 'office-wear-trousers' },
  { id: 15, category_id: 3, name: 'Casual Trousers', slug: 'casual-trousers' },

  // T-Shirts Subcategories
  { id: 16, category_id: 4, name: 'Polo T-Shirts', slug: 'polo-t-shirts' },
  { id: 17, category_id: 4, name: 'Plain T-Shirts', slug: 'plain-t-shirts' },
  { id: 18, category_id: 4, name: 'Oversized T-Shirts', slug: 'oversized-t-shirts' },
  { id: 19, category_id: 4, name: 'Printed T-Shirts', slug: 'printed-t-shirts' },
  { id: 20, category_id: 4, name: 'Sports T-Shirts', slug: 'sports-t-shirts' },

  // Group Shirts Subcategories
  { id: 21, category_id: 5, name: 'Checked Group Shirts', slug: 'checked-group-shirts' },
  { id: 22, category_id: 5, name: 'Cotton Group Shirts', slug: 'cotton-group-shirts' },
  { id: 23, category_id: 5, name: 'Casual Group Shirts', slug: 'casual-group-shirts' },
  { id: 24, category_id: 5, name: 'Party Wear Group Shirts', slug: 'party-wear-group-shirts' },
  { id: 25, category_id: 5, name: 'Linen Group Shirts', slug: 'linen-group-shirts' }
];

const subcatLookup = {};
subcategories.forEach(sc => {
  subcatLookup[sc.name] = sc.id;
});

// --- 30 UNIQUE SHIRTS (6 FORMAL, 6 CASUAL, 6 CHECKED, 6 COTTON, 6 LINEN) ---
const shirtsData = [
  // --- 1. COTTON SHIRTS (6 PRODUCTS WITH ALL LOCAL COTTON SHIRT IMAGES FROM Desktop/Kiskintha Mens Wear/Picture INCLUDING COTTON SHIRT BLACK) ---
  {
    name: 'Premium White Organic Soft Cotton Shirt',
    subcategory: 'Cotton Shirts',
    price: 599,
    discount_price: 399,
    colors: ['White'],
    rating: 4.8,
    images: ['/picture/COTTON SHIRTS.jpg', '/picture/COTTON SHIRT 2.jpg']
  },
  {
    name: 'Premium Jet Black Solid Mandarin Cotton Shirt',
    subcategory: 'Cotton Shirts',
    price: 600,
    discount_price: 400,
    colors: ['Jet Black'],
    rating: 4.9,
    images: ['/picture/COTTON SHIRT BLACK.jpg', '/picture/COTTON SHIRT BLACK']
  },
  {
    name: 'Premium Executive Navy Blue Cotton Shirt',
    subcategory: 'Cotton Shirts',
    price: 699,
    discount_price: 499,
    colors: ['Navy Blue'],
    rating: 4.7,
    images: ['/picture/COTTON SHIRT 2.jpg', '/picture/COTTON SHIRTS 3.jpg']
  },
  {
    name: 'Premium Sky Blue Soft Touch Casual Cotton Shirt',
    subcategory: 'Cotton Shirts',
    price: 599,
    discount_price: 399,
    colors: ['Sky Blue'],
    rating: 4.9,
    images: ['/picture/COTTON SHIRTS 3.jpg', '/picture/COTTON SHIRTS.jpg']
  },
  {
    name: 'Premium Khaki Tan Slub Heavyweight Cotton Shirt',
    subcategory: 'Cotton Shirts',
    price: 600,
    discount_price: 400,
    colors: ['Khaki'],
    rating: 4.6,
    images: ['/picture/COTTON SHIRTS.jpg', '/picture/COTTON SHIRT BLACK.jpg']
  },
  {
    name: 'Premium Emerald Green Oxford Weave Cotton Shirt',
    subcategory: 'Cotton Shirts',
    price: 699,
    discount_price: 499,
    colors: ['Emerald Green'],
    rating: 4.9,
    images: ['/picture/COTTON SHIRT 2.jpg', '/picture/COTTON SHIRTS 3.jpg']
  },

  // --- 2. LINEN SHIRTS (6 PRODUCTS WITH LOCAL PICTURES: linen 1.jpg to linen 5.jpg) ---
  {
    name: 'Pure White Natural Linen Shirt',
    subcategory: 'Linen Shirts',
    price: 699,
    discount_price: 499,
    colors: ['Pure White'],
    rating: 4.9,
    images: ['/picture/linen 1.jpg', '/picture/linen 5.jpg']
  },
  {
    name: 'Midnight Navy Executive Italian Linen Shirt',
    subcategory: 'Linen Shirts',
    price: 599,
    discount_price: 395,
    colors: ['Midnight Navy'],
    rating: 4.8,
    images: ['/picture/linen 2.jpg', '/picture/linen 3.jpg']
  },
  {
    name: 'Sky Blue Summer Breeze Linen Shirt',
    subcategory: 'Linen Shirts',
    price: 599,
    discount_price: 399,
    colors: ['Sky Blue'],
    rating: 4.9,
    images: ['/picture/linen 3.jpg', '/picture/linen 1.jpg']
  },
  {
    name: 'Dusty Pink Premium Fit Linen Shirt',
    subcategory: 'Linen Shirts',
    price: 699,
    discount_price: 499,
    colors: ['Dusty Pink'],
    rating: 4.7,
    images: ['/picture/linen 4.jpg', '/picture/linen 5.jpg']
  },
  {
    name: 'Sand Beige Casual Resort Linen Shirt',
    subcategory: 'Linen Shirts',
    price: 599,
    discount_price: 399,
    colors: ['Sand Beige'],
    rating: 4.8,
    images: ['/picture/linen 5.jpg', '/picture/linen 2.jpg']
  },
  {
    name: 'Olive Green Tropical Resort Linen Shirt',
    subcategory: 'Linen Shirts',
    price: 599,
    discount_price: 395,
    colors: ['Olive Green'],
    rating: 4.9,
    images: ['/picture/linen 1.jpg', '/picture/linen 3.jpg']
  },

  // --- 3. FORMAL SHIRTS (6 PRODUCTS) ---
  {
    name: 'Royal Silk White Formal Shirt',
    subcategory: 'Formal Shirts',
    price: 1399,
    discount_price: 1049,
    colors: ['White'],
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop']
  },
  {
    name: 'Classic Charcoal Grey Oxford Formal Shirt',
    subcategory: 'Formal Shirts',
    price: 1499,
    discount_price: 1149,
    colors: ['Charcoal Grey'],
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop']
  },
  {
    name: 'Sky Blue Slim Fit French Cuff Formal Shirt',
    subcategory: 'Formal Shirts',
    price: 1599,
    discount_price: 1249,
    colors: ['Sky Blue'],
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop']
  },
  {
    name: 'Teal Green Textured Twill Formal Shirt',
    subcategory: 'Formal Shirts',
    price: 1549,
    discount_price: 1199,
    colors: ['Teal Green'],
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format&fit=crop']
  },
  {
    name: 'Dark Grey Micro-Pinstripe Formal Shirt',
    subcategory: 'Formal Shirts',
    price: 1499,
    discount_price: 1149,
    colors: ['Dark Grey'],
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop']
  },
  {
    name: 'Lavender Pastel Dobby Structure Formal Shirt',
    subcategory: 'Formal Shirts',
    price: 1399,
    discount_price: 1099,
    colors: ['Lavender'],
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop']
  },

  // --- 4. CASUAL SHIRTS (6 PRODUCTS) ---
  {
    name: 'Sand Beige Casual Button-Down Shirt',
    subcategory: 'Casual Shirts',
    price: 1099,
    discount_price: 849,
    colors: ['Sand Beige'],
    rating: 4.4,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop']
  },
  {
    name: 'Indigo Vintage Denim Washed Casual Shirt',
    subcategory: 'Casual Shirts',
    price: 1699,
    discount_price: 1299,
    colors: ['Indigo Blue'],
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format&fit=crop']
  },
  {
    name: 'Mustard Yellow Casual Slub Cotton Shirt',
    subcategory: 'Casual Shirts',
    price: 1099,
    discount_price: 799,
    colors: ['Mustard Yellow'],
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop']
  },
  {
    name: 'Rust Brown Corduroy Oversized Casual Shirt',
    subcategory: 'Casual Shirts',
    price: 1699,
    discount_price: 1299,
    colors: ['Rust Brown'],
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop']
  },
  {
    name: 'Floral Tropical Print Resort Casual Shirt',
    subcategory: 'Casual Shirts',
    price: 1199,
    discount_price: 899,
    colors: ['Multicolor'],
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop']
  },
  {
    name: 'Burgundy Crimson Satin Party Casual Shirt',
    subcategory: 'Casual Shirts',
    price: 1899,
    discount_price: 1499,
    colors: ['Burgundy'],
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format&fit=crop']
  },

  // --- 5. CHECKED SHIRTS (6 PRODUCTS) ---
  {
    name: 'Classic Red & Black Buffalo Plaid Checked Shirt',
    subcategory: 'Checked Shirts',
    price: 1299,
    discount_price: 949,
    colors: ['Red & Black'],
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop']
  },
  {
    name: 'Micro Check Blue & White Corporate Checked Shirt',
    subcategory: 'Checked Shirts',
    price: 1449,
    discount_price: 1099,
    colors: ['Blue & White'],
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop']
  },
  {
    name: 'White & Grey Windowpane Checked Shirt',
    subcategory: 'Checked Shirts',
    price: 1399,
    discount_price: 1049,
    colors: ['White & Grey'],
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop']
  },
  {
    name: 'Classic Tattersall Navy Checked Shirt',
    subcategory: 'Checked Shirts',
    price: 1249,
    discount_price: 899,
    colors: ['Navy Check'],
    rating: 4.4,
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format&fit=crop']
  },
  {
    name: 'Gingham Green & Black Tartan Checked Shirt',
    subcategory: 'Checked Shirts',
    price: 1349,
    discount_price: 999,
    colors: ['Green & Black'],
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop']
  },
  {
    name: 'Sky Blue Madras Cotton Checked Shirt',
    subcategory: 'Checked Shirts',
    price: 1149,
    discount_price: 799,
    colors: ['Sky Blue Check'],
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop']
  }
];

// --- PANTS DATA (25 UNIQUE PRODUCTS WITH LOCAL PANT PICTURES: COTTON PANT.jpg, JEAN PANT.jpg, PANT 1.jpg) ---
const pantSubcatCycle = ['Jeans', 'Chinos', 'Cotton Pants', 'Cargo Pants', 'Casual Pants'];
const pantsRaw = [
  { name: 'Dark Indigo Slim Fit Raw Denim Jeans', price: 1899, discount_price: 1499, colors: ['Dark Indigo'], rating: 4.8, images: ['/picture/JEAN PANT.jpg'] },
  { name: 'Charcoal Grey Tapered Fit Chino Pants', price: 1599, discount_price: 1199, colors: ['Charcoal'], rating: 4.7, images: ['/picture/PANT 1.jpg'] },
  { name: 'Khaki Tan Classic Fit Cotton Pants', price: 1499, discount_price: 1099, colors: ['Khaki Tan'], rating: 4.6, images: ['/picture/COTTON PANT.jpg'] },
  { name: 'Jet Black Super Stretch Denim Jeans', price: 1999, discount_price: 1599, colors: ['Jet Black'], rating: 4.9, images: ['/picture/JEAN BLACK 2.jpg'] },
  { name: 'Olive Green 6-Pocket Tactical Cargo Pants', price: 1799, discount_price: 1399, colors: ['Olive Green'], rating: 4.8, images: ['/picture/COTTON PANT 2.jpg'] },
  { name: 'Navy Blue Slim Fit Casual Pants', price: 1399, discount_price: 999, colors: ['Navy Blue'], rating: 4.5, images: ['/picture/COTTON PANT 3.jpg'] },
  { name: 'Sand Beige Stretch Cotton Chinos', price: 1649, discount_price: 1249, colors: ['Sand Beige'], rating: 4.6, images: ['/picture/PANT 1.jpg'] },
  { name: 'Light Blue Washed Distressed Denim Jeans', price: 1799, discount_price: 1349, colors: ['Light Blue'], rating: 4.7, images: ['/picture/JEAN PANT.jpg'] },
  { name: 'Dark Brown Relaxed Fit Heavy Canvas Pants', price: 1599, discount_price: 1199, colors: ['Dark Brown'], rating: 4.4, images: ['/picture/COTTON PANT.jpg'] },
  { name: 'Steel Grey Straight Fit Casual Pants', price: 1399, discount_price: 1049, colors: ['Steel Grey'], rating: 4.5, images: ['/picture/COTTON PANT 2.jpg'] },
  { name: 'Camouflage Urban Streetwear Cargo Pants', price: 1899, discount_price: 1449, colors: ['Camo Green'], rating: 4.8, images: ['/picture/COTTON PANT 3.jpg'] },
  { name: 'Burgundy Wine Slim Stretch Chino Pants', price: 1699, discount_price: 1299, colors: ['Burgundy Wine'], rating: 4.6, images: ['/picture/PANT 1.jpg'] },
  { name: 'Smoky Grey Ankle-Length Tapered Pants', price: 1299, discount_price: 949, colors: ['Smoky Grey'], rating: 4.5, images: ['/picture/COTTON PANT.jpg'] },
  { name: 'Classic Black Regular Fit Denim Jeans', price: 1599, discount_price: 1199, colors: ['Black'], rating: 4.7, images: ['/picture/JEAN BLACK 2.jpg'] },
  { name: 'Off-White Ivory Summer Linen Blend Pants', price: 1699, discount_price: 1299, colors: ['Ivory Linen'], rating: 4.8, images: ['/picture/COTTON PANT 2.jpg'] },
  { name: 'Midnight Blue Flex 4-Way Stretch Pants', price: 2099, discount_price: 1699, colors: ['Midnight Blue'], rating: 4.9, images: ['/picture/JEAN PANT.jpg'] },
  { name: 'Vintage Acid Wash Grey Denim Jeans', price: 1849, discount_price: 1399, colors: ['Acid Wash Grey'], rating: 4.6, images: ['/picture/JEAN BLACK 2.jpg'] },
  { name: 'Charcoal Ripstop Utility Cargo Pants', price: 1749, discount_price: 1299, colors: ['Charcoal'], rating: 4.7, images: ['/picture/COTTON PANT 3.jpg'] },
  { name: 'Taupe Khaki Relaxed Straight Fit Pants', price: 1399, discount_price: 999, colors: ['Taupe Khaki'], rating: 4.4, images: ['/picture/PANT 1.jpg'] },
  { name: 'Rust Orange Casual Slub Cotton Pants', price: 1299, discount_price: 899, colors: ['Rust Orange'], rating: 4.3, images: ['/picture/COTTON PANT.jpg'] },
  { name: 'Dark Grey Faded Comfort Denim Jeans', price: 1699, discount_price: 1249, colors: ['Dark Grey Faded'], rating: 4.7, images: ['/picture/JEAN PANT.jpg'] },
  { name: 'Forest Green Stretch Twill Chino Pants', price: 1599, discount_price: 1199, colors: ['Forest Green'], rating: 4.6, images: ['/picture/COTTON PANT 2.jpg'] },
  { name: 'Black Athletic Track Cargo Hybrid Pants', price: 1499, discount_price: 1099, colors: ['Black'], rating: 4.5, images: ['/picture/COTTON PANT 3.jpg'] },
  { name: 'Stone Grey Straight Fit Everyday Denim', price: 1549, discount_price: 1149, colors: ['Stone Grey'], rating: 4.6, images: ['/picture/JEAN BLACK 2.jpg'] },
  { name: 'Camel Tan Premium Brushed Linen Cotton Pants', price: 1799, discount_price: 1399, colors: ['Camel Tan'], rating: 4.8, images: ['/picture/COTTON PANT.jpg'] }
];

const pantsData = pantsRaw.map((item, idx) => ({
  ...item,
  subcategory: pantSubcatCycle[idx % pantSubcatCycle.length]
}));

// --- TROUSERS DATA (25 UNIQUE PRODUCTS) ---
const trouserSubcatCycle = ['Formal Trousers', 'Slim Fit Trousers', 'Cotton Trousers', 'Office Wear Trousers', 'Casual Trousers'];
const trousersRaw = [
  { name: 'Midnight Black Formal Suit Trousers', price: 1999, discount_price: 1599, colors: ['Midnight Black'], rating: 4.9 },
  { name: 'Charcoal Grey Executive Slim Fit Trousers', price: 1899, discount_price: 1499, colors: ['Charcoal Grey'], rating: 4.8 },
  { name: 'Navy Blue Pinstripe Formal Trousers', price: 1799, discount_price: 1399, colors: ['Navy Blue'], rating: 4.7 },
  { name: 'Light Grey Houndstooth Checked Trousers', price: 1699, discount_price: 1299, colors: ['Light Grey'], rating: 4.6 },
  { name: 'Dark Tan Pleated Classic Fit Trousers', price: 1599, discount_price: 1199, colors: ['Dark Tan'], rating: 4.5 },
  { name: 'Pure White Linen Summer Formal Trousers', price: 1899, discount_price: 1449, colors: ['Pure White Linen'], rating: 4.9 },
  { name: 'Steel Blue Stretch Formal Trousers', price: 1749, discount_price: 1349, colors: ['Steel Blue'], rating: 4.8 },
  { name: 'Beige Camel Italian Cut Slim Trousers', price: 2199, discount_price: 1799, colors: ['Beige Camel'], rating: 4.9 },
  { name: 'Dark Green Tweed Textured Trousers', price: 1949, discount_price: 1499, colors: ['Dark Green'], rating: 4.6 },
  { name: 'Black Tuxedo Satin Trim Party Trousers', price: 2299, discount_price: 1899, colors: ['Black Satin'], rating: 4.9 },
  { name: 'Mocha Brown Straight Fit Cotton Trousers', price: 1499, discount_price: 1099, colors: ['Mocha Brown'], rating: 4.5 },
  { name: 'Slate Grey Wrinkle-Free Office Trousers', price: 1699, discount_price: 1299, colors: ['Slate Grey'], rating: 4.7 },
  { name: 'Navy Blue Double Pleated Vintage Trousers', price: 1799, discount_price: 1399, colors: ['Navy Blue'], rating: 4.5 },
  { name: 'Olive Drab Casual Stretch Trousers', price: 1399, discount_price: 999, colors: ['Olive Drab'], rating: 4.4 },
  { name: 'Charcoal Glen Check Formal Trousers', price: 1849, discount_price: 1449, colors: ['Charcoal Check'], rating: 4.7 },
  { name: 'Khaki Tan Flat Front Regular Trousers', price: 1499, discount_price: 1149, colors: ['Khaki Tan'], rating: 4.6 },
  { name: 'Jet Black Super Fine Wool Blend Trousers', price: 2249, discount_price: 1799, colors: ['Jet Black'], rating: 4.9 },
  { name: 'Burgundy Slim Tapered Dress Trousers', price: 1799, discount_price: 1349, colors: ['Burgundy'], rating: 4.7 },
  { name: 'Ash Grey Ankle Length Crop Trousers', price: 1399, discount_price: 949, colors: ['Ash Grey'], rating: 4.5 },
  { name: 'Dark Navy Flex-Waist Comfort Trousers', price: 1699, discount_price: 1299, colors: ['Dark Navy'], rating: 4.8 },
  { name: 'Sandstone Straight Fit Cotton Trousers', price: 1449, discount_price: 1049, colors: ['Sandstone'], rating: 4.5 },
  { name: 'Teal Blue Micro Patterned Dress Trousers', price: 1799, discount_price: 1399, colors: ['Teal Blue'], rating: 4.6 },
  { name: 'Bronze Gold Festive Jacquard Trousers', price: 2199, discount_price: 1699, colors: ['Bronze Gold'], rating: 4.8 },
  { name: 'Deep Brown Corduroy Tailored Trousers', price: 1699, discount_price: 1299, colors: ['Deep Brown'], rating: 4.6 },
  { name: 'Classic Grey Straight Leg Work Trousers', price: 1549, discount_price: 1149, colors: ['Classic Grey'], rating: 4.6 }
];

const trousersData = trousersRaw.map((item, idx) => ({
  ...item,
  subcategory: trouserSubcatCycle[idx % trouserSubcatCycle.length]
}));

// --- T-SHIRTS DATA (25 UNIQUE PRODUCTS) ---
const tshirtSubcatCycle = ['Polo T-Shirts', 'Plain T-Shirts', 'Oversized T-Shirts', 'Printed T-Shirts', 'Sports T-Shirts'];
const tshirtsRaw = [
  { name: 'Solid Black Premium Combed Cotton Crew Neck', price: 499, discount_price: 399, colors: ['Solid Black'], rating: 4.8 },
  { name: 'Pure White Essential Round Neck T-Shirt', price: 449, discount_price: 349, colors: ['Pure White'], rating: 4.7 },
  { name: 'Navy Blue Classic Pique Polo T-Shirt', price: 899, discount_price: 699, colors: ['Navy Blue'], rating: 4.8 },
  { name: 'Charcoal Grey Oversized Heavyweight Tee', price: 999, discount_price: 749, colors: ['Charcoal Grey'], rating: 4.9 },
  { name: 'Burgundy Crimson V-Neck Slim Fit T-Shirt', price: 599, discount_price: 449, colors: ['Burgundy'], rating: 4.5 },
  { name: 'Vintage Graphic Printed Rock Band Tee', price: 799, discount_price: 599, colors: ['Washed Black'], rating: 4.7 },
  { name: 'Olive Green Quick-Dry Performance Sports Tee', price: 699, discount_price: 499, colors: ['Olive Green'], rating: 4.8 },
  { name: 'Heather Grey Casual Slub Pocket T-Shirt', price: 549, discount_price: 399, colors: ['Heather Grey'], rating: 4.6 },
  { name: 'Mustard Yellow Oversized Drop Shoulder Tee', price: 1099, discount_price: 799, colors: ['Mustard Yellow'], rating: 4.8 },
  { name: 'Royal Blue Tipped Collar Polo T-Shirt', price: 949, discount_price: 729, colors: ['Royal Blue'], rating: 4.7 },
  { name: 'Minimalist Typography Printed White Tee', price: 649, discount_price: 449, colors: ['White Print'], rating: 4.6 },
  { name: 'Teal Green Deep V-Neck Soft Cotton Tee', price: 579, discount_price: 419, colors: ['Teal Green'], rating: 4.4 },
  { name: 'Sand Beige Acid Washed Graphic Tee', price: 849, discount_price: 629, colors: ['Sand Beige'], rating: 4.7 },
  { name: 'Neon Lime Reflective Running Sports Tee', price: 749, discount_price: 549, colors: ['Neon Lime'], rating: 4.6 },
  { name: 'Maroon Stripe Yarn-Dyed Casual Polo', price: 1049, discount_price: 799, colors: ['Maroon Stripe'], rating: 4.8 },
  { name: 'Dusty Pink Streetwear Boxy Fit T-Shirt', price: 999, discount_price: 749, colors: ['Dusty Pink'], rating: 4.7 },
  { name: 'Steel Blue Supima Cotton Plain Round Neck', price: 699, discount_price: 499, colors: ['Steel Blue'], rating: 4.9 },
  { name: 'Black & Gold Geometric Printed T-Shirt', price: 799, discount_price: 579, colors: ['Black Gold'], rating: 4.7 },
  { name: 'Forest Green Breathable Gym Training Tee', price: 699, discount_price: 499, colors: ['Forest Green'], rating: 4.8 },
  { name: 'White & Navy Striped Nautical Polo Tee', price: 999, discount_price: 749, colors: ['Navy Stripe'], rating: 4.7 },
  { name: 'Rust Brown Organic Slub Cotton V-Neck', price: 599, discount_price: 429, colors: ['Rust Brown'], rating: 4.5 },
  { name: 'Japanese Anime Art Printed Black Graphic Tee', price: 899, discount_price: 649, colors: ['Black Print'], rating: 4.9 },
  { name: 'Khaki Tan Ribbed Knit Slim Fit Round Neck', price: 649, discount_price: 469, colors: ['Khaki Tan'], rating: 4.6 },
  { name: 'Lavender Pastel Casual Everyday T-Shirt', price: 549, discount_price: 399, colors: ['Lavender'], rating: 4.5 },
  { name: 'Anthracite Dark Grey Seamless Sports Tee', price: 849, discount_price: 599, colors: ['Anthracite'], rating: 4.8 }
];

const tshirtsData = tshirtsRaw.map((item, idx) => ({
  ...item,
  subcategory: tshirtSubcatCycle[idx % tshirtSubcatCycle.length]
}));

// --- GROUP SHIRTS DATA (25 UNIQUE PRODUCTS) ---
const groupSubcatCycle = ['Checked Group Shirts', 'Cotton Group Shirts', 'Casual Group Shirts', 'Party Wear Group Shirts', 'Linen Group Shirts'];
const groupShirtsRaw = [
  { name: 'Kiskintha Celebration Royal Blue Checked Group Shirt', price: 1499, discount_price: 1199, colors: ['Royal Blue'], rating: 4.9 },
  { name: 'Symphony Emerald Green Festive Print Group Shirt', price: 1599, discount_price: 1249, colors: ['Emerald Green'], rating: 4.8 },
  { name: 'Heritage Maroon & Gold Wedding Group Shirt', price: 1799, discount_price: 1399, colors: ['Maroon Gold'], rating: 4.9 },
  { name: 'Gingham Red & White Festive Team Shirt', price: 1199, discount_price: 899, colors: ['Red & White'], rating: 4.7 },
  { name: 'Bespoke Mustard Yellow Mandala Print Group Shirt', price: 1399, discount_price: 1049, colors: ['Mustard Yellow'], rating: 4.6 },
  { name: 'Corporate Executive Navy Stripe Group Shirt', price: 1299, discount_price: 949, colors: ['Navy Stripe'], rating: 4.8 },
  { name: 'Sunset Orange Tropical Resort Group Shirt', price: 1099, discount_price: 799, colors: ['Sunset Orange'], rating: 4.6 },
  { name: 'Charcoal & Silver Metallic Thread Group Shirt', price: 1699, discount_price: 1299, colors: ['Charcoal Silver'], rating: 4.8 },
  { name: 'Classic Tartan Green & Black Group Check Shirt', price: 1249, discount_price: 899, colors: ['Tartan Green'], rating: 4.7 },
  { name: 'Teal Blue Paisley Printed Club Group Shirt', price: 1399, discount_price: 999, colors: ['Teal Paisley'], rating: 4.6 },
  { name: 'Pure White Satin Contrast Collar Group Shirt', price: 1499, discount_price: 1099, colors: ['White Gold Collar'], rating: 4.9 },
  { name: 'Wine Red Dobby Weave Event Group Shirt', price: 1599, discount_price: 1199, colors: ['Wine Red'], rating: 4.8 },
  { name: 'Olive & Tan Safari Camo Uniform Group Shirt', price: 1199, discount_price: 849, colors: ['Olive Tan'], rating: 4.5 },
  { name: 'Black & Gold Baroque Luxury Group Shirt', price: 1799, discount_price: 1399, colors: ['Black Gold Baroque'], rating: 4.9 },
  { name: 'Sky Blue Madras Cotton Check Group Shirt', price: 1149, discount_price: 799, colors: ['Sky Blue Check'], rating: 4.6 },
  { name: 'Coral Pink Floral Fiesta Group Shirt', price: 1249, discount_price: 899, colors: ['Coral Pink'], rating: 4.7 },
  { name: 'Midnight Navy Geometric Lattice Group Shirt', price: 1349, discount_price: 949, colors: ['Navy Lattice'], rating: 4.7 },
  { name: 'Steel Grey Satin Finish Groomsmen Group Shirt', price: 1649, discount_price: 1249, colors: ['Steel Grey'], rating: 4.8 },
  { name: 'Rust Brown Vintage Block Print Group Shirt', price: 1299, discount_price: 949, colors: ['Rust Block Print'], rating: 4.6 },
  { name: 'Purple Orchid Luxury Silk Touch Group Shirt', price: 1699, discount_price: 1299, colors: ['Purple Orchid'], rating: 4.8 },
  { name: 'Navy & Yellow Buffalo Check Team Shirt', price: 1199, discount_price: 849, colors: ['Navy Yellow'], rating: 4.6 },
  { name: 'Beige Linen Slub Casual Festival Group Shirt', price: 1299, discount_price: 949, colors: ['Beige Linen'], rating: 4.5 },
  { name: 'Black & Red Flaming Striped Group Shirt', price: 1399, discount_price: 999, colors: ['Black Red Stripe'], rating: 4.7 },
  { name: 'Indigo Shibori Tie-Dye Group Shirt', price: 1449, discount_price: 1049, colors: ['Indigo Shibori'], rating: 4.8 },
  { name: 'Champagne Gold Satin Celebration Group Shirt', price: 1799, discount_price: 1399, colors: ['Champagne Gold'], rating: 4.9 }
];

const groupShirtsData = groupShirtsRaw.map((item, idx) => ({
  ...item,
  subcategory: groupSubcatCycle[idx % groupSubcatCycle.length]
}));

// Combine all 130 products
const allProducts = [];
let idCounter = 1;

// 1. Shirts (1 to 30)
shirtsData.forEach((item, index) => {
  const images = item.images || ['/picture/COTTON SHIRTS.jpg'];
  const subcatId = subcatLookup[item.subcategory] || 1;
  allProducts.push({
    id: idCounter++,
    name: item.name,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category_id: 1,
    category_name: 'Shirts',
    category_slug: 'shirts',
    subcategory_id: subcatId,
    subcategory: item.subcategory,
    description: `Experience luxury and supreme comfort with the ${item.name}. Crafted from high-density breathable cotton fabric with tailored seams for a sharp silhouette.`,
    price: item.price,
    discount_price: item.discount_price,
    stock_quantity: 45 + (index % 15),
    rating: item.rating,
    review_count: 15 + (index * 3) % 40,
    status: 'Active',
    is_bestseller: index % 5 === 0 ? 1 : 0,
    is_new: index % 4 === 0 ? 1 : 0,
    is_trending: index % 3 === 0 ? 1 : 0,
    images: images,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: item.colors
  });
});

// 2. Pants (31 to 55)
pantsData.forEach((item, index) => {
  const images = item.images || ['/picture/JEAN PANT.jpg'];
  const subcatId = subcatLookup[item.subcategory] || 6;
  allProducts.push({
    id: idCounter++,
    name: item.name,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category_id: 2,
    category_name: 'Pants',
    category_slug: 'pants',
    subcategory_id: subcatId,
    subcategory: item.subcategory,
    description: `Upgrade your daily wardrobe with the ${item.name}. Built with 4-way stretch flex comfort, double-stitched stress points, and an ergonomic waist fit.`,
    price: item.price,
    discount_price: item.discount_price,
    stock_quantity: 35 + (index % 20),
    rating: item.rating,
    review_count: 12 + (index * 4) % 45,
    status: 'Active',
    is_bestseller: index % 5 === 1 ? 1 : 0,
    is_new: index % 4 === 1 ? 1 : 0,
    is_trending: index % 3 === 1 ? 1 : 0,
    images: images,
    sizes: ['30', '32', '34', '36', '38'],
    colors: item.colors
  });
});

// 3. Trousers (56 to 80)
trousersData.forEach((item, index) => {
  const images = ['/picture/COTTON PANT.jpg'];
  const subcatId = subcatLookup[item.subcategory] || 11;
  allProducts.push({
    id: idCounter++,
    name: item.name,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category_id: 3,
    category_name: 'Trousers',
    category_slug: 'trousers',
    subcategory_id: subcatId,
    subcategory: item.subcategory,
    description: `The ${item.name} offers refined corporate elegance. Designed with wrinkle-resistant drape fabric, clean pressed creases, and tailored side pockets.`,
    price: item.price,
    discount_price: item.discount_price,
    stock_quantity: 40 + (index % 15),
    rating: item.rating,
    review_count: 18 + (index * 2) % 35,
    status: 'Active',
    is_bestseller: index % 5 === 2 ? 1 : 0,
    is_new: index % 4 === 2 ? 1 : 0,
    is_trending: index % 3 === 2 ? 1 : 0,
    images: images,
    sizes: ['30', '32', '34', '36', '38'],
    colors: item.colors
  });
});

// 4. T-Shirts (81 to 105)
tshirtsData.forEach((item, index) => {
  const images = ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop'];
  const subcatId = subcatLookup[item.subcategory] || 16;
  allProducts.push({
    id: idCounter++,
    name: item.name,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category_id: 4,
    category_name: 'T-Shirts',
    category_slug: 't-shirts',
    subcategory_id: subcatId,
    subcategory: item.subcategory,
    description: `Ultra-soft and stylish, the ${item.name} is bio-washed for superior handfeel and zero shrinkage. Features reinforced neck ribbing and vibrant long-lasting dyes.`,
    price: item.price,
    discount_price: item.discount_price,
    stock_quantity: 60 + (index % 25),
    rating: item.rating,
    review_count: 22 + (index * 5) % 50,
    status: 'Active',
    is_bestseller: index % 5 === 3 ? 1 : 0,
    is_new: index % 4 === 3 ? 1 : 0,
    is_trending: index % 3 === 0 ? 1 : 0,
    images: images,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: item.colors
  });
});

// 5. Group Shirts (106 to 130)
groupShirtsData.forEach((item, index) => {
  const images = item.subcategory === 'Linen Group Shirts' ? ['/picture/linen 2.jpg', '/picture/linen 3.jpg'] : ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop'];
  const subcatId = subcatLookup[item.subcategory] || 21;
  allProducts.push({
    id: idCounter++,
    name: item.name,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category_id: 5,
    category_name: 'Group Shirts',
    category_slug: 'group-shirts',
    subcategory_id: subcatId,
    subcategory: item.subcategory,
    description: `Make a unified style statement with ${item.name}. Ideal for wedding groomsmen, corporate celebrations, and festive group gatherings.`,
    price: item.price,
    discount_price: item.discount_price,
    stock_quantity: 50 + (index % 20),
    rating: item.rating,
    review_count: 14 + (index * 3) % 40,
    status: 'Active',
    is_bestseller: index % 5 === 4 ? 1 : 0,
    is_new: index % 4 === 0 ? 1 : 0,
    is_trending: index % 3 === 1 ? 1 : 0,
    images: images,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: item.colors
  });
});

module.exports = {
  categories,
  subcategories,
  allProducts
};
