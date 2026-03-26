/* ═══════════════════════════════════════════════════════
   data/products.js
   All static data: categories, products, offers, config
═══════════════════════════════════════════════════════ */

const CATEGORIES = [
  { id: 'all',     name: 'All',           emoji: '🛒' },
  { id: 'fruits',  name: 'Fruits',        emoji: '🍎' },
  { id: 'veggies', name: 'Vegetables',    emoji: '🥦' },
  { id: 'dairy',   name: 'Dairy',         emoji: '🥛' },
  { id: 'snacks',  name: 'Snacks',        emoji: '🍿' },
  { id: 'bakery',  name: 'Bakery',        emoji: '🍞' },
  { id: 'drinks',  name: 'Drinks',        emoji: '🧃' },
  { id: 'meat',    name: 'Meat & Fish',   emoji: '🍗' },
  { id: 'frozen',  name: 'Frozen',        emoji: '🧊' },
  { id: 'care',    name: 'Personal Care', emoji: '🧴' },
  { id: 'clean',   name: 'Cleaning',      emoji: '🧹' },
  { id: 'baby',    name: 'Baby',          emoji: '👶' },
];

const PRODUCTS = [
  { id: 1,  cat: 'fruits',  name: 'Fresh Bananas',        weight: '6 pcs',   price: 45,  mrp: 55,  time: '9 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80' },
  { id: 2,  cat: 'fruits',  name: 'Red Apples',           weight: '4 pcs',   price: 99,  mrp: 120, time: '9 mins',  badge: 'Fresh',   img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&q=80' },
  { id: 3,  cat: 'veggies', name: 'Tomatoes',             weight: '500g',    price: 35,  mrp: 45,  time: '8 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=300&q=80' },
  { id: 4,  cat: 'veggies', name: 'Spinach Bunch',        weight: '250g',    price: 25,  mrp: 30,  time: '8 mins',  badge: 'Organic', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80' },
  { id: 5,  cat: 'dairy',   name: 'Full Cream Milk',      weight: '1 litre', price: 68,  mrp: 72,  time: '10 mins', badge: '',        img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80' },
  { id: 6,  cat: 'dairy',   name: 'Paneer Fresh',         weight: '200g',    price: 85,  mrp: 95,  time: '10 mins', badge: 'Fresh',   img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&q=80' },
  { id: 7,  cat: 'snacks',  name: 'Potato Chips Classic', weight: '150g',    price: 30,  mrp: 35,  time: '7 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&q=80' },
  { id: 8,  cat: 'snacks',  name: 'Mixed Nuts',           weight: '200g',    price: 149, mrp: 180, time: '7 mins',  badge: 'New',     img: 'https://images.unsplash.com/photo-1545521395-8bed54e93d8d?w=300&q=80' },
  { id: 9,  cat: 'bakery',  name: 'Whole Wheat Bread',    weight: '400g',    price: 45,  mrp: 50,  time: '9 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80' },
  { id: 10, cat: 'drinks',  name: 'Orange Juice',         weight: '1 litre', price: 89,  mrp: 110, time: '8 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&q=80' },
  { id: 11, cat: 'drinks',  name: 'Green Tea Pack',       weight: '25 bags', price: 99,  mrp: 120, time: '8 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80' },
  { id: 12, cat: 'meat',    name: 'Chicken Breast',       weight: '500g',    price: 185, mrp: 210, time: '12 mins', badge: 'Fresh',   img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&q=80' },
  { id: 13, cat: 'frozen',  name: 'Peas Frozen',          weight: '500g',    price: 55,  mrp: 65,  time: '8 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=300&q=80' },
  { id: 14, cat: 'care',    name: 'Face Wash',            weight: '100ml',   price: 129, mrp: 155, time: '10 mins', badge: '',        img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80' },
  { id: 15, cat: 'fruits',  name: 'Mango Alphonso',       weight: '3 pcs',   price: 149, mrp: 180, time: '9 mins',  badge: 'Season',  img: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=300&q=80' },
  { id: 16, cat: 'dairy',   name: 'Greek Yogurt',         weight: '400g',    price: 95,  mrp: 110, time: '10 mins', badge: '',        img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80' },
  { id: 17, cat: 'veggies', name: 'Onions',               weight: '1 kg',    price: 40,  mrp: 50,  time: '8 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80' },
  { id: 18, cat: 'snacks',  name: 'Dark Chocolate Bar',   weight: '80g',     price: 89,  mrp: 99,  time: '7 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&q=80' },
  { id: 19, cat: 'bakery',  name: 'Croissant Fresh',      weight: '2 pcs',   price: 65,  mrp: 80,  time: '9 mins',  badge: 'Fresh',   img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80' },
  { id: 20, cat: 'clean',   name: 'Dish Wash Liquid',     weight: '500ml',   price: 75,  mrp: 90,  time: '10 mins', badge: '',        img: 'https://images.unsplash.com/photo-1585413330440-3ac9c44c85e3?w=300&q=80' },
  { id: 21, cat: 'veggies', name: 'Broccoli',             weight: '400g',    price: 55,  mrp: 65,  time: '8 mins',  badge: 'Organic', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&q=80' },
  { id: 22, cat: 'fruits',  name: 'Grapes Black',         weight: '500g',    price: 79,  mrp: 95,  time: '9 mins',  badge: '',        img: 'https://images.unsplash.com/photo-1515778767554-42a0d4d73b4d?w=300&q=80' },
  { id: 23, cat: 'dairy',   name: 'Butter Salted',        weight: '100g',    price: 52,  mrp: 58,  time: '10 mins', badge: '',        img: 'https://images.unsplash.com/photo-1589985270827-1c9e93498e5a?w=300&q=80' },
  { id: 24, cat: 'drinks',  name: 'Coconut Water',        weight: '200ml',   price: 30,  mrp: 35,  time: '7 mins',  badge: 'Fresh',   img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300&q=80' },
  { id: 25, cat: 'baby',    name: 'Baby Diapers S',       weight: '20 pcs',  price: 299, mrp: 349, time: '12 mins', badge: '',        img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300&q=80' },
  { id: 26, cat: 'care',    name: 'RCB X PUMA 2026 Jersey',       weight: '1 pcs',  price: 4999, mrp: 5999, time: '12 mins', badge: 'New',        img: 'https://teehubshop.com/wp-content/uploads/2026/02/RCB-JERSEY-2026-FRONT-600x800.jpg' },
];

const OFFERS = [
  '🎉 20% OFF on first order — Use FIRST20',
  '🥛 Buy 2 Get 1 Free on Dairy',
  '🍎 Fresh Fruits starting ₹35',
  '⚡ Free delivery on orders above ₹199',
  '🧴 Personal care up to 30% off',
  '🍗 Fresh Chicken — delivered chilled',
  '🥦 Organic veggies — same day fresh',
  '🎁 Refer & earn ₹50 cashback',
];

/* ── Config ── */
const SHOP_WA        = '919956903930';   // WhatsApp number with country code
const SHOP_EMAIL     = 'your@email.com'; // Replace with your email
const PLATFORM_FEE   = 50;
const DELIVERY_FEE   = 0; // FREE

/* Google Sheets Endpoint — replace with your own deployed Apps Script URL */
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxXg8vEeUrl8UyKefD0O-Xa9MaqoDq3r2E8GICLT5HmRq6jbQTgsLbeXBWz8sfSvrzC/exec';
