import { useEffect, useRef, useState } from 'react'
import { Star, X, Search, Car, Ruler, MapPin, LocateFixed, ShoppingBag, Check, Wrench, Crosshair, Sparkles, Truck, ShieldCheck, CreditCard, CheckCircle2, Circle, LifeBuoy, Shield, Settings, Tag, Award, BadgeCheck, Zap, Headphones, FileText, Clock, Calendar, ClipboardCheck, Heart, Eye } from 'lucide-react'
const L = { Wrench, Crosshair, Sparkles, Truck, ShieldCheck, Search, MapPin, CreditCard, CheckCircle2, Circle, LifeBuoy, Shield, Settings, Tag, Award, BadgeCheck, Zap, Headphones, Car, FileText, Clock, Calendar, ClipboardCheck }
import Tire from './Tire.jsx'
import { useStore, aed, A } from '../store.jsx'
import { sizeOf, WIDTHS, HEIGHTS, RIMS, MAKES, YEARS, EMIRATES } from '../data.js'

export const Icon = ({ name, ...p }) => { const C = L[name] || L.Circle; return <C {...p} /> }

export function Stars({ n, size = 14 }) {
  return <span className="stars" aria-label={`${n} out of 5`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} fill={i <= Math.round(n) ? 'currentColor' : 'none'} />)}</span>
}

export function SectionHead({ eyebrow, title, action, center }) {
  return (
    <div className={`shead ${center ? 'center' : ''}`}>
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>
      {action}
    </div>
  )
}

// Scroll reveal: children fade and slide up the first time they enter the viewport.
// Usage: <Reveal as="section" className="wrap sec" delay={120}>...</Reveal>
export function Reveal({ as: Comp = 'div', className = '', delay = 0, style, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    // Old browsers without IntersectionObserver simply show the content
    if (!el || !('IntersectionObserver' in window)) { setShown(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Comp ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ ...style, '--d': `${delay}ms` }} {...rest}>
      {children}
    </Comp>
  )
}

export function useEsc(fn) {
  useEffect(() => { const h = (e) => e.key === 'Escape' && fn(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [fn])
}

export function Modal({ onClose, children, wide }) {
  useEsc(onClose)
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-x" onClick={onClose} aria-label="Close"><X size={20} /></button>
        {children}
      </div>
    </div>
  )
}

export function SizeHelp({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <span className="eyebrow">Tyre size guide</span>
      <h3 className="serif">Reading your sidewall</h3>
      <div className="sidewall">
        <span><b>225</b><small>Width (mm)</small></span>/<span><b>45</b><small>Height (% of width)</small></span>
        <span><b>R18</b><small>Rim (inches)</small></span><span><b>95Y</b><small>Load & speed</small></span>
      </div>
      <p className="muted">You'll find these numbers moulded into the side of your tyre, on the driver's door frame, or in your owner's manual. Not sure? Use <b>Search by vehicle</b> and we'll match the factory size.</p>
    </Modal>
  )
}

export function TyreFinder({ compact }) {
  const { go, t } = useStore()
  const [tab, setTab] = useState('size')
  const [w, setW] = useState('225'); const [h, setH] = useState('45'); const [r, setR] = useState('18')
  const [rear, setRear] = useState(false)
  const [make, setMake] = useState(''); const [model, setModel] = useState(''); const [year, setYear] = useState('')
  const [city, setCity] = useState('Dubai')
  const [help, setHelp] = useState(false)
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (tab === 'size') return go('/tyres', { size: `${w}/${h} R${r}`, city })
    if (!make || !model || !year) return setErr('Please choose make, model and year.')
    setErr('')
    go('/tyres', { size: MAKES[make][model], car: `${make} ${model} ${year}`, city })
  }
  const locate = () => {
    if (!navigator.geolocation) return setCity('Dubai')
    navigator.geolocation.getCurrentPosition(
      (p) => { const lon = p.coords.longitude; setCity(lon < 54.9 ? 'Abu Dhabi' : lon < 55.42 ? 'Dubai' : lon < 55.6 ? 'Sharjah' : 'Ajman') },
      () => setCity('Dubai'), { timeout: 5000 })
  }

  return (
    <form className={`finder ${compact ? 'compact' : ''}`} onSubmit={submit}>
      <div className="seg" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'size'} className={tab === 'size' ? 'on' : ''} onClick={() => setTab('size')}><Ruler size={16} /> {t('bySize')}</button>
        <button type="button" role="tab" aria-selected={tab === 'car'} className={tab === 'car' ? 'on' : ''} onClick={() => setTab('car')}><Car size={16} /> {t('byVehicle')}</button>
      </div>
      {tab === 'size' ? (
        <div className="frow">
          <label><span>{t('width')}</span><select value={w} onChange={(e) => setW(e.target.value)}>{WIDTHS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label><span>{t('height')}</span><select value={h} onChange={(e) => setH(e.target.value)}>{HEIGHTS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label><span>{t('rim')}</span><select value={r} onChange={(e) => setR(e.target.value)}>{RIMS.map((x) => <option key={x} value={x}>R{x}</option>)}</select></label>
        </div>
      ) : (
        <div className="frow">
          <label><span>{t('make')}</span><select value={make} onChange={(e) => { setMake(e.target.value); setModel('') }}><option value="">Select</option>{Object.keys(MAKES).map((x) => <option key={x}>{x}</option>)}</select></label>
          <label><span>{t('model')}</span><select value={model} disabled={!make} onChange={(e) => setModel(e.target.value)}><option value="">Select</option>{make && Object.keys(MAKES[make]).map((x) => <option key={x}>{x}</option>)}</select></label>
          <label><span>{t('year')}</span><select value={year} onChange={(e) => setYear(e.target.value)}><option value="">Select</option>{YEARS.map((x) => <option key={x}>{x}</option>)}</select></label>
        </div>
      )}
      <div className="frow loc">
        <label><span><MapPin size={12} /> {t('emirate')}</span><select value={city} onChange={(e) => setCity(e.target.value)}>{EMIRATES.map((x) => <option key={x}>{x}</option>)}</select></label>
        <button type="button" className="btn btn-line" onClick={locate}><LocateFixed size={16} /> Locate me</button>
      </div>
      {tab === 'size' && <label className="tick"><input type="checkbox" checked={rear} onChange={() => setRear(!rear)} /><span><Check size={12} /></span> Different rear tyre size</label>}
      {rear && tab === 'size' && <p className="note">Add front tyres first — you can add the rear size from the results page.</p>}
      {err && <p className="err">{err}</p>}
      <button className="btn btn-gold btn-block"><Search size={18} /> {t('find')}</button>
      <button type="button" className="text-link" onClick={() => setHelp(true)}>{t('readSize')} →</button>
      {help && <SizeHelp onClose={() => setHelp(false)} />}
    </form>
  )
}

export function TyreCard({ t: ty, rank }) {
  const { add, t, saved, toggleSave } = useStore()
  const off = ty.old ? Math.round((1 - ty.price / ty.old) * 100) : 0
  const isSaved = saved.includes(ty.id)
  return (
    <article className="tcard">
      <div className="tcard-media">
        {/* Product photo — falls back to the drawn SVG tyre if a tyre has no photo yet */}
        <A to={`/tyre/${ty.id}`} className="tcard-img" aria-label={`${ty.brand} ${ty.name}`}>
          {ty.img
            ? <img src={ty.img} alt={`${ty.brand} ${ty.name} ${sizeOf(ty)}`} loading="lazy" width="640" height="480" />
            : <Tire tread={ty.tread} size={150} />}
        </A>
        <div className="tcard-badges">
          {rank && <span className="badge-rank">#{rank} best seller</span>}
          {off > 0 && <span className="tag">−{off}%</span>}
        </div>
        {/* Hover tools: save to wishlist, quick view */}
        <div className="tcard-tools">
          <button type="button" className={isSaved ? 'on' : ''} onClick={() => toggleSave(ty)} aria-pressed={isSaved} aria-label={isSaved ? 'Remove from saved' : 'Save for later'}>
            <Heart size={17} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <A to={`/tyre/${ty.id}`} aria-label="View details"><Eye size={17} /></A>
        </div>
      </div>
      <div className="tcard-body">
        <span className="brand-sm">{ty.brand}</span>
        <A to={`/tyre/${ty.id}`}><h3>{ty.name}</h3></A>
        <div className="chips"><span>{sizeOf(ty)}</span><span>{ty.load}{ty.speed}</span><span>{ty.season}</span></div>
        <div className="rating"><Stars n={ty.rating} size={13} /> <small>{ty.rating} ({ty.reviews})</small></div>
        <div className="tprice">
          <div><b>{aed(ty.price)}</b>{ty.old && <s>{aed(ty.old)}</s>}</div>
          <small>{t('perTyre')}</small>
        </div>
        <button className="btn btn-navy btn-block" onClick={() => add(ty, 4)}><ShoppingBag size={16} /> Add set of 4</button>
      </div>
    </article>
  )
}

export function Empty({ title, text, children }) {
  return <div className="empty"><Tire size={110} /><h3 className="serif">{title}</h3><p className="muted">{text}</p>{children}</div>
}
