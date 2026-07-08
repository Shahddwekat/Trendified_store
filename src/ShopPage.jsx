import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext.jsx';

export default function ShopPage() {
  const { products, productsLoading, productsError, handleAddClick } = useCart();
  const [category, setCategory] = useState('all');

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const shown = category === 'all' ? products : products.filter(p => p.category === category);

  return (
    <main className="pt-16 max-w-7xl mx-auto">

      {/* Hero */}
      <section className="mt-3 px-5 md:px-16">
        <div className="relative h-[380px] md:h-[500px] overflow-hidden rounded-lg bg-gradient-to-br from-peach via-surface-high to-background flex items-center">
          <div className="px-6 md:px-12 max-w-xl">
            <span className="block mb-3 text-xs font-bold tracking-[0.1em] text-brown">FANDOM &amp; TRENDS</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
              Your style, your trend ✨
            </h1>
            <p className="text-brown/90 text-lg max-w-md mb-6">
              Phone cases, beauty, keychains &amp; fandom picks — delivered to your door, cash on delivery.
            </p>
            <a href="#shop"
              className="inline-flex items-center gap-2 bg-brown text-white px-7 py-3.5 text-xs font-bold tracking-[0.1em] hover:bg-charcoal transition-all rounded">
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
      {productsLoading && <p className="px-5 py-16 text-center text-brown/60">Loading...</p>}
      {productsError && <p className="px-5 py-16 text-center text-red-700">Couldn't load products — try refreshing.</p>}
      {!productsLoading && !productsError && shown.length === 0 && (
        <p className="px-5 py-16 text-center text-brown/60">Nothing here yet.</p>
      )}

      {/* Product grid */}
      <section className="mt-8 mb-24 px-5 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {shown.map(p => (
            <div key={p.id} className="group">
              <Link to={`/product/${p.id}`}
                className="block aspect-[3/4] overflow-hidden mb-4 rounded bg-surface-high transition-transform duration-300 group-hover:-translate-y-2">
                {p.image ? (
                  <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">🛍️</div>
                )}
              </Link>
              <div className="text-center">
                <p className="mb-1 text-xs font-bold tracking-[0.1em] uppercase text-brown">{p.category}</p>
                <Link to={`/product/${p.id}`}
                  className="mb-1 block text-base text-charcoal hover:text-brown">{p.name}</Link>
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
  );
}