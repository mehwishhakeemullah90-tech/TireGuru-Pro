import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { TYRES, CODES } from './data.js'
import { DICT } from './i18n.js'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export const aed = (n) => `AED ${Math.round(n).toLocaleString('en-US')}`

// Hash router: "#/tyres?size=225/45 R18" → { path: '/tyres', query: {size: ...} }
function parseHash() {
  const raw = decodeURIComponent(window.location.hash.slice(1) || '/')
  const [path, qs = ''] = raw.split('?')
  const query = Object.fromEntries(new URLSearchParams(qs))
  return { path: path || '/', query }
}

export function StoreProvider({ children }) {
  const [route, setRoute] = useState(parseHash)
  const [cart, setCart] = useState(() => load('tg2_cart', []))
  const [code, setCode] = useState(() => load('tg2_code', ''))
  const [lang, setLang] = useState(() => load('tg2_lang', 'en'))
  const [orders, setOrders] = useState(() => load('tg2_orders', []))
  const [saved, setSaved] = useState(() => load('tg2_saved', [])) // wishlist: array of tyre ids
  const [toast, setToast] = useState(null)

  useEffect(() => { const on = () => { setRoute(parseHash()); window.scrollTo({ top: 0 }) }; window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on) }, [])
  useEffect(() => save('tg2_cart', cart), [cart])
  useEffect(() => save('tg2_code', code), [code])
  useEffect(() => save('tg2_orders', orders), [orders])
  useEffect(() => save('tg2_saved', saved), [saved])
  useEffect(() => { save('tg2_lang', lang); document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr' }, [lang])

  const go = useCallback((path, query) => {
    const qs = query ? '?' + new URLSearchParams(Object.entries(query).filter(([, v]) => v)).toString() : ''
    window.location.hash = path + qs
  }, [])
  const notify = useCallback((msg) => { setToast(msg); clearTimeout(window.__tg2); window.__tg2 = setTimeout(() => setToast(null), 2800) }, [])
  const t = useCallback((k) => DICT[lang][k] ?? DICT.en[k] ?? k, [lang])

  const add = (tyre, qty = 4) => {
    setCart((c) => { const ex = c.find((i) => i.id === tyre.id); return ex ? c.map((i) => (i.id === tyre.id ? { ...i, qty: Math.min(8, i.qty + qty) } : i)) : [...c, { id: tyre.id, qty }] })
    notify(`${tyre.brand} ${tyre.name} × ${qty} added to cart`)
  }
  // Heart button on tyre cards: add or remove a tyre from the wishlist
  const toggleSave = (tyre) => {
    const on = saved.includes(tyre.id)
    setSaved((list) => (on ? list.filter((id) => id !== tyre.id) : [...list, tyre.id]))
    notify(on ? `${tyre.brand} ${tyre.name} removed from saved tyres` : `${tyre.brand} ${tyre.name} saved for later`)
  }
  const setQty = (id, qty) => setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty: Math.min(8, qty) } : i))))

  const totals = useMemo(() => {
    const items = cart.map((i) => ({ ...TYRES.find((x) => x.id === i.id), qty: i.qty })).filter((i) => i.name)
    const sub = items.reduce((s, i) => s + i.price * i.qty, 0)
    const c = CODES[code]
    let disc = 0
    if (c) {
      if (c.flat && (!c.brand || items.some((i) => i.brand === c.brand && i.qty >= (c.min || 1)))) disc = c.flat
      if (c.pct) disc = items.filter((i) => !c.brand || i.brand === c.brand).reduce((s, i) => s + i.price * i.qty * c.pct / 100, 0)
      if (c.free4) disc = items.filter((i) => i.brand === c.free4).reduce((s, i) => s + Math.floor(i.qty / 4) * i.price, 0)
    }
    disc = Math.min(disc, sub)
    const vat = (sub - disc) * 0.05
    return { items, count: items.reduce((s, i) => s + i.qty, 0), sub, disc, vat, total: sub - disc + vat, codeValid: !!c && disc > 0, codeLabel: c?.label }
  }, [cart, code])

  const placeOrder = (details) => {
    const ref = 'TG' + Date.now().toString().slice(-7)
    const order = { ref, ...details, items: totals.items.map(({ id, brand, name, qty, price }) => ({ id, brand, name, qty, price })), total: details.total ?? totals.total, created: new Date().toISOString() }
    setOrders((o) => [order, ...o].slice(0, 20))
    setCart([]); setCode('')
    return order
  }
  const addOrder = (o) => setOrders((list) => [o, ...list].slice(0, 20))

  const value = { route, go, cart, add, setQty, code, setCode, totals, lang, setLang, t, toast, notify, orders, placeOrder, addOrder, saved, toggleSave }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// <A to="/tyres" q={{cat:'Off Road'}}> — anchor that works with the hash router
export function A({ to, q, children, ...rest }) {
  const qs = q ? '?' + new URLSearchParams(Object.entries(q).filter(([, v]) => v)).toString() : ''
  return <a href={'#' + to + qs} {...rest}>{children}</a>
}
