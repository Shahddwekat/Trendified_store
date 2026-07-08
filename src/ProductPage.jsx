import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const { products, productsLoading, addToCart, setCartOpen } = useCart();
  const [option, setOption] = useState('');

  const product = products.find(p => p.id === id);

  function handleAdd() {
    if (product.options.length > 0 && !option) return;
    addToCart(product, option);
    setCartOpen(true);
  }

  if (productsLoading) return <p className="pt-32 text-center text-brown/60">Loading...</p>;

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <p className="text-brown/60 mb-4">Product not found.</p>
        <Link to="/" className="text-brown font-bold underline">← Back to shop</Link>
      </div>
    );
  }

  const needsOption = product.options.length > 0;

  return (
    <main className="pt-16 max-w-4xl mx-auto px-5 md:px-16 pb-24">
      <Link to="/" className="inline-block mt-4 mb-4 text-sm text-brown hover:text-charcoal">← Back</Link>

      <div className="md:flex md:gap-10">
        <div className="md:w-1/2">
          <div className="aspect-square overflow-hidden rounded-lg bg-surface-high">
            {product.image
              ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              : <div className="flex h-full items-center justify-center text-6xl">🛍️</div>}
          </div>
        </div>

        <div className="md:w-1/2 mt-6 md:mt-0">
          <p className="mb-2 text-xs font-bold tracking-[0.1em] uppercase text-brown">{product.category}</p>
          <h1 className="font-display text-3xl font-bold mb-3">{product.name}</h1>
          <p className="font-display text-2xl font-bold text-brown mb-6">₪{product.price}</p>

          {product.description && (
            <p className="text-brown/80 leading-relaxed mb-6">{product.description}</p>
          )}

          {needsOption && (
            <div className="mb-6">
              <p className="text-xs font-bold tracking-[0.1em] text-brown mb-2">CHOOSE OPTION</p>
              <div className="flex flex-wrap gap-2">
                {product.options.map(opt => (
                  <button key={opt} onClick={() => setOption(opt)}
                    className={`rounded-full border px-5 py-2.5 text-sm transition-colors
                      ${option === opt
                        ? 'bg-brown text-white border-brown'
                        : 'bg-white text-charcoal border-brown/20 hover:border-brown'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleAdd}
            disabled={needsOption && !option}
            className="w-full md:w-auto rounded bg-brown px-10 py-3.5 text-xs font-bold tracking-[0.1em] text-white hover:bg-charcoal transition-colors disabled:opacity-50">
            {needsOption && !option ? 'SELECT AN OPTION' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </main>
  );
}