import { useMemo, useState } from 'react'
import { ChevronRight, MapPin, Star, Clock, Phone, Mail, Navigation, CheckCircle2, Search, Package, MessageSquare } from 'lucide-react'
import { OfferCard, Faq } from './Home.jsx'
import { Icon, Empty, SectionHead } from '../components/ui.jsx'
import { useStore, aed, A } from '../store.jsx'
import { OFFERS, SERVICES, INSTALLERS, EMIRATES, SLOTS, FAQS } from '../data.js'

const Crumbs = ({ items }) => (
  <nav className="crumbs"><A to="/">Home</A>{items.map(([l, to]) => <span key={l} className="crumb">{<ChevronRight size={14} />}{to ? <A to={to}>{l}</A> : <span>{l}</span>}</span>)}</nav>
)
const PHONE = /^(\+?971|0)?5\d{8}$/

export function Offers() {
  return (
    <div className="wrap page">
      <Crumbs items={[['Special offers']]} />
      <div className="page-h"><div><h1 className="serif">Special offers</h1><p className="muted">Tap a code to copy it, then apply it in your cart.</p></div></div>
      <div className="offer-grid">{OFFERS.map((o) => <OfferCard key={o.id} o={o} />)}</div>
    </div>
  )
}

export function Services() {
  const { route } = useStore()
  const id = route.path.split('/')[2]
  const svc = SERVICES.find((s) => s.id === id)
  if (!id) {
    return (
      <div className="wrap page">
        <Crumbs items={[['Services']]} />
        <h1 className="serif">Car services</h1>
        <div className="svc-grid">{SERVICES.map((s) => <A key={s.id} to={`/services/${s.id}`} className="svc-card"><span className="svc-ic"><Icon name={s.icon} size={24} /></span><b>{s.name}</b><p>{s.blurb}</p><small>{s.from ? `From AED ${s.from}` : 'Free quotes'} →</small></A>)}</div>
      </div>
    )
  }
  if (!svc) return <NotFound />
  return <ServiceBooking svc={svc} key={svc.id} />
}

function ServiceBooking({ svc }) {
  return (
    <div className="wrap page">
      <Crumbs items={[['Services', '/services'], [svc.name]]} />
      <div className="svc-hero">
        <span className="svc-ic lg"><Icon name={svc.icon} size={34} /></span>
        <div><h1 className="serif">{svc.name}</h1><p className="lead dark">{svc.blurb}</p>{svc.from > 0 && <p className="from">From <b>{aed(svc.from)}</b> incl. VAT</p>}</div>
      </div>
      <BookingForm svc={svc} />
    </div>
  )
}

// Reusable booking / quote form. `preset` pre-fills option, car and a price; `title` overrides the heading.
export function BookingForm({ svc, preset = {}, title }) {
  const { addOrder, notify } = useStore()
  const [opt, setOpt] = useState(preset.opt || svc.options[0])
  const [f, setF] = useState({ name: '', phone: '', city: 'Dubai', car: preset.car || '', date: '', slot: '' })
  const [err, setErr] = useState('')
  const [done, setDone] = useState(null)
  const quote = svc.id === 'insurance'
  const min = new Date(Date.now() + 864e5).toISOString().slice(0, 10)

  const submit = (e) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setErr('Please enter your name.')
    if (!PHONE.test(f.phone.replace(/[\s-]/g, ''))) return setErr('Enter a valid UAE mobile number.')
    if (f.car.trim().length < 2) return setErr('Please tell us your car make and model.')
    if (!quote && (!f.date || !f.slot)) return setErr('Please choose a date and time.')
    setErr('')
    const ref = (quote ? 'QT' : 'SV') + Date.now().toString().slice(-6)
    addOrder({ ref, name: f.name, where: `${svc.name} · ${opt}`, when: quote ? 'Quote requested' : `${f.date} · ${f.slot}`, payLabel: 'Pay after service', items: [], total: preset.price ?? svc.from, created: new Date().toISOString() })
    setDone(ref); notify(`${quote ? 'Quote request' : 'Booking'} ${ref} received`)
  }

  return (
      <div className="co-layout">
        {done ? (
          <div className="confirm left"><CheckCircle2 size={52} /><h2 className="serif">{quote ? 'Quote request sent' : 'Booking confirmed'}</h2><p>Reference <b>{done}</b>. {quote ? 'An advisor will call you with quotes within 2 hours.' : 'We will WhatsApp you to confirm the technician.'}</p><div className="row"><A to="/account" className="btn btn-navy">My bookings</A><button className="btn btn-line" onClick={() => setDone(null)}>Book another</button></div></div>
        ) : (
          <form className="co-main" onSubmit={submit}>
            <h2 className="serif h3">{title || (quote ? 'Get your free quotes' : 'Book in under a minute')}</h2>
            <h3 className="lbl">Select a service</h3>
            <div className="opts">{svc.options.map((o) => <button type="button" key={o} className={opt === o ? 'on' : ''} onClick={() => setOpt(o)}>{o}</button>)}</div>
            <div className="form2">
              <label className="field"><span>Full name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
              <label className="field"><span>Mobile number</span><input value={f.phone} inputMode="tel" placeholder="05X XXX XXXX" onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
              <label className="field"><span>Car make & model</span><input value={f.car} placeholder="e.g. Toyota Camry 2022" onChange={(e) => setF({ ...f, car: e.target.value })} /></label>
              <label className="field"><span>Emirate</span><select value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>{EMIRATES.map((x) => <option key={x}>{x}</option>)}</select></label>
              {!quote && <>
                <label className="field"><span>Date</span><input type="date" min={min} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
                <label className="field"><span>Time</span><select value={f.slot} onChange={(e) => setF({ ...f, slot: e.target.value })}><option value="">Select</option>{SLOTS.map((s) => <option key={s}>{s}</option>)}</select></label>
              </>}
            </div>
            {err && <p className="err">{err}</p>}
            <button className="btn btn-gold btn-block">{quote ? 'Request quotes' : 'Confirm booking'}</button>
          </form>
        )}
        <aside className="summary">
          <h3 className="serif">Why book with us</h3>
          <ul className="perks"><li><CheckCircle2 size={16} /> Certified technicians</li><li><CheckCircle2 size={16} /> Transparent, fixed pricing</li><li><CheckCircle2 size={16} /> Genuine parts with warranty</li><li><CheckCircle2 size={16} /> At a centre or at your location</li></ul>
          {preset.price > 0 && <><hr /><div className="sum-line total"><span>{preset.label || 'Price'}</span><b>{aed(preset.price)}</b></div></>}
          <hr /><a href="tel:+97148760000" className="btn btn-line btn-block"><Phone size={16} /> Call +971 4 876 0000</a>
        </aside>
      </div>
  )
}

export function Installers() {
  const [city, setCity] = useState('All')
  const [q, setQ] = useState('')
  const [svc, setSvc] = useState('All')
  const list = useMemo(() => INSTALLERS.filter((i) => (city === 'All' || i.city === city) && (svc === 'All' || i.services.includes(svc)) && `${i.name} ${i.area}`.toLowerCase().includes(q.toLowerCase())), [city, q, svc])
  return (
    <div className="wrap page">
      <Crumbs items={[['Fitting centres']]} />
      <div className="page-h"><div><h1 className="serif">Find a fitting centre</h1><p className="muted">{list.length} centres shown · 350+ partner installers across the UAE</p></div></div>
      <div className="inst-tools">
        <label className="search-in"><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search area or centre name" /></label>
        <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Emirate"><option>All</option>{EMIRATES.map((e) => <option key={e}>{e}</option>)}</select>
        <select value={svc} onChange={(e) => setSvc(e.target.value)} aria-label="Service"><option>All</option>{['Fitting', 'Alignment', 'Service', 'Car Spa'].map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {list.length ? (
        <div className="inst-grid">
          {list.map((i) => (
            <div key={i.id} className="inst-card">
              <div className="inst-top"><b>{i.name}</b><span className="inst-r"><Star size={13} fill="currentColor" /> {i.rating}</span></div>
              <p><MapPin size={14} /> {i.area}, {i.city}</p><p><Clock size={14} /> {i.hours}</p>
              <div className="chips">{i.services.map((s) => <span key={s}>{s}</span>)}</div>
              <div className="row"><a className="btn btn-line btn-sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i.area + ', ' + i.city + ', UAE')}`}><Navigation size={14} /> Directions</a><A to="/tyres" q={{ city: i.city }} className="btn btn-navy btn-sm">Shop tyres</A></div>
            </div>
          ))}
        </div>
      ) : <Empty title="No centres match" text="Try another emirate or service."><button className="btn btn-navy" onClick={() => { setCity('All'); setQ(''); setSvc('All') }}>Show all</button></Empty>}
    </div>
  )
}

export function Account() {
  const { orders } = useStore()
  const [ref, setRef] = useState('')
  const [found, setFound] = useState(undefined)
  const look = (e) => { e.preventDefault(); setFound(orders.find((o) => o.ref.toLowerCase() === ref.trim().toLowerCase()) || null) }
  return (
    <div className="wrap page">
      <Crumbs items={[['My orders']]} />
      <h1 className="serif">My orders & bookings</h1>
      <form className="promo-box narrow" onSubmit={look}><Search size={18} /><input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Track by reference, e.g. TG1234567" /><button className="btn btn-navy btn-sm">Track</button></form>
      {found === null && <p className="err">No order found with that reference on this device.</p>}
      {found && <div className="order hl"><OrderBody o={found} /></div>}
      {orders.length ? <div className="orders">{orders.map((o) => <div key={o.ref} className="order"><OrderBody o={o} /></div>)}</div>
        : <Empty title="No orders yet" text="Orders and bookings you place will appear here."><A to="/tyres" className="btn btn-navy">Start shopping</A></Empty>}
    </div>
  )
}
function OrderBody({ o }) {
  const status = Date.now() - new Date(o.created).getTime() < 36e5 ? 'Confirmed' : 'Scheduled'
  return (
    <>
      <div className="order-h"><b><Package size={16} /> {o.ref}</b><span className="status">{status}</span></div>
      <p>{o.items?.length ? o.items.map((i) => `${i.qty} × ${i.brand} ${i.name}`).join(', ') : o.where}</p>
      <small className="muted">{o.items?.length ? o.where + ' · ' : ''}{o.when} · {o.payLabel}{o.total ? ` · ${aed(o.total)}` : ''}</small>
    </>
  )
}

export function Contact() {
  const { notify } = useStore()
  const [f, setF] = useState({ name: '', email: '', topic: 'Tyres', msg: '' })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (f.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(f.email) || f.msg.trim().length < 10) return notify('Please fill in your name, a valid email and a message')
    setSent(true); notify('Message sent — we reply within 2 hours')
  }
  return (
    <div className="wrap page">
      <Crumbs items={[['Contact']]} />
      <h1 className="serif">Get in touch</h1>
      <div className="co-layout">
        {sent ? <div className="confirm left"><CheckCircle2 size={52} /><h2 className="serif">Thanks, {f.name.split(' ')[0]}</h2><p>We've received your message and will reply to {f.email} within 2 hours.</p></div> : (
          <form className="co-main" onSubmit={submit}>
            <div className="form2">
              <label className="field"><span>Name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
              <label className="field"><span>Email</span><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
            </div>
            <label className="field"><span>Topic</span><select value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>{['Tyres', 'An existing order', 'Services', 'Warranty claim', 'Become an installer'].map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="field"><span>Message</span><textarea rows="5" value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} /></label>
            <button className="btn btn-gold"><MessageSquare size={16} /> Send message</button>
          </form>
        )}
        <aside className="summary">
          <h3 className="serif">Customer care</h3>
          <ul className="perks"><li><Phone size={16} /> +971 4 876 0000</li><li><Mail size={16} /> hello@tireguru.ae</li><li><Clock size={16} /> Mon–Sat 8am–10pm, Sun 9am–8pm</li><li><MapPin size={16} /> Al Quoz Industrial 3, Dubai</li></ul>
        </aside>
      </div>
    </div>
  )
}

export function FaqPage() {
  return (
    <div className="wrap page narrow-page">
      <Crumbs items={[['FAQ']]} />
      <SectionHead eyebrow="Help centre" title="Frequently asked questions" />
      <Faq items={FAQS} />
    </div>
  )
}

export function NotFound() {
  return <div className="wrap page"><Empty title="Page not found" text="The page you're looking for has moved or doesn't exist."><A to="/" className="btn btn-navy">Go home</A></Empty></div>
}
