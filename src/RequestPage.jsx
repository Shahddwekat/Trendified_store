import { useState } from 'react';
import { Link } from 'react-router-dom';

const WHATSAPP_NUMBER = '970599834531'; // TODO: swap for store number later

export default function RequestPage() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', request: '' });

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(false);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          request: form.request.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  function openWhatsApp() {
    const msg = `Hi Trendified! I'd like to request: ${form.request}\nName: ${form.name}\nPhone: ${form.phone}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  if (done) {
    return (
      <main className="pt-24 max-w-md mx-auto px-5 text-center">
        <div className="text-5xl mb-4">✨</div>
        <h1 className="font-display text-2xl font-bold mb-2">Request sent!</h1>
        <p className="text-sm text-brown/70 mb-6">
          We got it and we'll get back to you. Want to reach us faster? Send it on WhatsApp too — you can attach a photo there.
        </p>
        <button onClick={openWhatsApp}
          className="inline-block rounded bg-green-600 px-8 py-3 text-xs font-bold tracking-[0.1em] text-white mb-4 hover:bg-green-700 transition-colors">
          SEND ON WHATSAPP 📷
        </button>
        <div>
          <Link to="/" className="text-brown font-bold underline text-sm">← Back to shop</Link>
        </div>
      </main>
    );
  }

  const input = "w-full rounded border border-brown/20 bg-white px-4 py-3 text-charcoal outline-none focus:border-brown";

  return (
    <main className="pt-20 max-w-md mx-auto px-5 pb-24">
      <Link to="/" className="inline-block mb-4 text-sm text-brown hover:text-charcoal">← Back to shop</Link>
      <h1 className="font-display text-2xl font-bold mb-2">Request a product ✨</h1>
      <p className="text-sm text-brown/70 mb-6">
        Looking for something we don't have yet? Tell us and we'll try to make it available for you.
      </p>

      <form onSubmit={submit}>
        <input required placeholder="Your name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className={`${input} mb-3`} />

        <input required type="tel" inputMode="tel" placeholder="Phone (05XXXXXXXX)" value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className={`${input} mb-3`} />

        <textarea required rows={4} placeholder="What are you looking for? Describe it..." value={form.request}
          onChange={e => setForm({ ...form, request: e.target.value })}
          className={`${input} mb-2 resize-none`} />

        <p className="text-xs text-brown/50 mb-5">
          Have a photo? Submit this, then send it on WhatsApp too.
        </p>

        {error && (
          <p className="mb-3 text-center text-sm text-red-700">Something went wrong — please try again.</p>
        )}

        <button type="submit" disabled={sending}
          className="w-full rounded bg-brown py-3.5 text-xs font-bold tracking-[0.1em] text-white hover:bg-charcoal transition-colors disabled:opacity-50">
          {sending ? 'SENDING...' : 'SEND REQUEST'}
        </button>
      </form>
    </main>
  );
}