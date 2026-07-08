import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('trendified_cart'));
      if (saved && Date.now() - saved.savedAt < 24 * 60 * 60 * 1000) {
        return saved.items;
      }
    } catch {
      // ignore bad/missing data
    }
    return [];
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [choosing, setChoosing] = useState(null);

  // products fetched ONCE, shared across all pages
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setProducts)
      .catch(() => setProductsError(true))
      .finally(() => setProductsLoading(false));
  }, []);

  // save cart to localStorage on every change, with a fresh timestamp
  useEffect(() => {
    localStorage.setItem('trendified_cart', JSON.stringify({
      items: cart,
      savedAt: Date.now(),
    }));
  }, [cart]);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = cart.reduce((n, i) => n + i.qty * i.price, 0);

  function addToCart(product, option = '') {
    setCart(prev => {
      const line = prev.find(i => i.id === product.id && i.option === option);
      if (line) return prev.map(i => (i === line ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, {
        id: product.id, name: product.name, price: product.price,
        image: product.image, option, qty: 1,
      }];
    });
    setChoosing(null);
  }

  function handleAddClick(product) {
    if (product.options.length > 0) setChoosing(product);
    else addToCart(product);
  }

  function changeQty(line, delta) {
    setCart(prev => prev
      .map(i => (i === line ? { ...i, qty: i.qty + delta } : i))
      .filter(i => i.qty > 0));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem('trendified_cart');
  }

  return (
    <CartContext.Provider value={{
      products, productsLoading, productsError,
      cart, cartOpen, setCartOpen, choosing, setChoosing,
      cartCount, cartTotal, addToCart, handleAddClick, changeQty, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}