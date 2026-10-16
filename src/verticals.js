// Content for the four hero tabs. Each tab has its own route, background photo and landing page.
// Photos: Unsplash (free licence). Replace `bg` with your own, e.g. '/images/tyres.jpg' in /public/images.
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=70`

export const VERTICALS = [
  {
    id: 'tyres', route: '/', tab: 'Tyres', icon: 'LifeBuoy',
    bg: u('photo-1648583562462-db9922fc2e2f'), tint: '#5a3a1a',
    video: '/videos/tyres-hero.mp4', bgPos: 'center 70%',
    title: 'Buy tyres online, fit locally in UAE',
    points: [['Tag', 'Genuine tyres, best prices guaranteed'], ['MapPin', '350+ locations, right technicians & tools'], ['LifeBuoy', '80+ brands and 10,000+ products'], ['Award', 'Quick deliveries, with lifetime warranty']],
    steps: [['LifeBuoy', 'Select your tyres', 'from our website'], ['Wrench', 'Select installer', 'and time for fitting'], ['CreditCard', 'Order & pay online', 'for your order'], ['CheckCircle2', 'We install your tyres', 'when you want them']],
  },
  {
    id: 'insurance', route: '/insurance', tab: 'Insurance', icon: 'Shield',
    bg: '/images/hero/burj-khalifa.webp', tint: '#2a1f3d', bgPos: 'center 22%', // Burj Khalifa at dusk — Marlene Céline Nordvik, Unsplash
    title: 'Compare car insurance in 2 minutes',
    points: [['BadgeCheck', 'Quotes from 15+ licensed UAE insurers'], ['Tag', 'Save up to 40% on your renewal'], ['Zap', 'Instant policy, issued online'], ['Headphones', 'Claims support from our own team']],
    steps: [['Car', 'Tell us about your car', 'make, year and value'], ['FileText', 'Compare quotes', 'side by side'], ['CreditCard', 'Pay online', 'card or Tabby in 4'], ['Shield', 'Get your policy', 'instantly by email']],
    intro: 'Comprehensive or third-party cover from the UAE\'s leading insurers — including agency repair, roadside assistance and off-road cover for 4x4s.',
    faqs: [
      ['What documents do I need?', 'Your Emirates ID, driving licence and the car\'s registration card (Mulkiya). For a new car, the purchase invoice is enough.'],
      ['Comprehensive or third party?', 'Third-party covers damage you cause to others and is the legal minimum. Comprehensive also covers your own car — recommended for cars under 7 years old.'],
      ['What is agency repair?', 'Repairs are done at the official dealer workshop with genuine parts. It is usually available for cars up to 3–5 years old and costs a little more.'],
      ['Can I keep my no-claims discount?', 'Yes. Upload your no-claims certificate from your previous insurer and the discount is applied to every quote.'],
    ],
  },
  {
    id: 'service', route: '/service-repair', tab: 'Service & Repair', icon: 'Settings',
    bg: u('photo-1643700973089-baa86a1ab9ee'), tint: '#1a1410',
    title: 'Car service & repair at fixed, honest prices',
    points: [['ClipboardCheck', 'Manufacturer-schedule servicing'], ['BadgeCheck', 'Genuine & OEM parts with warranty'], ['Car', 'Free pick-up and drop-off'], ['Tag', 'Up to 50% less than dealer prices']],
    steps: [['Settings', 'Choose your service', 'minor, major or repair'], ['Calendar', 'Pick a date', 'and pick-up location'], ['Wrench', 'We service your car', 'with live updates'], ['CheckCircle2', 'Pay & drive', 'only when you approve']],
    intro: 'Certified technicians, genuine parts and a digital inspection report with photos — nothing is replaced without your approval.',
    faqs: [
      ['Will servicing with you affect my warranty?', 'No. UAE consumer law lets you service at any qualified workshop. We follow the manufacturer schedule and use approved parts and oils.'],
      ['How long does a service take?', 'A minor service takes about 2 hours and a major service about 4 hours. Pick-up and drop-off are free.'],
      ['What if you find extra problems?', 'You get a photo report and a fixed quote on WhatsApp. We only proceed after you approve.'],
      ['Is there a warranty on repairs?', 'Yes — 6 months or 10,000 km on parts and labour, whichever comes first.'],
    ],
  },
]
export const byId = Object.fromEntries(VERTICALS.map((v) => [v.id, v]))
export const VERTICAL_ROUTES = Object.fromEntries(VERTICALS.map((v) => [v.route, v.id]))

export const INSURERS = [
  { id: 'n1', name: 'Gulf Shield', rate: 0.026, tpl: 950, perks: ['Agency repair (3 yrs)', 'Roadside assistance', 'Oman cover'] },
  { id: 'n2', name: 'Desert Mutual', rate: 0.023, tpl: 890, perks: ['Garage repair', 'Rent-a-car 7 days', 'Personal accident'] },
  { id: 'n3', name: 'Emirates Prime', rate: 0.031, tpl: 1050, perks: ['Agency repair (5 yrs)', 'Off-road cover', 'Rent-a-car 14 days'] },
  { id: 'n4', name: 'Falcon Assure', rate: 0.021, tpl: 840, perks: ['Garage repair', 'Roadside assistance'] },
]

export const SERVICE_PACKAGES = [
  { id: 's1', name: 'Minor service', price: 349, time: '2 hrs', items: ['Engine oil & filter', '25-point inspection', 'Fluids top-up'] },
  { id: 's2', name: 'Major service', price: 899, time: '4 hrs', items: ['Everything in minor', 'Air & cabin filters', 'Spark plugs', 'Brake fluid', 'Full diagnostic scan'], best: true },
  { id: 's3', name: 'Brake service', price: 449, time: '2 hrs', items: ['Front brake pads', 'Disc inspection', 'Brake fluid check', '6-month warranty'] },
  { id: 's4', name: 'AC service', price: 299, time: '1.5 hrs', items: ['Gas re-fill', 'Leak test', 'Cabin filter', 'Vent sanitising'] },
]
