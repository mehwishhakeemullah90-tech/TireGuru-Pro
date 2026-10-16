// Tyre catalogue. `img` is the photo shown on tyre cards (files live in /public/images/tyres).
// The current photos are representative wheel-and-tyre shots (CC0, Wikimedia Commons) —
// replace each one with the manufacturer's official product photo when you have it.
export const TYRES = [
  { id: 1, brand: 'Michelin', name: 'Pilot Sport 5', w: 225, h: 45, r: 18, cat: 'Car & SUV', price: 845, old: 960, rating: 4.9, reviews: 612, speed: 'Y', load: 95, origin: 'France', warranty: 5, tread: 'sport', season: 'Summer', img: '/images/tyres/sport-1.webp' },
  { id: 2, brand: 'Michelin', name: 'Primacy 4+', w: 205, h: 55, r: 16, cat: 'Car & SUV', price: 465, old: 520, rating: 4.8, reviews: 903, speed: 'V', load: 91, origin: 'Spain', warranty: 5, tread: 'eco', season: 'All-Season', img: '/images/tyres/eco-1.webp' },
  { id: 3, brand: 'Bridgestone', name: 'Turanza 6', w: 215, h: 55, r: 17, cat: 'Car & SUV', price: 540, old: null, rating: 4.7, reviews: 288, speed: 'W', load: 94, origin: 'Japan', warranty: 5, tread: 'eco', season: 'Summer', img: '/images/tyres/eco-2.webp' },
  { id: 4, brand: 'Bridgestone', name: 'Dueler A/T 002', w: 265, h: 65, r: 17, cat: 'Off Road', price: 790, old: 880, rating: 4.7, reviews: 176, speed: 'T', load: 112, origin: 'Japan', warranty: 4, tread: 'offroad', season: 'All-Terrain', img: '/images/tyres/offroad-1.webp' },
  { id: 5, brand: 'Pirelli', name: 'P Zero PZ4', w: 245, h: 40, r: 19, cat: 'Car & SUV', price: 1290, old: 1420, rating: 4.9, reviews: 421, speed: 'Y', load: 98, origin: 'Italy', warranty: 5, tread: 'sport', season: 'Summer', img: '/images/tyres/sport-2.webp' },
  { id: 6, brand: 'Pirelli', name: 'Scorpion Verde', w: 235, h: 55, r: 19, cat: 'Car & SUV', price: 960, old: null, rating: 4.6, reviews: 203, speed: 'V', load: 105, origin: 'Italy', warranty: 5, tread: 'suv', season: 'All-Season', img: '/images/tyres/suv-1.webp' },
  { id: 7, brand: 'Continental', name: 'PremiumContact 7', w: 225, h: 45, r: 18, cat: 'Car & SUV', price: 710, old: 790, rating: 4.8, reviews: 355, speed: 'Y', load: 95, origin: 'Germany', warranty: 5, tread: 'eco', season: 'Summer', img: '/images/tyres/eco-3.webp' },
  { id: 8, brand: 'Continental', name: 'VanContact Ultra', w: 215, h: 65, r: 16, cat: 'Pickup & Van', price: 520, old: null, rating: 4.6, reviews: 97, speed: 'T', load: 109, origin: 'Germany', warranty: 4, tread: 'suv', season: 'All-Season', img: '/images/tyres/suv-2.webp' },
  { id: 9, brand: 'Goodyear', name: 'Wrangler AT Adventure', w: 265, h: 70, r: 16, cat: 'Off Road', price: 640, old: 720, rating: 4.6, reviews: 297, speed: 'T', load: 112, origin: 'USA', warranty: 4, tread: 'offroad', season: 'All-Terrain', img: '/images/tyres/offroad-2.webp' },
  { id: 10, brand: 'Goodyear', name: 'EfficientGrip 2 SUV', w: 265, h: 65, r: 17, cat: 'Car & SUV', price: 690, old: null, rating: 4.7, reviews: 188, speed: 'H', load: 112, origin: 'Thailand', warranty: 5, tread: 'suv', season: 'Summer', img: '/images/tyres/sport-3.webp' },
  { id: 11, brand: 'Hankook', name: 'iON evo', w: 235, h: 45, r: 19, cat: 'Electric Vehicle', price: 780, old: 860, rating: 4.7, reviews: 142, speed: 'W', load: 99, origin: 'Korea', warranty: 5, tread: 'eco', season: 'Summer', img: '/images/tyres/eco-4.webp' },
  { id: 12, brand: 'Yokohama', name: 'Geolandar X-AT', w: 285, h: 60, r: 18, cat: 'Pickup & Van', price: 870, old: null, rating: 4.6, reviews: 119, speed: 'Q', load: 116, origin: 'Japan', warranty: 4, tread: 'offroad', season: 'All-Terrain', img: '/images/tyres/sport-4.webp' },
]
export const sizeOf = (t) => `${t.w}/${t.h} R${t.r}`

export const CATEGORIES = ['Car & SUV', 'Off Road', 'Pickup & Van', 'Electric Vehicle']
export const BRANDS = ['Michelin', 'Bridgestone', 'Pirelli', 'Continental', 'Goodyear', 'Hankook', 'Yokohama', 'Dunlop', 'Toyo', 'Falken', 'Kumho', 'Nexen', 'BFGoodrich', 'Cooper', 'Nitto', 'GT Radial']
// Official brand logos in their original colours (saved in /public/brands, sourced from Wikimedia Commons).
// The "Trusted brands" grid shows them muted, and reveals the real colours on hover.
export const BRAND_LOGOS = {
  Michelin: '/brands/michelin.svg', Bridgestone: '/brands/bridgestone.svg', Pirelli: '/brands/pirelli.svg', Continental: '/brands/continental.svg',
  Goodyear: '/brands/goodyear.svg', Hankook: '/brands/hankook.svg', Yokohama: '/brands/yokohama.svg', Dunlop: '/brands/dunlop.png',
  Toyo: '/brands/toyo.svg', Falken: '/brands/falken.svg', Kumho: '/brands/kumho.svg', Nexen: '/brands/nexen.svg',
  BFGoodrich: '/brands/bfgoodrich.svg', Cooper: '/brands/cooper.svg', Nitto: '/brands/nitto.png', 'GT Radial': '/brands/gtradial.svg',
}

export const OFFERS = [
  { id: 'o1', brand: 'Michelin', title: 'Buy 3, get the 4th free', note: 'On Pilot Sport & Primacy ranges', code: 'MICH4', tone: 'navy' },
  { id: 'o2', brand: 'Bridgestone', title: 'AED 200 cashback', note: 'On any set of 4 Bridgestone tyres', code: 'BS200', tone: 'gold' },
  { id: 'o3', brand: 'Pirelli', title: 'Free 3D wheel alignment', note: 'With every Pirelli set of 4', code: 'PZALIGN', tone: 'ivory' },
  { id: 'o4', brand: 'Continental', title: 'Free oil change', note: 'When you fit 4 Continental tyres', code: 'CONTOIL', tone: 'navy' },
  { id: 'o5', brand: 'Goodyear', title: '15% off off-road tyres', note: 'Wrangler range, this month only', code: 'GY15', tone: 'gold' },
  { id: 'o6', brand: 'All brands', title: 'Free diagnostic scan', note: 'With any tyre order over AED 1,500', code: 'SCANFREE', tone: 'ivory' },
]
// Promo codes the cart understands
export const CODES = { GURU100: { label: 'AED 100 off', flat: 100 }, BS200: { label: 'Bridgestone cashback', flat: 200, brand: 'Bridgestone', min: 4 }, GY15: { label: '15% Goodyear', pct: 15, brand: 'Goodyear' }, MICH4: { label: 'Michelin 4th free', free4: 'Michelin' } }

export const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain']
export const INSTALLERS = [
  { id: 'i1', name: 'TireGuru Al Quoz', area: 'Al Quoz Industrial 3', city: 'Dubai', rating: 4.9, hours: '8am – 10pm', services: ['Fitting', 'Alignment', 'Service'] },
  { id: 'i2', name: 'TireGuru Business Bay', area: 'Marasi Drive', city: 'Dubai', rating: 4.8, hours: '8am – 11pm', services: ['Fitting', 'Car Spa'] },
  { id: 'i3', name: 'TireGuru JLT', area: 'Cluster T, JLT', city: 'Dubai', rating: 4.8, hours: '9am – 10pm', services: ['Fitting', 'Alignment'] },
  { id: 'i4', name: 'Musaffah Tyre Centre', area: 'Musaffah M-10', city: 'Abu Dhabi', rating: 4.7, hours: '8am – 9pm', services: ['Fitting', 'Alignment', 'Service'] },
  { id: 'i5', name: 'TireGuru Khalifa City', area: 'Khalifa City A', city: 'Abu Dhabi', rating: 4.8, hours: '9am – 10pm', services: ['Fitting', 'Car Spa'] },
  { id: 'i6', name: 'Industrial Area 6 Hub', area: 'Industrial Area 6', city: 'Sharjah', rating: 4.6, hours: '8am – 10pm', services: ['Fitting', 'Alignment'] },
  { id: 'i7', name: 'Al Jurf Auto Care', area: 'Al Jurf Industrial', city: 'Ajman', rating: 4.6, hours: '8am – 9pm', services: ['Fitting', 'Service'] },
  { id: 'i8', name: 'Al Hamra Tyre Point', area: 'Al Hamra', city: 'Ras Al Khaimah', rating: 4.7, hours: '9am – 9pm', services: ['Fitting', 'Alignment'] },
  { id: 'i9', name: 'Fujairah Coast Motors', area: 'Fujairah Industrial', city: 'Fujairah', rating: 4.5, hours: '9am – 8pm', services: ['Fitting'] },
  { id: 'i10', name: 'UAQ Tyre Studio', area: 'Al Salamah', city: 'Umm Al Quwain', rating: 4.5, hours: '9am – 8pm', services: ['Fitting'] },
]

export const SERVICES = [
  { id: 'service', name: 'Service & Repair', blurb: 'Manufacturer-schedule servicing with genuine parts.', from: 349, icon: 'Wrench', options: ['Minor service', 'Major service', 'Brake pads', 'AC re-gas', 'Diagnostic scan'] },
  { id: 'alignment', name: 'Wheel Alignment', blurb: '3D laser alignment and dynamic balancing.', from: 149, icon: 'Crosshair', options: ['3D alignment', 'Balancing (4 wheels)', 'Alignment + balancing'] },
  { id: 'spa', name: 'Car Spa', blurb: 'Hand wash, interior detailing and ceramic coating.', from: 89, icon: 'Sparkles', options: ['Exterior wash', 'Full detailing', 'Ceramic coating', 'Window tinting'] },
  { id: 'recovery', name: 'Car Recovery', blurb: '24/7 flatbed recovery anywhere in the UAE.', from: 199, icon: 'Truck', options: ['Breakdown recovery', 'Jump start', 'Flat tyre help', 'Fuel delivery'] },
  { id: 'insurance', name: 'Car Insurance', blurb: 'Compare quotes from leading UAE insurers.', from: 0, icon: 'ShieldCheck', options: ['Comprehensive', 'Third party', 'Agency repair'] },
]

export const STEPS = [
  ['Search', 'Select your tyres online', 'Search by size or vehicle and compare 80+ brands side by side.'],
  ['MapPin', 'Choose installer & time', 'Pick one of 350+ fitting centres, or mobile fitting at your door.'],
  ['CreditCard', 'Pay securely', 'Card, Apple Pay, Tabby in 4, or pay at the installer.'],
  ['CheckCircle2', 'Get them fitted', 'Arrive at your slot — tyres are waiting, fitting is included.'],
]

export const TESTIMONIALS = [
  { name: 'Ahmed Al Suwaidi', date: 'Sep 2026', text: 'Ordered at night, fitted at Al Quoz next morning. Price was lower than three shops I called.', stars: 5 },
  { name: 'Priya Nair', date: 'Sep 2026', text: 'The vehicle search picked the right size for my Tiguan instantly. Smooth, professional fitting.', stars: 5 },
  { name: 'James Whitfield', date: 'Aug 2026', text: 'Used Tabby to split the payment. Pirelli set fitted and aligned in under an hour.', stars: 5 },
  { name: 'Sofia Romano', date: 'Jul 2026', text: 'Clear warranty paperwork and fresh DOT dates. Exactly what I wanted to see.', stars: 4 },
  { name: 'Khalid Rahman', date: 'Jul 2026', text: 'Off-road Wranglers for my Patrol, honest advice on load rating. Will return.', stars: 5 },
]

export const FAQS = [
  ['When should I replace my tyres?', 'Replace them when tread depth reaches 1.6 mm, when you see cracks, bulges or uneven wear, or when they are more than 5 years old — UAE heat ages rubber faster than cooler climates.'],
  ['How do I read my tyre size?', 'Look at the sidewall: in 225/45 R18, 225 is the width in mm, 45 is the height as a percentage of width, and 18 is the rim diameter in inches.'],
  ['Does the price include fitting?', 'Yes. Every price includes fitting, valve replacement, balancing and disposal of your old tyres at any TireGuru installer.'],
  ['Can I get mobile fitting at home?', 'Yes — choose “Mobile fitting” at checkout. A fully equipped van comes to your home or office in Dubai, Abu Dhabi and Sharjah for AED 49.'],
  ['What warranty do I get?', 'All tyres carry the manufacturer warranty (3–5 years) against defects, plus our free lifetime puncture repair on tyres bought from us.'],
  ['How old are the tyres you sell?', 'We only sell tyres manufactured within the last 12 months. The DOT date is printed on your invoice.'],
  ['Can I pay in installments?', 'Yes — split any order into 4 interest-free payments with Tabby or Tamara at checkout.'],
  ['How do I claim a warranty?', 'Visit any installer with your order number. We inspect the tyre and handle the claim with the manufacturer for you.'],
]

// Help centre topic cards. `faq` is the index of the matching question in FAQS above —
// clicking a card opens that answer. Photos live in /public/images.
// Background media for the "Still have a question?" card on the home page.
// To use your own clip, drop it in /public/videos/ with this exact name — no code change needed.
// Until the file exists (or if it fails to load) the poster photo is shown instead.
export const HELP_CONTACT_MEDIA = {
  video: '/videos/faq-tyres.mp4',
  poster: '/images/help/faq-tyre-poster.webp',
}

export const HELP_TOPICS = [
  { tag: 'Safety', title: 'When to replace your tyres', text: 'Tread depth, cracks, bulges and age — the signs to look for.', img: '/images/help/coin-test.webp', faq: 0 },
  { tag: 'Sizing', title: 'How to read your tyre size', text: 'Decode the numbers on your sidewall in under a minute.', img: '/images/help/sidewall.webp', faq: 1 },
  { tag: 'Fitting', title: 'Fitting & mobile service', text: 'What is included, and how home fitting works.', img: '/images/tyres/eco-2.webp', faq: 3 },
  { tag: 'Warranty', title: 'Warranty & claims', text: 'Manufacturer cover plus free lifetime puncture repair.', img: '/images/tyres/sport-4.webp', faq: 4 },
]

export const MAKES = {
  Toyota: { 'Land Cruiser': '265/65 R17', Camry: '215/55 R17', Corolla: '205/55 R16', Hilux: '265/65 R17' },
  Nissan: { Patrol: '265/70 R16', Altima: '215/55 R17', 'X-Trail': '225/45 R18' },
  BMW: { '3 Series': '225/45 R18', '5 Series': '245/40 R19', X5: '235/55 R19' },
  Mercedes: { 'C-Class': '225/45 R18', 'E-Class': '245/40 R19', 'G-Class': '285/60 R18' },
  Tesla: { 'Model 3': '235/45 R19', 'Model Y': '235/45 R19' },
  Ford: { 'F-150': '285/60 R18', Transit: '215/65 R16' },
}
export const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019']
export const WIDTHS = [185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285]
export const HEIGHTS = [35, 40, 45, 50, 55, 60, 65, 70]
export const RIMS = [15, 16, 17, 18, 19, 20, 21, 22]
export const POPULAR = ['205/55 R16', '215/55 R17', '225/45 R18', '235/45 R19', '245/40 R19', '265/65 R17', '265/70 R16', '285/60 R18']
export const SLOTS = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00']
