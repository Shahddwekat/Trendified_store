import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { CartProvider, useCart } from './CartContext.jsx';
import ShopPage from './ShopPage.jsx';
import ProductPage from './ProductPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';

function Header() {
  const { cartCount, setCartOpen } = useCart();
  return (
    <header className="fixed top-0 z-50 w-full h-16 bg-background/80 backdrop-blur-md border-b border-brown/10">
      <div className="flex h-full items-center justify-between px-5 md:px-16 max-w-7xl mx-auto">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Trendified<span className="text-brown">.</span>
        </Link>
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
  );
}

function Footer() {
  return (
    <footer className="bg-surface-high border-t border-brown/10 mt-12">
      <div className="max-w-7xl mx-auto px-5 md:px-16 py-10 text-center">
        <p className="font-display text-2xl font-bold mb-2">Trendified<span className="text-brown">.</span></p>
        <p className="text-sm text-brown/70 mb-6">Everything trendy, delivered to your door.</p>

        <div className="flex items-center justify-center gap-6 mb-8">
          <a href="https://instagram.com/trendified7" target="_blank" rel="noopener noreferrer"
            className="text-charcoal hover:text-brown transition-colors" aria-label="Instagram">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.38.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.12C21.32 1.35 20.65.93 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-10.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
            </svg>
          </a>
          <a href="https://tiktok.com/@trendified7" target="_blank" rel="noopener noreferrer"
            className="text-charcoal hover:text-brown transition-colors" aria-label="TikTok">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.3 0 .59.05.87.13V9.4a6.33 6.33 0 00-1-.05A6.34 6.34 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
            </svg>
          </a>
        </div>

        <p className="text-xs text-brown/50">
          Developed by{' '}
          <a href="https://instagram.com/shahddwekat" target="_blank" rel="noopener noreferrer"
            className="font-bold text-brown/70 hover:text-brown underline">
            @shahddwekat
          </a>
        </p>
      </div>
    </footer>
  );
}

function OptionPicker() {
  const { choosing, setChoosing, addToCart } = useCart();
  if (!choosing) return null;
  return (
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
  );
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartTotal, changeQty } = useCart();
  const navigate = useNavigate();
  if (!cartOpen) return null;

  function goCheckout() {
    setCartOpen(false);
    navigate('/checkout');
  }

  return (
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
            <button onClick={goCheckout}
              className="w-full rounded bg-brown py-3.5 text-xs font-bold tracking-[0.1em] text-white hover:bg-charcoal transition-colors">
              CHECKOUT — CASH ON DELIVERY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-charcoal font-sans">
        <Header />
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Footer />
        <OptionPicker />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}