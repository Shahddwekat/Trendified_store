import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext.jsx';

const ZONES = [
  { name: 'ضفة غربية', price: 20 },
  { name: 'قدس', price: 30 },
  { name: 'الداخل', price: 35 },
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();

  const [placing, setPlacing] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', address: '', city: '', zone: '',
  });

  const selectedZone = ZONES.find(z => z.name === form.zone);
  const shipping = selectedZone ? selectedZone.price : 0;
  const grandTotal = cartTotal + shipping;

  async function placeOrder(e) {
    e.preventDefault();
    if (placing) return;
    if (!form.zone) return; // must pick a zone
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          zone: form.zone,
          items: cart.map(i => ({ id: i.id, qty: i.qty, option: i.option })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'failed');
      setOrderResult({ orderId: data.orderId, total: data.total });
      clearCart();
    } catch {
      setOrderResult({ error: true });
    } finally {
      setPlacing(false);
    }
  }

  if (orderResult?.orderId) {
    return (
      <main className="pt-24 max-w-md mx-auto px-5 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-display text-2xl font-bold mb-2">Order placed!</h1>
        <p className="text-brown/80 mb-1">Order ID: <b>{orderResult.orderId}</b></p>
        <p className="text-brown/80 mb-1">Total: <b>₪{orderResult.total}</b></p>
        <p className="text-sm text-brown/60 mb-6">We'll call you to confirm. Pay cash on delivery.</p>
        <Link to="/" className="inline-block rounded bg-brown px-8 py-3 text-xs font-bold tracking-[0.1em] text-white">
          BACK TO SHOP
        </Link>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="pt-24 max-w-md mx-auto px-5 text-center">
        <p className="text-brown/60 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-brown font-bold underline">← Back to shop</Link>
      </main>
    );
  }

  const input = "w-full rounded border border-brown/20 bg-white px-4 py-3 text-charcoal outline-none focus:border-brown";

  return (
    <main className="pt-20 max-w-md mx-auto px-5 pb-24">
      <Link to="/" className="inline-block mb-4 text-sm text-brown hover:text-charcoal">← Back to shop</Link>
      <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={placeOrder}>

        {/* Contact */}
        <h2 className="font-display text-lg font-bold mb-3">Contact</h2>
        <input type="email" placeholder="Email (optional)" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className={`${input} mb-5`} />

        {/* Delivery */}
        <h2 className="font-display text-lg font-bold mb-3">Delivery</h2>
        <div className="flex gap-3 mb-3">
          <input required placeholder="First name" value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
            className={input} />
          <input placeholder="Last name" value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
            className={input} />
        </div>
        <input required placeholder="Address" value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          className={`${input} mb-3`} />
        <input required placeholder="City" value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
          className={`${input} mb-3`} />
        <input required type="tel" inputMode="tel" placeholder="Phone (05XXXXXXXX)" value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className={`${input} mb-5`} />

        {/* Shipping zone */}
        <h2 className="font-display text-lg font-bold mb-3">Shipping method</h2>
        <div className="mb-6 space-y-2">
          {ZONES.map(z => (
            <label key={z.name}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition-colors
                ${form.zone === z.name ? 'border-brown bg-surface-high' : 'border-brown/20 bg-white'}`}>
              <span className="flex items-center gap-3">
                <input type="radio" name="zone" value={z.name}
                  checked={form.zone === z.name}
                  onChange={e => setForm({ ...form, zone: e.target.value })}
                  className="accent-brown" />
                <span className="text-charcoal" dir="rtl">{z.name}</span>
              </span>
              <span className="font-bold text-brown">₪{z.price}</span>
            </label>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-surface-low p-4 mb-6 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-brown/70">Products</span>
            <span>₪{cartTotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-brown/70">Shipping</span>
            <span>{form.zone ? `₪${shipping}` : '—'}</span>
          </div>
          <div className="flex justify-between border-t border-brown/10 pt-2 font-bold">
            <span>Total — cash on delivery</span>
            <span className="font-display text-lg">₪{grandTotal}</span>
          </div>
        </div>

        {orderResult?.error && (
          <p className="mb-3 text-center text-sm text-red-700">Something went wrong — please try again.</p>
        )}

        <button type="submit" disabled={placing || !form.zone}
          className="w-full rounded bg-brown py-3.5 text-xs font-bold tracking-[0.1em] text-white hover:bg-charcoal transition-colors disabled:opacity-50">
          {placing ? 'PLACING ORDER...' : !form.zone ? 'SELECT SHIPPING ZONE' : 'PLACE ORDER'}
        </button>
      </form>
    </main>
  );
}