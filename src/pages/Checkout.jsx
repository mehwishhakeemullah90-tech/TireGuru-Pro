import { useMemo, useState } from 'react'
import { Minus, Plus, Trash2, Tag, MapPin, Truck, Calendar, User, CreditCard, Check, CheckCircle2, Star, ChevronRight, Lock, Store } from 'lucide-react'
import Tire from '../components/Tire.jsx'
import { Empty } from '../components/ui.jsx'
import { useStore, aed, A } from '../store.jsx'
import { INSTALLERS, EMIRATES, SLOTS, sizeOf } from '../data.js'

const MOBILE_FEE = 49

function Summary({ extra = 0, children }) {
  const { totals } = useStore()
  return (
    <aside className="summary">
      <h3 className="serif">Order summary</h3>
      {totals.items.map((i) => <div key={i.id} className="sum-line"><span>{i.qty} × {i.brand} {i.name}</span><b>{aed(i.price * i.qty)}</b></div>)}
      <hr />
      <div className="sum-line"><span>Subtotal</span><b>{aed(totals.sub)}</b></div>
      {totals.disc > 0 && <div className="sum-line save"><span>{totals.codeLabel}</span><b>−{aed(totals.disc)}</b></div>}
      <div className="sum-line"><span>Fitting & balancing</span><b>Included</b></div>
      {extra > 0 && <div className="sum-line"><span>Mobile fitting</span><b>{aed(extra)}</b></div>}
      <div className="sum-line"><span>VAT (5%)</span><b>{aed(totals.vat + extra * 0.05)}</b></div>
      <div className="sum-line total"><span>Total</span><b>{aed(totals.total + extra * 1.05)}</b></div>
      <p className="tabby">or 4 interest-free payments of <b>{aed((totals.total + extra * 1.05) / 4)}</b></p>
      {children}
    </aside>
  )
}

export function Cart() {
  const { totals, setQty, code, setCode, notify, go } = useStore()
  const [input, setInput] = useState(code)
  const apply = () => {
    const c = input.trim().toUpperCase(); setCode(c)
    setTimeout(() => notify(c ? 'Promo code applied — see your summary' : 'Code removed'), 0)
  }
  if (!totals.items.length) return <div className="wrap page"><Empty title="Your cart is empty" text="Search by size or vehicle to find the right tyres."><A to="/tyres" className="btn btn-navy">Browse tyres</A></Empty></div>
  return (
    <div className="wrap page">
      <h1 className="serif">Your cart</h1>
      <div className="co-layout">
        <div>
          <div className="cart-list">
            {totals.items.map((i) => (
              <div key={i.id} className="cart-row">
                <div className="cart-img"><Tire tread={i.tread} size={80} /></div>
                <div className="cart-info"><span className="brand-sm">{i.brand}</span><A to={`/tyre/${i.id}`}><b>{i.name}</b></A><small className="muted">{sizeOf(i)} · {i.load}{i.speed} · {aed(i.price)} each</small></div>
                <div className="qty sm"><button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease"><Minus size={14} /></button><b>{i.qty}</b><button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase"><Plus size={14} /></button></div>
                <b className="cart-p">{aed(i.price * i.qty)}</b>
                <button className="icon-btn" onClick={() => setQty(i.id, 0)} aria-label="Remove"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <div className="promo-box">
            <Tag size={18} />
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Promo code — try GURU100, BS200, GY15 or MICH4" aria-label="Promo code" />
            <button className="btn btn-line btn-sm" onClick={apply}>Apply</button>
          </div>
          {code && !totals.codeValid && <p className="err">“{code}” doesn't apply to the tyres in your cart.</p>}
        </div>
        <Summary><button className="btn btn-gold btn-block" onClick={() => go('/checkout')}>Choose fitting & checkout</button><p className="secure"><Lock size={13} /> Secure checkout</p></Summary>
      </div>
    </div>
  )
}

export function Checkout() {
  const { totals, placeOrder, go } = useStore()
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState('centre')
  const [city, setCity] = useState('Dubai')
  const [inst, setInst] = useState('')
  const [address, setAddress] = useState('')
  const [day, setDay] = useState(0)
  const [slot, setSlot] = useState('')
  const [info, setInfo] = useState({ name: '', phone: '', email: '', plate: '' })
  const [pay, setPay] = useState('card')
  const [agree, setAgree] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(null)

  const days = useMemo(() => Array.from({ length: 10 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d }), [])
  const centres = INSTALLERS.filter((i) => i.city === city)
  const extra = mode === 'mobile' ? MOBILE_FEE : 0

  if (done) {
    return (
      <div className="wrap page">
        <div className="confirm">
          <CheckCircle2 size={64} />
          <h1 className="serif">Order confirmed</h1>
          <p>Thank you, {done.name.split(' ')[0]}. Your reference is <b>{done.ref}</b>.</p>
          <div className="confirm-box">
            <div><span>Fitting</span><b>{done.where}</b></div>
            <div><span>When</span><b>{done.when}</b></div>
            <div><span>Payment</span><b>{done.payLabel}</b></div>
            <div><span>Total</span><b>{aed(done.total)}</b></div>
          </div>
          <p className="muted">A confirmation has been sent to {done.email}. We'll WhatsApp you a reminder the day before.</p>
          <div className="row"><A to="/account" className="btn btn-navy">View my orders</A><A to="/" className="btn btn-line">Back to home</A></div>
        </div>
      </div>
    )
  }
  if (!totals.items.length) return <div className="wrap page"><Empty title="Nothing to check out" text="Add tyres to your cart first."><A to="/tyres" className="btn btn-navy">Browse tyres</A></Empty></div>

  const next = () => {
    setErr('')
    if (step === 1) {
      if (mode === 'centre' && !inst) return setErr('Please choose a fitting centre.')
      if (mode === 'mobile' && address.trim().length < 6) return setErr('Please enter the address for mobile fitting.')
      if (!slot) return setErr('Please choose a date and time slot.')
    }
    if (step === 2) {
      if (info.name.trim().length < 2) return setErr('Please enter your full name.')
      if (!/^(\+?971|0)?5\d{8}$/.test(info.phone.replace(/[\s-]/g, ''))) return setErr('Enter a valid UAE mobile number, e.g. 050 123 4567.')
      if (!/^\S+@\S+\.\S+$/.test(info.email)) return setErr('Please enter a valid email address.')
    }
    if (step === 3) {
      if (!agree) return setErr('Please accept the terms to place your order.')
      const where = mode === 'centre' ? INSTALLERS.find((i) => i.id === inst).name : `Mobile fitting · ${address}`
      const payLabel = { card: 'Card (paid online)', apple: 'Apple Pay', tabby: 'Tabby — 4 payments', cash: 'Pay at fitting' }[pay]
      const total = totals.total + extra * 1.05
      const order = placeOrder({ ...info, where, when: `${days[day].toDateString()} · ${slot}`, payLabel, mode, total })
      setDone({ ...order, where, when: `${days[day].toDateString()} · ${slot}`, payLabel, total })
      return window.scrollTo({ top: 0 })
    }
    setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const steps = [[MapPin, 'Fitting'], [User, 'Details'], [CreditCard, 'Payment']]
  return (
    <div className="wrap page">
      <nav className="crumbs"><A to="/cart">Cart</A><ChevronRight size={14} /><span>Checkout</span></nav>
      <ol className="progress">{steps.map(([I, l], i) => <li key={l} className={step > i + 1 ? 'done' : step === i + 1 ? 'now' : ''}><span>{step > i + 1 ? <Check size={16} /> : <I size={16} />}</span>{l}</li>)}</ol>
      <div className="co-layout">
        <div className="co-main">
          {step === 1 && (
            <>
              <h2 className="serif h3">Where should we fit your tyres?</h2>
              <div className="mode">
                <button className={mode === 'centre' ? 'on' : ''} onClick={() => setMode('centre')}><Store size={22} /><b>Fitting centre</b><small>Free · 350+ locations</small></button>
                <button className={mode === 'mobile' ? 'on' : ''} onClick={() => setMode('mobile')}><Truck size={22} /><b>Mobile fitting</b><small>{aed(MOBILE_FEE)} · at home or work</small></button>
              </div>
              <label className="field"><span>Emirate</span><select value={city} onChange={(e) => { setCity(e.target.value); setInst('') }}>{EMIRATES.map((e) => <option key={e}>{e}</option>)}</select></label>
              {mode === 'centre' ? (
                <div className="inst-list">
                  {centres.map((c) => (
                    <label key={c.id} className={`inst ${inst === c.id ? 'on' : ''}`}>
                      <input type="radio" name="inst" checked={inst === c.id} onChange={() => setInst(c.id)} />
                      <span className="radio-dot" />
                      <span className="inst-b"><b>{c.name}</b><small><MapPin size={12} /> {c.area}, {c.city} · {c.hours}</small></span>
                      <span className="inst-r"><Star size={13} fill="currentColor" /> {c.rating}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <label className="field"><span>Address</span><input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Building, street, area" /></label>
              )}
              <h3 className="lbl"><Calendar size={16} /> Choose a date</h3>
              <div className="days">{days.map((d, i) => <button key={i} className={day === i ? 'on' : ''} onClick={() => setDay(i)}><small>{d.toLocaleDateString('en', { weekday: 'short' })}</small><b>{d.getDate()}</b><small>{d.toLocaleDateString('en', { month: 'short' })}</small></button>)}</div>
              <h3 className="lbl">Time slot</h3>
              <div className="slots">{SLOTS.map((s) => <button key={s} className={slot === s ? 'on' : ''} onClick={() => setSlot(s)}>{s}</button>)}</div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="serif h3">Your details</h2>
              <div className="form2">
                <label className="field"><span>Full name</span><input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} autoComplete="name" /></label>
                <label className="field"><span>Mobile number</span><input value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} inputMode="tel" placeholder="05X XXX XXXX" autoComplete="tel" /></label>
                <label className="field"><span>Email</span><input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} autoComplete="email" /></label>
                <label className="field"><span>Plate number (optional)</span><input value={info.plate} onChange={(e) => setInfo({ ...info, plate: e.target.value.toUpperCase() })} placeholder="e.g. DXB A 12345" /></label>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="serif h3">Payment method</h2>
              <div className="pay">
                {[['card', 'Credit or debit card', 'Visa, Mastercard, Amex — via secure payment page'], ['apple', 'Apple Pay', 'Fast checkout on Apple devices'], ['tabby', 'Tabby', 'Split into 4 interest-free payments'], ['cash', 'Pay at fitting', 'Card or cash when your tyres are fitted']].map(([k, l, d]) => (
                  <label key={k} className={`inst ${pay === k ? 'on' : ''}`}><input type="radio" name="pay" checked={pay === k} onChange={() => setPay(k)} /><span className="radio-dot" /><span className="inst-b"><b>{l}</b><small>{d}</small></span></label>
                ))}
              </div>
              <p className="note"><Lock size={13} /> Card payments are completed on your payment provider's hosted page — connect your gateway (e.g. Stripe, Telr, Network International) before going live.</p>
              <label className="tick"><input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} /><span><Check size={12} /></span> I agree to the terms of sale and warranty policy.</label>
            </>
          )}
          {err && <p className="err">{err}</p>}
          <div className="co-nav">
            {step > 1 ? <button className="btn btn-line" onClick={() => { setErr(''); setStep(step - 1) }}>Back</button> : <A to="/cart" className="btn btn-line">Back to cart</A>}
            <button className="btn btn-gold" onClick={next}>{step === 3 ? 'Place order' : 'Continue'}</button>
          </div>
        </div>
        <Summary extra={extra} />
      </div>
    </div>
  )
}
