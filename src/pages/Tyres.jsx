import { useMemo, useState } from 'react'
import { SlidersHorizontal, X, Minus, Plus, ShoppingBag, ShieldCheck, Truck, BadgeCheck, MapPin, ChevronRight } from 'lucide-react'
import Tire from '../components/Tire.jsx'
import { TyreCard, TyreFinder, Stars, Empty } from '../components/ui.jsx'
import { useStore, aed, A } from '../store.jsx'
import { TYRES, CATEGORIES, sizeOf } from '../data.js'

export default function Tyres() {
  const { route, go } = useStore()
  const q = route.query
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(1500)
  const [seasons, setSeasons] = useState([])
  const [panel, setPanel] = useState(false)
  const set = (k, v) => go('/tyres', { ...q, [k]: v })
  const brands = [...new Set(TYRES.map((t) => t.brand))]

  const { list, exact } = useMemo(() => {
    let l = TYRES.filter((t) => (!q.cat || t.cat === q.cat) && (!q.brand || t.brand === q.brand) && t.price <= maxPrice && (!seasons.length || seasons.includes(t.season)))
    let exact = true
    if (q.size) {
      const m = l.filter((t) => sizeOf(t) === q.size)
      if (m.length) l = m
      else { exact = false; const rim = Number(q.size.split('R')[1]); l = l.filter((t) => t.r === rim) }
    }
    const s = { popular: (a, b) => b.reviews - a.reviews, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating }[sort]
    return { list: [...l].sort(s), exact }
  }, [q, sort, maxPrice, seasons])

  const toggleSeason = (s) => setSeasons((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))
  const reset = () => { setSeasons([]); setMaxPrice(1500); go('/tyres') }
  const activeChips = [['size', q.size], ['cat', q.cat], ['brand', q.brand]].filter(([, v]) => v)

  return (
    <div className="wrap page">
      <nav className="crumbs"><A to="/">Home</A><ChevronRight size={14} /><span>Tyres</span></nav>
      <div className="page-h">
        <div>
          <h1 className="serif">{q.size ? `Tyres in ${q.size}` : q.cat || q.brand || 'All tyres'}</h1>
          <p className="muted">{q.car && <>Factory size for your <b>{q.car}</b> · </>}{list.length} results{q.city && <> · fitting in <b>{q.city}</b></>}</p>
        </div>
        <div className="page-tools">
          <button className="btn btn-line filt-btn" onClick={() => setPanel(true)}><SlidersHorizontal size={16} /> Filters</button>
          <label className="sort">Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="popular">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select>
          </label>
        </div>
      </div>
      {activeChips.length > 0 && <div className="active-f">{activeChips.map(([k, v]) => <button key={k} onClick={() => set(k, '')}>{v} <X size={13} /></button>)}<button className="text-link" onClick={reset}>Clear all</button></div>}
      {!exact && q.size && <p className="note">No tyres in stock for exactly {q.size} — showing other R{q.size.split('R')[1]} sizes. WhatsApp us and we'll source yours within 24 hours.</p>}

      <div className="list-layout">
        <aside className={`filters ${panel ? 'open' : ''}`}>
          <div className="filters-h"><b>Filters</b><button className="icon-btn" onClick={() => setPanel(false)} aria-label="Close filters"><X size={20} /></button></div>
          <div className="fbox"><h6>Change size</h6><TyreFinder compact /></div>
          <div className="fbox"><h6>Vehicle type</h6>{CATEGORIES.map((c) => <label key={c} className="radio"><input type="radio" name="cat" checked={q.cat === c} onChange={() => set('cat', c)} /> {c}</label>)}<label className="radio"><input type="radio" name="cat" checked={!q.cat} onChange={() => set('cat', '')} /> Any</label></div>
          <div className="fbox"><h6>Brand</h6>{brands.map((b) => <label key={b} className="radio"><input type="radio" name="brand" checked={q.brand === b} onChange={() => set('brand', b)} /> {b}</label>)}<label className="radio"><input type="radio" name="brand" checked={!q.brand} onChange={() => set('brand', '')} /> Any</label></div>
          <div className="fbox"><h6>Max price per tyre: <span className="gold">{aed(maxPrice)}</span></h6><input type="range" min="400" max="1500" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /></div>
          <div className="fbox"><h6>Season</h6>{['Summer', 'All-Season', 'All-Terrain'].map((s) => <label key={s} className="radio"><input type="checkbox" checked={seasons.includes(s)} onChange={() => toggleSeason(s)} /> {s}</label>)}</div>
          <button className="btn btn-navy btn-block show-res" onClick={() => setPanel(false)}>Show {list.length} results</button>
        </aside>
        <div>
          {list.length ? <div className="tgrid three">{list.map((t) => <TyreCard key={t.id} t={t} />)}</div> : (
            <Empty title="No tyres match those filters" text="Try widening the price range or clearing a filter."><button className="btn btn-navy" onClick={reset}>Reset filters</button></Empty>
          )}
        </div>
      </div>
    </div>
  )
}

export function TyreDetail() {
  const { route, add, go } = useStore()
  const id = Number(route.path.split('/')[2])
  const ty = TYRES.find((t) => t.id === id)
  const [qty, setQty] = useState(4)
  if (!ty) return <div className="wrap page"><Empty title="Tyre not found" text="It may have sold out."><A to="/tyres" className="btn btn-navy">Browse tyres</A></Empty></div>
  const similar = TYRES.filter((t) => t.id !== ty.id && (t.r === ty.r || t.cat === ty.cat)).slice(0, 3)
  const specs = [['Size', sizeOf(ty)], ['Load index', ty.load], ['Speed rating', ty.speed], ['Season', ty.season], ['Origin', ty.origin], ['Warranty', `${ty.warranty} years`], ['Category', ty.cat], ['Manufactured', 'Within 12 months']]
  return (
    <div className="wrap page">
      <nav className="crumbs"><A to="/">Home</A><ChevronRight size={14} /><A to="/tyres">Tyres</A><ChevronRight size={14} /><A to="/tyres" q={{ brand: ty.brand }}>{ty.brand}</A><ChevronRight size={14} /><span>{ty.name}</span></nav>
      <div className="pdp">
        <div className="pdp-img"><Tire tread={ty.tread} size={380} spin /></div>
        <div className="pdp-info">
          <span className="brand-sm">{ty.brand}</span>
          <h1 className="serif">{ty.name}</h1>
          <div className="rating"><Stars n={ty.rating} /> <span className="muted">{ty.rating} · {ty.reviews} reviews</span></div>
          <div className="pdp-price"><b>{aed(ty.price)}</b>{ty.old && <s>{aed(ty.old)}</s>}<span className="muted">per tyre · fitting, balancing & valves included</span></div>
          <div className="buy">
            <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus size={16} /></button><b>{qty}</b><button onClick={() => setQty(Math.min(8, qty + 1))} aria-label="Increase"><Plus size={16} /></button></div>
            <button className="btn btn-gold grow" onClick={() => add(ty, qty)}><ShoppingBag size={18} /> Add {qty} to cart · {aed(ty.price * qty)}</button>
          </div>
          <button className="btn btn-navy btn-block" onClick={() => { add(ty, qty); go('/checkout') }}>Buy now & choose fitting</button>
          <ul className="perks"><li><Truck size={16} /> Free delivery to your chosen installer</li><li><ShieldCheck size={16} /> {ty.warranty}-year manufacturer warranty</li><li><BadgeCheck size={16} /> 100% genuine, GCC-spec</li><li><MapPin size={16} /> Fitted at 350+ centres or at home</li></ul>
          <dl className="specs">{specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      </div>
      {similar.length > 0 && <section className="sec"><h2 className="serif h2">You may also like</h2><div className="tgrid three">{similar.map((t) => <TyreCard key={t.id} t={t} />)}</div></section>}
    </div>
  )
}
