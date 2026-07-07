import { useState, useEffect } from 'react';
import hero from './assets/hero.png';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState('all');

  // cart item: { id, name, price, image, option, qty }
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  // product awaiting an option choice: the product object or null
  const [choosing, setChoosing] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const shown = category === 'all' ? products : products.filter(p => p.category === category);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = cart.reduce((n, i) => n + i.qty * i.price, 0);

  // same product + same option = same cart line; otherwise separate lines
  function addToCart(product, option = '') {
    setCart(prev => {
      const line = prev.find(i => i.id === product.id && i.option === option);
      if (line) {
        return prev.map(i =>
          i === line ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, {
        id: product.id, name: product.name, price: product.price,
        image: product.image, option, qty: 1,
      }];
    });
    setChoosing(null);
  }

  function handleAddClick(product) {
    if (product.options.length > 0) {
      setChoosing(product);   // must pick a variant first
    } else {
      addToCart(product);
    }
  }

  function changeQty(line, delta) {
    setCart(prev => prev
      .map(i => (i === line ? { ...i, qty: i.qty + delta } : i))
      .filter(i => i.qty > 0)
    );
  }

  return (
    <div className="min-h-screen bg-background text-charcoal font-sans">

      {/* Top bar */}
      <header className="fixed top-0 z-50 w-full h-16 bg-background/80 backdrop-blur-md border-b border-brown/10">
        <div className="flex h-full items-center justify-between px-5 md:px-16 max-w-7xl mx-auto">
          <span className="font-display text-2xl font-bold tracking-tight">
            Trendified<span className="text-brown">.</span>
          </span>
          <button onClick={() => setCartOpen(true)}
            className="relative p-2 text-charcoal hover:text-brown transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-brown text-white text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="pt-16 max-w-7xl mx-auto">

        {/* Hero */}
        <section className="mt-3 px-5 md:px-16">
          <div className="relative h-[380px] md:h-[500px] overflow-hidden rounded-lg group">
            <img src={hero} alt="Trendified"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-10 left-6 md:left-12 max-w-xl">
              <span className="block mb-3 text-xs font-bold tracking-[0.1em] text-brown">FANDOM &amp; TRENDS</span>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
                Everything trendy, in one place.
              </h1>
              <p className="text-brown/90 text-lg max-w-md mb-6">
                Phone cases, beauty, keychains &amp; fandom picks — delivered to your door, cash on delivery.
              </p>
              <a href="#shop"
                className="inline-flex items-center gap-2 bg-peach text-brown px-7 py-3.5 text-xs font-bold tracking-[0.1em] hover:bg-brown hover:text-white transition-all rounded">
                SHOP NOW →
              </a>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="shop" className="mt-8 px-5 md:px-16 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 whitespace-nowrap py-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-6 py-2 rounded-full text-xs font-bold tracking-[0.1em] uppercase transition-colors border
                  ${category === c
                    ? 'bg-brown text-white border-brown'
                    : 'bg-surface-high text-brown border-brown/10 hover:bg-peach'}`}>
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* States */}
        {loading && <p className="px-5 py-16 text-center text-brown/60">Loading...</p>}
        {error && <p className="px-5 py-16 text-center text-red-700">Couldn't load products — try refreshing.</p>}
        {!loading && !error && shown.length === 0 && (
          <p className="px-5 py-16 text-center text-brown/60">Nothing here yet.</p>
        )}

        {/* Product grid */}
        <section className="mt-8 mb-24 px-5 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {shown.map(p => (
              <div key={p.id} className="group">
                <div className="aspect-[3/4] overflow-hidden mb-4 rounded bg-surface-high transition-transform duration-300 group-hover:-translate-y-2">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">🛍️</div>
                  )}
                </div>
                <div className="text-center">
                  <p className="mb-1 text-xs font-bold tracking-[0.1em] uppercase text-brown">{p.category}</p>
                  <h3 className="mb-1 text-base text-charcoal">{p.name}</h3>
                  <p className="mb-3 text-xs font-bold tracking-[0.1em] text-brown/70">₪{p.price}</p>
                  <button onClick={() => handleAddClick(p)}
                    className="w-full rounded bg-brown/10 py-2 text-xs font-bold tracking-[0.1em] text-brown hover:bg-brown hover:text-white transition-colors">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Option picker sheet */}
      {choosing && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/40"
          onClick={() => setChoosing(null)}>
          <div className="w-full max-w-md rounded-t-2xl bg-surface-low p-6 pb-8"
            onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold mb-1">{choosing.name}</h3>
            <p className="text-sm text-brown/70 mb-4">Choose an option:</p>
            <div className="flex flex-wrap gap-2">
              {choosing.options.map(opt => (
                <button key={opt} onClick={() => addToCart(choosing, opt)}
                  className="rounded-full border border-brown/20 bg-white px-5 py-2.5 text-sm text-charcoal hover:bg-brown hover:text-white transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/40"
          onClick={() => setCartOpen(false)}>
          <div className="flex w-full max-w-md flex-col rounded-t-2xl bg-surface-low max-h-[85vh]"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-brown/10">
              <h3 className="font-display text-xl font-bold">Your Cart</h3>
              <button onClick={() => setCartOpen(false)} className="text-brown text-2xl leading-none">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 && (
                <p className="py-10 text-center text-brown/60">Cart is empty — go grab something cute.</p>
              )}
              {cart.map((line, idx) => (
                <div key={idx} className="mb-4 flex items-center gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-surface-high">
                    {line.image
                      ? <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                      : <div className="flex h-full items-center justify-center text-xl">🛍️</div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{line.name}</p>
                    {line.option && <p className="text-xs text-brown/70">{line.option}</p>}
                    <p className="text-xs font-bold text-brown">₪{line.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(line, -1)}
                      className="h-7 w-7 rounded-full bg-brown/10 text-brown font-bold">−</button>
                    <span className="w-5 text-center text-sm font-bold">{line.qty}</span>
                    <button onClick={() => changeQty(line, 1)}
                      className="h-7 w-7 rounded-full bg-brown/10 text-brown font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-brown/10 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-brown/70">Total</span>
                  <span className="font-display text-xl font-bold">₪{cartTotal}</span>
                </div>
                <button
                  onClick={() => alert('Checkout is the next step 😉')}
                  className="w-full rounded bg-brown py-3.5 text-xs font-bold tracking-[0.1em] text-white hover:bg-charcoal transition-colors">
                  CHECKOUT — CASH ON DELIVERY
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;