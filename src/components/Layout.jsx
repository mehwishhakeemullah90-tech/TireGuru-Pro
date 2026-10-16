import { useEffect, useState } from 'react'
import { Phone, HelpCircle, User, ShoppingBag, Menu, X, ChevronDown, Globe, Instagram, Facebook, Youtube, Linkedin, CheckCircle2, Mail, Clock } from 'lucide-react'
import { useStore, A } from '../store.jsx'
import { CATEGORIES, BRANDS, POPULAR } from '../data.js'

export function Logo({ light }) {
  return (
    <A to="/" className={`logo ${light ? 'light' : ''}`} aria-label="TireGuru home">
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true"><rect width="40" height="40" rx="11" fill="currentColor" className="logo-bg" /><circle cx="20" cy="20" r="11.5" fill="none" stroke="#fe6356" strokeWidth="4.5" strokeDasharray="3.4 2" /><circle cx="20" cy="20" r="4.2" fill="#fe6356" /></svg>
      <span>Tire<b>Guru</b></span>
    </A>
  )
}

export function Header() {
  const { t, totals, lang, setLang, route } = useStore()
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const [stuck, setStuck] = useState(false)
  useEffect(() => { setOpen(false); setMega(false) }, [route])
  useEffect(() => { const f = () => setStuck(window.scrollY > 40); f(); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f) }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const nav = [['/offers', t('offers')], ['/services/alignment', t('fitting')], ['/service-repair', t('service')], ['/services/spa', t('spa')], ['/insurance', t('insurance')], ['/installers', t('installers')]]
  const active = (p) => route.path === p || (p !== '/' && route.path.startsWith(p))

  return (
    <>
      <div className="util">
        <div className="wrap util-in">
          <span className="util-msg"><CheckCircle2 size={14} /> Fitting included on every tyre · Free delivery to 350+ centres</span>
          <div className="util-links">
            <A to="/faq"><HelpCircle size={14} /> {t('faq')}</A>
            <a href="tel:+97148760000"><Phone size={14} /> +971 4 876 0000</a>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}><Globe size={14} /> {lang === 'en' ? 'العربية' : 'English'}</button>
          </div>
        </div>
      </div>
      <header className={`hdr ${stuck ? 'stuck' : ''}`}>
        <div className="wrap hdr-in">
          <button className="icon-btn burger" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <Logo />
          <nav className="mainnav" aria-label="Main">
            <div className="has-mega" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
              <button className={active('/tyres') ? 'on' : ''} onClick={() => setMega(!mega)} aria-expanded={mega}>{t('tyres')} <ChevronDown size={14} /></button>
              {mega && (
                <div className="mega">
                  <div><h6>Shop by type</h6>{CATEGORIES.map((c) => <A key={c} to="/tyres" q={{ cat: c }}>{c}</A>)}<A to="/tyres" className="gold">All tyres →</A></div>
                  <div><h6>Popular brands</h6>{BRANDS.slice(0, 6).map((b) => <A key={b} to="/tyres" q={{ brand: b }}>{b}</A>)}</div>
                  <div><h6>Popular sizes</h6>{POPULAR.slice(0, 6).map((s) => <A key={s} to="/tyres" q={{ size: s }}>{s}</A>)}</div>
                  <div className="mega-promo"><span className="eyebrow">This month</span><b className="serif">Buy 3, get the 4th free</b><p>On Michelin Pilot Sport & Primacy.</p><A to="/offers" className="btn btn-gold btn-sm">View offer</A></div>
                </div>
              )}
            </div>
            {nav.map(([p, l]) => <A key={p} to={p} className={active(p) ? 'on' : ''}>{l}</A>)}
          </nav>
          <div className="hdr-act">
            <A to="/account" className="icon-btn" aria-label={t('account')}><User size={20} /></A>
            <A to="/cart" className="icon-btn cart-btn" aria-label={t('cart')}><ShoppingBag size={20} />{totals.count > 0 && <i>{totals.count}</i>}</A>
          </div>
        </div>
      </header>

      <div className={`side-bg ${open ? 'show' : ''}`} onClick={() => setOpen(false)}>
        <aside className="side" onClick={(e) => e.stopPropagation()}>
          <div className="side-h"><Logo /><button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button></div>
          <A to="/tyres" className="side-cta btn btn-gold btn-block">Find a tyre</A>
          <h6>{t('tyres')}</h6>
          {CATEGORIES.map((c) => <A key={c} to="/tyres" q={{ cat: c }}>{c}</A>)}
          <h6>Services</h6>
          {nav.map(([p, l]) => <A key={p} to={p}>{l}</A>)}
          <A to="/services/recovery">{t('recovery')}</A>
          <h6>Help</h6>
          <A to="/faq">{t('faq')}</A><A to="/contact">{t('contact')}</A><A to="/account">{t('account')}</A>
          <button className="side-lang" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}><Globe size={16} /> {lang === 'en' ? 'العربية' : 'English'}</button>
        </aside>
      </div>
    </>
  )
}

export function Footer() {
  const { notify } = useStore()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const sub = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return notify('Please enter a valid email address')
    setDone(true); notify('Subscribed — use code GURU100 for AED 100 off')
  }
  return (
    <footer className="ftr">
      <div className="wrap ftr-news">
        <div><span className="eyebrow">Newsletter</span><h3 className="serif">Tyre deals, before anyone else.</h3><p>Monthly offers and maintenance tips. New subscribers get AED 100 off.</p></div>
        {done ? <p className="ok"><CheckCircle2 size={18} /> You're in. Your code: <b>GURU100</b></p> : (
          <form onSubmit={sub}><Mail size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" /><button className="btn btn-gold">Subscribe</button></form>
        )}
      </div>
      <div className="wrap ftr-cols">
        <div className="ftr-brand">
          <Logo light />
          <p>Buy tyres online, fitted locally across all seven emirates.</p>
          <p className="hours"><Clock size={14} /> Mon–Sat 8am–10pm · Sun 9am–8pm</p>
          <a href="tel:+97148760000" className="ftr-phone"><Phone size={16} /> +971 4 876 0000</a>
          <div className="socials">{[Instagram, Facebook, Youtube, Linkedin].map((I, i) => <a key={i} href="#/" aria-label="Social link"><I size={17} /></a>)}</div>
        </div>
        <div><h6>Tyres</h6>{CATEGORIES.map((c) => <A key={c} to="/tyres" q={{ cat: c }}>{c}</A>)}<A to="/offers">Special offers</A><A to="/installers">Fitting centres</A></div>
        <div><h6>Popular sizes</h6>{POPULAR.map((s) => <A key={s} to="/tyres" q={{ size: s }}>{s}</A>)}</div>
        <div><h6>Services</h6><A to="/services/alignment">Wheel alignment</A><A to="/service-repair">Service & repair</A><A to="/services/spa">Car spa</A><A to="/services/recovery">Car recovery</A><A to="/insurance">Car insurance</A></div>
        <div><h6>Help & info</h6><A to="/account">My orders</A><A to="/faq">FAQs</A><A to="/faq">Warranty</A><A to="/contact">Contact us</A></div>
      </div>
      <div className="wrap ftr-bot"><span>© {new Date().getFullYear()} TireGuru UAE. All rights reserved.</span><span className="pay">Visa · Mastercard · Apple Pay · Tabby · Tamara</span></div>
    </footer>
  )
}

export function Toast() {
  const { toast } = useStore()
  return <div className={`toast ${toast ? 'show' : ''}`} role="status"><CheckCircle2 size={18} /> {toast}</div>
}

export function WhatsApp() {
  return (
    <a className="wa" href="https://wa.me/971500000000" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.6-.1 1.2Z" /></svg>
    </a>
  )
}
