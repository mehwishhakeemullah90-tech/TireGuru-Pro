import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Star, BadgeCheck, ShieldCheck, Wrench, Phone } from 'lucide-react'
import { useStore, aed } from '../store.jsx'
import { byId, INSURERS, SERVICE_PACKAGES } from '../verticals.js'
import { SERVICES } from '../data.js'
import { SectionHead, Stars } from '../components/ui.jsx'
import { Faq } from './Home.jsx'
import { BookingForm } from './Pages.jsx'

const svcById = Object.fromEntries(SERVICES.map((s) => [s.id, s]))

// Scrolls a section into view after a hero search (query present)
function useScrollOnQuery(ref, deps) {
  const { route } = useStore()
  useEffect(() => {
    if (!Object.keys(route.query).length) return
    const t = setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    return () => clearTimeout(t)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

function Intro({ v, stats }) {
  return (
    <section className="wrap sec intro">
      <div><span className="eyebrow">{v.tab}</span><h2 className="serif">{v.title}</h2><p className="muted">{v.intro}</p></div>
      <div className="stats">{stats.map(([n, l]) => <div key={l}><b className="serif">{n}</b><span>{l}</span></div>)}</div>
    </section>
  )
}

function FaqBlock({ v }) {
  return (
    <section className="wrap sec faq-sec">
      <div><SectionHead eyebrow="Help centre" title={`${v.tab} questions`} /><p className="muted">Can't find your answer? Call us — we're here 7 days a week.</p><div className="faq-cta"><a href="tel:+97148760000" className="btn btn-navy"><Phone size={16} /> Call us</a></div></div>
      <Faq items={v.faqs} />
    </section>
  )
}

/* ---------- Insurance ---------- */
export function InsuranceLanding() {
  const { route, notify, addOrder } = useStore()
  const q = route.query
  const v = byId.insurance
  const res = useRef(null); const book = useRef(null)
  const [cover, setCover] = useState('comp')
  const [pick, setPick] = useState(null)
  useScrollOnQuery(res, [route.query])
  const value = Number(q.value) || 0
  const age = q.year ? new Date().getFullYear() - Number(q.year) : 0
  const quotes = useMemo(() => {
    if (!value) return []
    return INSURERS.map((i) => {
      const base = cover === 'comp' ? Math.max(1300, value * i.rate * (1 + Math.max(0, age - 3) * 0.04)) : i.tpl
      const premium = Math.round(base * (q.type === 'renew' ? 0.92 : 1))
      return { ...i, premium }
    }).sort((a, b) => a.premium - b.premium)
  }, [value, age, cover, q.type])
  const choose = (i) => { setPick(i); notify(`${i.name} selected — complete your details below`); setTimeout(() => book.current?.scrollIntoView({ behavior: 'smooth' }), 50) }

  return (
    <>
      <Intro v={v} stats={[['15+', 'Licensed insurers'], ['40%', 'Average saving'], ['3 min', 'To get covered']]} />
      <section className="wrap sec" ref={res}>
        <SectionHead eyebrow={value ? `${q.make} ${q.year} · ${aed(value)} · ${q.city}` : 'Compare & save'} title={value ? 'Your quotes' : 'Get quotes from top insurers'}
          action={<div className="seg mini-seg"><button className={cover === 'comp' ? 'on' : ''} onClick={() => setCover('comp')}>Comprehensive</button><button className={cover === 'tpl' ? 'on' : ''} onClick={() => setCover('tpl')}>Third party</button></div>} />
        {value ? (
          <div className="qlist">
            {quotes.map((i, n) => (
              <article key={i.id} className={`qrow ${pick?.id === i.id ? 'on' : ''}`}>
                <div className="qname"><span className="avatar">{i.name.split(' ').map((x) => x[0]).join('')}</span><div><b className="serif">{i.name}</b>{n === 0 && <span className="best">Best price</span>}<div className="rating"><Stars n={4.5 - n * 0.2} size={12} /></div></div></div>
                <ul className="qperks">{(cover === 'comp' ? i.perks : ['Third-party liability', 'Oman extension available']).map((p) => <li key={p}><Check size={14} /> {p}</li>)}</ul>
                <div className="qprice"><b className="serif">{aed(i.premium)}</b><small>per year incl. VAT · or {aed(i.premium / 4)} × 4</small></div>
                <button className="btn btn-gold" onClick={() => choose(i)}>{pick?.id === i.id ? 'Selected' : 'Buy policy'}</button>
              </article>
            ))}
            <p className="note">Indicative premiums. Your final price is confirmed by the insurer after document review.</p>
          </div>
        ) : (
          <div className="empty slim"><h3 className="serif">Enter your car details above</h3><p className="muted">Choose make, year and value in the search box to see instant quotes here.</p><button className="btn btn-navy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Start comparing</button></div>
        )}
      </section>
      <section className="wrap sec" ref={book}>
        <SectionHead eyebrow="Final step" title={pick ? `Complete your ${pick.name} policy` : 'Talk to an advisor'} />
        <BookingForm key={pick?.id || 'none'} svc={{ ...svcById.insurance, options: [cover === 'comp' ? 'Comprehensive' : 'Third party', 'Agency repair'] }}
          preset={{ car: q.make ? `${q.make} ${q.year}` : '', price: pick?.premium, label: 'Annual premium' }} title={pick ? 'Your details' : undefined} />
      </section>
      <FaqBlock v={v} />
    </>
  )
}

/* ---------- Service & repair ---------- */
export function ServiceLanding() {
  const { route } = useStore()
  const q = route.query
  const v = byId.service
  const res = useRef(null)
  const [pick, setPick] = useState(() => SERVICE_PACKAGES.find((p) => p.id === q.pkg) || null)
  useEffect(() => { const p = SERVICE_PACKAGES.find((x) => x.id === q.pkg); if (p) setPick(p) }, [q.pkg])
  useScrollOnQuery(res, [route.query])
  const car = q.make ? `${q.make} ${q.model}` : ''
  const choose = (p) => { setPick(p); setTimeout(() => res.current?.scrollIntoView({ behavior: 'smooth' }), 50) }

  return (
    <>
      <Intro v={v} stats={[['50%', 'Below dealer prices'], ['6 mo', 'Repair warranty'], ['Free', 'Pick-up & drop-off']]} />
      <section className="wrap sec">
        <SectionHead eyebrow="Fixed prices" title="Service packages" />
        <div className="pkg-grid">
          {SERVICE_PACKAGES.map((p) => (
            <article key={p.id} className={`pkg ${p.best ? 'best' : ''} ${pick?.id === p.id ? 'on' : ''}`}>
              {p.best && <span className="best">Most popular</span>}
              <Wrench size={26} />
              <h3 className="serif">{p.name}</h3>
              <div className="tprice"><b>{aed(p.price)}</b><small>{p.time} · incl. VAT</small></div>
              <ul>{p.items.map((i) => <li key={i}><Check size={14} /> {i}</li>)}</ul>
              <button className={`btn btn-block ${p.best ? 'btn-gold' : 'btn-navy'}`} onClick={() => choose(p)}>{pick?.id === p.id ? 'Selected' : 'Choose'}</button>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap sec" ref={res}>
        <SectionHead eyebrow={car ? `For your ${car}` : 'Book online'} title={pick ? `Book: ${pick.name}` : 'Book a service'} />
        <BookingForm key={pick?.id || 'none'} svc={{ ...svcById.service, options: pick ? [pick.name, ...SERVICE_PACKAGES.filter((x) => x.id !== pick.id).map((x) => x.name)] : SERVICE_PACKAGES.map((x) => x.name) }}
          preset={{ opt: pick?.name, car, price: pick?.price, label: pick?.name }} title={q.mode === 'quote' ? 'Request a repair quote' : undefined} />
      </section>
      <section className="wrap sec"><div className="values">
        <div className="value"><Star size={28} /><b>Digital inspection report</b><p>Photos and notes for every check, sent to your phone before any work starts.</p></div>
        <div className="value"><BadgeCheck size={28} /><b>Genuine parts</b><p>OEM or manufacturer-approved parts and oils that keep your warranty intact.</p></div>
        <div className="value"><ShieldCheck size={28} /><b>6-month warranty</b><p>On all parts and labour — honoured at every TireGuru workshop in the UAE.</p></div>
      </div></section>
      <FaqBlock v={v} />
    </>
  )
}
