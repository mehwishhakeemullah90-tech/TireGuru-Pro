import { StoreProvider, useStore } from './store.jsx'
import { Header, Footer, Toast, WhatsApp } from './components/Layout.jsx'
import HeroTabs, { StepsStrip } from './components/HeroTabs.jsx'
import Home from './pages/Home.jsx'
import Tyres, { TyreDetail } from './pages/Tyres.jsx'
import { Cart, Checkout } from './pages/Checkout.jsx'
import { Offers, Services, Installers, Account, Contact, FaqPage, NotFound } from './pages/Pages.jsx'
import { InsuranceLanding, ServiceLanding } from './pages/Landing.jsx'
import { VERTICAL_ROUTES } from './verticals.js'

const LANDINGS = { tyres: Home, insurance: InsuranceLanding, service: ServiceLanding }

function Router() {
  const { route } = useStore()
  const p = route.path
  // Tabbed hero routes: '/', '/insurance', '/service-repair'.
  // The hero stays mounted so the background photo cross-fades between tabs.
  const vertical = VERTICAL_ROUTES[p]
  if (vertical) {
    const Page = LANDINGS[vertical]
    return (<><HeroTabs active={vertical} /><StepsStrip active={vertical} /><Page key={vertical} /></>)
  }
  if (p === '/tyres') return <Tyres />
  if (p.startsWith('/tyre/')) return <TyreDetail />
  if (p === '/cart') return <Cart />
  if (p === '/checkout') return <Checkout />
  if (p === '/offers') return <Offers />
  if (p.startsWith('/services')) return <Services />
  if (p === '/installers') return <Installers />
  if (p === '/account') return <Account />
  if (p === '/contact') return <Contact />
  if (p === '/faq') return <FaqPage />
  return <NotFound />
}

export default function App() {
  return (
    <StoreProvider>
      <Header />
      <main><Router /></main>
      <Footer />
      <Toast />
      <WhatsApp />
    </StoreProvider>
  )
}
