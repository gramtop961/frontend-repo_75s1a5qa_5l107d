import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function CategoryPill({ name, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
        active ? 'bg-black text-white border-black' : 'bg-white/70 backdrop-blur text-black hover:bg-black/90 hover:text-white border-black/10'
      }`}
    >
      {name}
    </button>
  )
}

function ProductCard({ product }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden border border-black/5">
      <div className="aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
        {product.image ? (
          <img src={product.image} alt={product.title} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-neutral-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-neutral-900 line-clamp-2">{product.title}</h3>
          <span className="text-sm font-bold text-neutral-900">${Number(product.price).toFixed(2)}</span>
        </div>
        <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{product.description || 'Premium selection'}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-500 text-sm">
            <span>★</span>
            <span>{product.rating ?? 4.5}</span>
          </div>
          <button className="px-3 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-neutral-800">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [categories, setCategories] = useState([
    { name: 'All', slug: 'all' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Home Decor', slug: 'home' },
    { name: 'Electronics', slug: 'electronics' },
  ])
  const [activeCat, setActiveCat] = useState('all')
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const title = useMemo(() => {
    if (!activeCat || activeCat === 'all') return 'The Curated Edit'
    const found = categories.find(c => c.slug === activeCat)
    return found ? found.name : 'The Curated Edit'
  }, [activeCat, categories])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (activeCat !== 'all') params.append('category', activeCat)
      const res = await fetch(`${API_BASE}/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCat])

  const onSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-black text-white grid place-items-center font-black">D</div>
            <div className="text-xl sm:text-2xl font-black tracking-tight">DOMINA</div>
          </div>

          <form onSubmit={onSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-6">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the extraordinary..."
                className="w-full rounded-full border border-black/10 bg-white/80 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-black text-white text-xs">Search</button>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <button className="px-3 py-2 rounded-lg border border-black/10 hover:border-black/30 text-sm">Sign in</button>
            <button className="px-3 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 text-sm">Cart (0)</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="uppercase tracking-widest text-xs text-neutral-500">The House of Elevated Taste</p>
              <h1 className="mt-2 text-4xl sm:text-6xl font-black tracking-tight leading-tight">DOMINA — Curated Luxury for the Discerning</h1>
              <p className="mt-4 text-neutral-600 text-lg">Discover a rarefied selection spanning fashion, beauty, home, tech and more. Each piece is handpicked for quality, design and lasting value.</p>
              <div className="mt-6 flex items-center gap-3">
                <a href="#collection" className="px-5 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800">Shop the Edit</a>
                <a href="#new" className="px-5 py-3 rounded-full border border-black/10 hover:border-black/30 text-sm font-medium">New Arrivals</a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl border border-black/5 bg-gradient-to-br from-neutral-100 to-white">
                <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1513384312027-9fa69a360337?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxIZXJvfGVufDB8MHx8fDE3NjMwMjc4MTZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Hero" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-black/5 bg-white/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-3 overflow-x-auto">
          {categories.map(cat => (
            <CategoryPill key={cat.slug} name={cat.name} active={activeCat === cat.slug} onClick={() => setActiveCat(cat.slug)} />
          ))}
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl sm:text-3xl font-black">{title}</h2>
          <button onClick={fetchProducts} className="text-sm underline underline-offset-4">Refresh</button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-neutral-500">Loading curated pieces…</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-neutral-500">No products yet. Add some via the backend or database viewer.</div>
        ) : (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black">Join the Inner Circle</h3>
            <p className="mt-2 text-white/70">Exclusive drops, private sales and insider access—straight to your inbox.</p>
          </div>
          <form onSubmit={(e)=>e.preventDefault()} className="flex gap-3">
            <input placeholder="Your email" className="flex-1 rounded-xl bg-white text-black px-4 py-3 placeholder:text-neutral-500 focus:outline-none" />
            <button className="px-5 py-3 rounded-xl bg-white text-black font-medium hover:bg-neutral-200">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-black text-white grid place-items-center font-black">D</div>
              <div className="text-xl font-black">DOMINA</div>
            </div>
            <p className="mt-3 text-sm text-neutral-600">The ultimate destination for curated luxury across fashion, beauty, home and technology.</p>
          </div>
          <div>
            <h4 className="font-semibold">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>Women</li>
              <li>Men</li>
              <li>Beauty</li>
              <li>Home</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">About</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>Our story</li>
              <li>Press</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Help</h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>Shipping</li>
              <li>Returns</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-neutral-500">© {new Date().getFullYear()} DOMINA. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

export default App
