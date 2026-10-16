import { useState } from 'react'
import { Info, Search, LocateFixed } from 'lucide-react'
import { useStore } from '../store.jsx'
import { VERTICALS, byId, SERVICE_PACKAGES } from '../verticals.js'
import { WIDTHS, HEIGHTS, RIMS, MAKES, YEARS, EMIRATES } from '../data.js'
import { Icon, SizeHelp } from './ui.jsx'

function Sub({ tabs, value, onChange }) {
  return <div className="sub" role="tablist">{tabs.map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={value === k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{l}</button>)}</div>
}
const Sel = ({ label, value, onChange, children, disabled }) => (
  <label className="hsel"><span className="sr">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={value ? 'filled' : ''}><option value="">{label}</option>{children}</select>
  </label>
)

function VehiclePick({ make, setMake, model, setModel, year, setYear }) {
  return (
    <div className="hgrid">
      <Sel label="Make" value={make} onChange={(v) => { setMake(v); setModel('') }}>{Object.keys(MAKES).map((m) => <option key={m}>{m}</option>)}</Sel>
      <Sel label="Model" value={model} onChange={setModel} disabled={!make}>{make && Object.keys(MAKES[make]).map((m) => <option key={m}>{m}</option>)}</Sel>
      <Sel label="Year" value={year} onChange={setYear}>{YEARS.map((y) => <option key={y}>{y}</option>)}</Sel>
    </div>
  )
}

function TyresPanel() {
  const { go } = useStore()
  const [mode, setMode] = useState('size')
  const [w, setW] = useState(''); const [h, setH] = useState(''); const [r, setR] = useState('')
  const [make, setMake] = useState(''); const [model, setModel] = useState(''); const [year, setYear] = useState('')
  const [city, setCity] = useState('Dubai')
  const [help, setHelp] = useState(false)
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (mode === 'size') { if (!w || !h || !r) return setErr('Please select width, height and rim size.'); return go('/tyres', { size: `${w}/${h} R${r}`, city }) }
    if (!make || !model || !year) return setErr('Please select make, model and year.')
    go('/tyres', { size: MAKES[make][model], car: `${make} ${model} ${year}`, city })
  }
  const locate = () => navigator.geolocation?.getCurrentPosition((p) => { const x = p.coords.longitude; setCity(x < 54.9 ? 'Abu Dhabi' : x < 55.42 ? 'Dubai' : x < 55.6 ? 'Sharjah' : 'Ajman') }, () => {}, { timeout: 5000 })
  return (
    <form onSubmit={submit} className="hform">
      <Sub tabs={[['size', 'Search by size'], ['car', 'Search by vehicle']]} value={mode} onChange={(m) => { setMode(m); setErr('') }} />
      {mode === 'size' ? (
        <div className="hgrid">
          <Sel label="Width" value={w} onChange={setW}>{WIDTHS.map((x) => <option key={x}>{x}</option>)}</Sel>
          <Sel label="Height" value={h} onChange={setH}>{HEIGHTS.map((x) => <option key={x}>{x}</option>)}</Sel>
          <Sel label="Rim size" value={r} onChange={setR}>{RIMS.map((x) => <option key={x} value={x}>R{x}</option>)}</Sel>
        </div>
      ) : <VehiclePick {...{ make, setMake, model, setModel, year, setYear }} />}
      <div className="hgrid two">
        <Sel label="Emirate" value={city} onChange={setCity}>{EMIRATES.map((x) => <option key={x}>{x}</option>)}</Sel>
        <button type="button" className="btn btn-line" onClick={locate}><LocateFixed size={16} /> Locate me</button>
      </div>
      {err && <p className="err">{err}</p>}
      <button className="btn btn-gold btn-block"><Search size={18} /> Find tyres</button>
      <button type="button" className="help-link" onClick={() => setHelp(true)}><Info size={15} /> Learn to read your tyre size here</button>
      {help && <SizeHelp onClose={() => setHelp(false)} />}
    </form>
  )
}

function InsurancePanel() {
  const { go, route } = useStore()
  const q = route.query
  const [mode, setMode] = useState(q.type || 'new')
  const [make, setMake] = useState(q.make || ''); const [year, setYear] = useState(q.year || '')
  const [value, setValue] = useState(q.value || ''); const [city, setCity] = useState(q.city || 'Dubai')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const v = Number(String(value).replace(/,/g, ''))
    if (!make || !year) return setErr('Please select make and year.')
    if (!v || v < 10000 || v > 2000000) return setErr('Enter the car value in AED (10,000 – 2,000,000).')
    go('/insurance', { type: mode, make, year, value: v, city })
  }
  return (
    <form onSubmit={submit} className="hform">
      <Sub tabs={[['new', 'New policy'], ['renew', 'Renew my policy']]} value={mode} onChange={setMode} />
      <div className="hgrid">
        <Sel label="Car make" value={make} onChange={setMake}>{Object.keys(MAKES).map((m) => <option key={m}>{m}</option>)}</Sel>
        <Sel label="Year" value={year} onChange={setYear}>{YEARS.map((y) => <option key={y}>{y}</option>)}</Sel>
        <Sel label="Emirate" value={city} onChange={setCity}>{EMIRATES.map((x) => <option key={x}>{x}</option>)}</Sel>
      </div>
      <label className="hinput"><span>AED</span><input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value.replace(/[^\d,]/g, ''))} placeholder="Estimated car value, e.g. 85,000" aria-label="Car value in AED" /></label>
      {err && <p className="err">{err}</p>}
      <button className="btn btn-gold btn-block"><Search size={18} /> Compare quotes</button>
      <p className="help-link static"><Info size={15} /> No spam — quotes appear instantly on this page</p>
    </form>
  )
}

function ServicePanel() {
  const { go, route } = useStore()
  const q = route.query
  const [mode, setMode] = useState('book')
  const [pkg, setPkg] = useState(q.pkg || '')
  const [make, setMake] = useState(q.make || ''); const [model, setModel] = useState(q.model || '')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!pkg) return setErr('Please choose a service.')
    if (!make || !model) return setErr('Please select your car make and model.')
    go('/service-repair', { pkg, make, model, mode })
  }
  return (
    <form onSubmit={submit} className="hform">
      <Sub tabs={[['book', 'Book a service'], ['quote', 'Get a repair quote']]} value={mode} onChange={setMode} />
      <div className="hgrid">
        <Sel label={mode === 'book' ? 'Service' : 'Repair type'} value={pkg} onChange={setPkg}>{SERVICE_PACKAGES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Sel>
        <Sel label="Make" value={make} onChange={(v) => { setMake(v); setModel('') }}>{Object.keys(MAKES).map((m) => <option key={m}>{m}</option>)}</Sel>
        <Sel label="Model" value={model} onChange={setModel} disabled={!make}>{make && Object.keys(MAKES[make]).map((m) => <option key={m}>{m}</option>)}</Sel>
      </div>
      {err && <p className="err">{err}</p>}
      <button className="btn btn-gold btn-block"><Search size={18} /> {mode === 'book' ? 'See price & book' : 'Request quote'}</button>
      <p className="help-link static"><Info size={15} /> Free pick-up & drop-off in Dubai and Sharjah</p>
    </form>
  )
}

const PANELS = { tyres: TyresPanel, insurance: InsurancePanel, service: ServicePanel }

export default function HeroTabs({ active }) {
  const { go } = useStore()
  const v = byId[active]
  const Panel = PANELS[active]
  return (
    <section className="ph" aria-label={v.title}>
      <div className="ph-bgs" aria-hidden="true">
        {VERTICALS.map((x) => (
          <div key={x.id} className={`ph-bg ${x.id === active ? 'on' : ''}`} style={{ backgroundColor: x.tint, backgroundImage: `url(${x.bg})`, backgroundPosition: x.bgPos }}>
            {/* Video sits over the photo; the photo shows while it loads or if it can't play */}
            {x.video && x.id === active && <video className="ph-video" src={x.video} poster={x.bg} autoPlay muted loop playsInline preload="auto" style={{ objectPosition: x.bgPos }} />}
          </div>
        ))}
        <div className="ph-shade" />
      </div>
      <div className="wrap ph-in">
        <div className="ph-card">
          <div className="ph-tabs" role="tablist">
            {VERTICALS.map((x) => (
              <button key={x.id} role="tab" aria-selected={x.id === active} className={x.id === active ? 'on' : ''} onClick={() => go(x.route)}>
                <Icon name={x.icon} size={20} /> <span>{x.tab}</span>
              </button>
            ))}
          </div>
          <div className="ph-body" key={active}>
            <div className="ph-left">
              <h1 className="serif">{v.title}</h1>
              <ul>{v.points.map(([ic, t]) => <li key={t}><span><Icon name={ic} size={20} /></span>{t}</li>)}</ul>
            </div>
            <div className="ph-right"><Panel key={active} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function StepsStrip({ active }) {
  const v = byId[active]
  return (
    <section className="strip">
      <ol className="wrap strip-in">
        {v.steps.map(([ic, t, s], i) => (
          <li key={t}><span className="strip-ic"><Icon name={ic} size={26} /></span><div><b><em>{i + 1}.</em> {t}</b><small>{s}</small></div></li>
        ))}
      </ol>
    </section>
  )
}
