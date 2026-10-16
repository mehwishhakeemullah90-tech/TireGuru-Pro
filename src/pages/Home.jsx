import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Minus, Phone, Mail, ShieldCheck, Smile, Truck, Copy, ArrowRight, BookOpen, Search, Wrench, MessageCircle } from 'lucide-react'
import Tire from '../components/Tire.jsx'
import { TyreCard, SectionHead, Stars, Icon, Reveal } from '../components/ui.jsx'
import { useStore, A } from '../store.jsx'
import { TYRES, OFFERS, TESTIMONIALS, BRANDS, BRAND_LOGOS, FAQS, HELP_TOPICS, HELP_CONTACT_MEDIA, SERVICES } from '../data.js'

function Rail({ children, label }) {
  const ref = useRef(null)
  const by = (d) => { const el = ref.current; if (!el) return; const rtl = document.dir === 'rtl' ? -1 : 1; el.scrollBy({ left: d * rtl * el.clientWidth * 0.8, behavior: 'smooth' }) }
  return (
    <div className="rail-wrap">
      <div className="rail" ref={ref} aria-label={label}>{children}</div>
      <div className="rail-nav"><button className="icon-btn ring" onClick={() => by(-1)} aria-label="Previous"><ChevronLeft size={18} /></button><button className="icon-btn ring" onClick={() => by(1)} aria-label="Next"><ChevronRight size={18} /></button></div>
    </div>
  )
}

export function OfferCard({ o }) {
  const { notify } = useStore()
  const copy = () => { try { navigator.clipboard?.writeText(o.code) } catch {} ; notify(`Code ${o.code} copied — apply it in your cart`) }
  return (
    <div className={`offer ${o.tone}`}>
      <span className="offer-brand">{o.brand}</span>
      <h3 className="serif">{o.title}</h3>
      <p>{o.note}</p>
      <div className="offer-f">
        <button className="code" onClick={copy}><Copy size={14} /> {o.code}</button>
        <A to="/tyres" q={o.brand !== 'All brands' ? { brand: o.brand } : undefined} className="offer-link">Shop →</A>
      </div>
      <div className="offer-tire"><Tire size={150} /></div>
    </div>
  )
}

// FAQ accordion. Works on its own, or "controlled" when a parent passes `open` + `onOpen`
// (the Help centre does this so its topic cards can open a specific answer).
export function Faq({ items = FAQS, open: openProp, onOpen }) {
  const [openState, setOpenState] = useState(0)
  const open = openProp ?? openState
  const setOpen = onOpen ?? setOpenState
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <div key={q} id={`faq-${i}`} className={`faq-i ${open === i ? 'open' : ''}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><span>{q}</span>{open === i ? <Minus size={18} /> : <Plus size={18} />}</button>
          <div className="faq-a"><p>{a}</p></div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Popular tyres this week ---------- */
function PopularTyres() {
  const { t } = useStore()
  // Best sellers = the four tyres with the most reviews
  const popular = [...TYRES].sort((a, b) => b.reviews - a.reviews).slice(0, 4)
  return (
    <section className="popular">
      <div className="wrap">
        <Reveal>
          <SectionHead eyebrow="Best sellers" title="Popular tyres this week" action={<A to="/tyres" className="btn btn-line">{t('seeAll')} <ArrowRight size={16} /></A>} />
        </Reveal>
        <div className="tgrid">
          {popular.map((ty, i) => (
            <Reveal key={ty.id} delay={i * 90} className="tgrid-item"><TyreCard t={ty} rank={i + 1} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Official partner · Trusted brands ---------- */
function TrustedBrands() {
  return (
    <Reveal as="section" className="wrap sec brands-sec">
      <SectionHead eyebrow="Official partner" title="Trusted brands" action={<A to="/tyres" className="btn btn-line">See all brands <ArrowRight size={16} /></A>} />
      <p className="muted brands-lead">Genuine, GCC-spec tyres sourced from official distributors of the world's leading manufacturers.</p>
      <div className="brand-grid">
        {BRANDS.map((b) => (
          <A key={b} to="/tyres" q={{ brand: b }} className="brand-tile" title={`Shop ${b} tyres`}>
            {/* Logo starts muted (grayscale) and shows its real brand colours on hover — see .brand-tile in styles.css */}
            {BRAND_LOGOS[b] ? <img src={BRAND_LOGOS[b]} alt={`${b} logo`} loading="lazy" /> : <span>{b}</span>}
          </A>
        ))}
      </div>
    </Reveal>
  )
}

/* ---------- Help centre ---------- */
function HelpCentre() {
  const [open, setOpen] = useState(0)
  const faqRef = useRef(null)

  // Topic card click: open that answer and scroll the FAQ list into view
  const openTopic = (i) => {
    setOpen(i)
    setTimeout(() => document.getElementById(`faq-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }
  const toAnswers = () => faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section className="help" aria-labelledby="help-title">
      {/* 1. Dark intro band with photo collage */}
      <div className="help-hero">
        <div className="wrap help-hero-in">
          <Reveal className="help-copy">
            <span className="eyebrow light">Help centre</span>
            <h2 id="help-title" className="serif">Tyre questions, <em>answered.</em></h2>
            <p>Clear, expert advice on choosing, fitting and caring for your tyres — so you can drive with confidence on every UAE road.</p>
            <div className="help-actions">
              <A to="/faq" className="btn btn-gold"><BookOpen size={17} /> Explore tyre guides</A>
              <button type="button" className="btn btn-ghost" onClick={toAnswers}><Search size={17} /> Find answers</button>
            </div>
            <ul className="help-facts">
              <li><b className="serif">1.6 mm</b><span>Minimum safe tread depth</span></li>
              <li><b className="serif">7 days</b><span>Tyre experts on call</span></li>
              <li><b className="serif">4.9 ★</b><span>From 6,000+ reviews</span></li>
            </ul>
          </Reveal>
          <Reveal className="help-visual" delay={150} aria-hidden="true">
            <div className="help-photo main"><img src="/images/help/wheel-hero.webp" alt="" loading="lazy" width="1000" height="750" /></div>
            <div className="help-photo small"><img src="/images/help/tread-wear.webp" alt="" loading="lazy" width="760" height="1014" /></div>
            <div className="help-chip"><Wrench size={16} /> Fitting, balancing & valves included</div>
            <div className="help-ring"><Tire size={120} accent="#feaa8b" /></div>
          </Reveal>
        </div>
      </div>

      {/* 2. Topic cards — each one opens the matching answer below */}
      <div className="wrap help-topics">
        {HELP_TOPICS.map((tp, i) => (
          <Reveal key={tp.title} delay={i * 90}>
            <button type="button" className="topic" onClick={() => openTopic(tp.faq)}>
              <span className="topic-img"><img src={tp.img} alt="" loading="lazy" width="640" height="480" /></span>
              <span className="topic-body">
                <span className="topic-tag">{tp.tag}</span>
                <b className="serif">{tp.title}</b>
                <span className="topic-text">{tp.text}</span>
                <span className="topic-link">Read answer <ArrowRight size={15} /></span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {/* 3. Full FAQ list + contact card */}
      <div className="wrap help-faq" ref={faqRef}>
        <Reveal className="help-faq-list">
          <span className="eyebrow">Popular questions</span>
          <Faq open={open} onOpen={setOpen} />
          <A to="/faq" className="text-link">See all FAQs →</A>
        </Reveal>
        <Reveal as="aside" className="help-contact" delay={120}>
          <ContactMedia />
          <div className="hc-content">
            <span className="help-contact-ic"><MessageCircle size={26} /></span>
            <h3 className="serif">Still have a question?</h3>
            <p>Our tyre experts are on hand seven days a week — call, email or WhatsApp us.</p>
            {/* Buttons sit in their own group so they can be spaced a little lower than the text */}
            <div className="hc-actions">
              <a href="tel:+97148760000" className="btn btn-gold btn-block"><Phone size={16} /> Call +971 4 876 0000</a>
              <a href="mailto:hello@tireguru.ae" className="btn btn-ghost btn-block"><Mail size={16} /> hello@tireguru.ae</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}


/* Background for the "Still have a question?" card.
   Layers (bottom → top): poster photo, looping video, brand-coloured shade, slow-spinning tyre.
   - The video only plays while the card is on screen (saves battery and data).
   - If the video file is missing, the user prefers reduced motion, or Data Saver is on,
     only the poster photo is shown. */
function ContactMedia() {
  const boxRef = useRef(null)
  const videoRef = useRef(null)
  const [useVideo] = useState(() => {
    if (typeof window === 'undefined') return false
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const saveData = navigator.connection?.saveData
    return Boolean(HELP_CONTACT_MEDIA.video) && !reduce && !saveData
  })
  const [videoOk, setVideoOk] = useState(true)
  const [ready, setReady] = useState(false)

  // Play when visible, pause when scrolled away
  useEffect(() => {
    const box = boxRef.current
    const video = videoRef.current
    if (!box || !video) return
    if (!('IntersectionObserver' in window)) { video.play().catch(() => {}); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { threshold: 0.15 })
    io.observe(box)
    return () => io.disconnect()
  }, [useVideo, videoOk])

  return (
    <div className="hc-media" ref={boxRef} aria-hidden="true">
      <img className="hc-poster" src={HELP_CONTACT_MEDIA.poster} alt="" loading="lazy" width="576" height="1024" />
      {useVideo && videoOk && (
        <video
          ref={videoRef}
          className={`hc-video ${ready ? 'ready' : ''}`}
          src={HELP_CONTACT_MEDIA.video}
          poster={HELP_CONTACT_MEDIA.poster}
          muted loop playsInline preload="metadata"
          onCanPlay={() => setReady(true)}
          onError={() => setVideoOk(false)}
        />
      )}
      <span className="hc-shade" />
      <span className="hc-tyre"><Tire size={240} spin accent="#feaa8b" /></span>
    </div>
  )
}

export default function Home() {
  const { t } = useStore()
  const [more, setMore] = useState(false)

  return (
    <>
      <section className="sec band first">
        <Reveal className="wrap">
          <SectionHead eyebrow="Limited time" title={t('specials')} action={<A to="/offers" className="btn btn-line">{t('seeAll')}</A>} />
          <Rail label="Special offers">{OFFERS.map((o) => <OfferCard key={o.id} o={o} />)}</Rail>
        </Reveal>
      </section>

      <PopularTyres />

      <Reveal as="section" className="wrap sec">
        <div className="values">
          <div className="value"><Truck size={28} /><b>Local installers, free delivery</b><p>Tyres delivered free to a network of 350+ fitting centres — or to your door with mobile fitting.</p><A to="/installers" className="text-link">Find installers near you →</A></div>
          <div className="value"><ShieldCheck size={28} /><b>Manufacturer-backed warranty</b><p>Every tyre carries the official GCC warranty, plus free lifetime puncture repair.</p><A to="/faq" className="text-link">Warranty details →</A></div>
          <div className="value"><Smile size={28} /><b>Rated excellent</b><p>4.9 average from over 6,000 verified Google reviews across the UAE.</p><span className="score"><Stars n={5} /> 4.9 / 5</span></div>
        </div>
      </Reveal>

      <Reveal as="section" className="wrap sec">
        <SectionHead eyebrow="Beyond tyres" title={t('more')} />
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <A key={s.id} to={({ service: '/service-repair', insurance: '/insurance' })[s.id] || `/services/${s.id}`} className="svc-card">
              <span className="svc-ic"><Icon name={s.icon} size={24} /></span>
              <b>{s.name}</b><p>{s.blurb}</p>
              <small>{s.from ? `From AED ${s.from}` : 'Free quotes'} →</small>
            </A>
          ))}
        </div>
      </Reveal>

      <section className="sec band">
        <Reveal className="wrap">
          <SectionHead eyebrow="6,000+ reviews" title={t('reviews')} />
          <Rail label="Customer reviews">
            {TESTIMONIALS.map((r) => (
              <figure key={r.name} className="review"><Stars n={r.stars} /><blockquote>“{r.text}”</blockquote><figcaption><span className="avatar">{r.name.split(' ').map((x) => x[0]).join('').slice(0, 2)}</span><span><b>{r.name}</b><small>{r.date}</small></span></figcaption></figure>
            ))}
          </Rail>
        </Reveal>
      </section>

      <TrustedBrands />

      <Reveal as="section" className="wrap sec">
        <div className={`seo ${more ? 'open' : ''}`}>
          <h3 className="serif">Buy tyres online from anywhere in the UAE</h3>
          <p>TireGuru brings the UAE's leading tyre brands together in one place, so you can compare prices, reviews and specifications before you buy. Every price includes fitting, balancing, new valves and disposal of your old tyres.</p>
          <p>Choose a fitting centre near home or work in Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah or Umm Al Quwain — or book mobile fitting and have a fully equipped van come to you.</p>
          <h4>Why choose TireGuru?</h4>
          <p>We source only from official GCC distributors, sell tyres manufactured within the last 12 months, and back every set with the manufacturer's warranty and our free lifetime puncture repair. Pay by card, Apple Pay, or split the cost with Tabby or Tamara at 0% interest.</p>
          <h4>Tyres for every vehicle</h4>
          <p>From fuel-efficient tyres for city cars to all-terrain tyres for desert weekends and low-noise tyres built for electric vehicles, our range covers more than 10,000 sizes and patterns.</p>
        </div>
        <button className="text-link" onClick={() => setMore(!more)}>{more ? 'Read less ↑' : 'Read more ↓'}</button>
      </Reveal>

      <HelpCentre />
    </>
  )
}
