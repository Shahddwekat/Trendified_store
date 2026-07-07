import { getSheetsClient, SHEET_ID } from './_sheets.js';

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { customerName, phone, address, items } = body || {};
  if (!customerName || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const sheets = getSheetsClient();

    // 1. Read the REAL products from the sheet — the source of truth.
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "'Products'!A2:H",
    });
    const rows = r.data.values || [];
    // map: id -> { name, price }
    const catalog = {};
    for (const [id, name, price] of rows) {
      if (id) catalog[id] = { name, price: Number(price) };
    }

    // 2. Rebuild each line from trusted data. Ignore client-sent price entirely.
    const verified = [];
    let total = 0;
    for (const item of items) {
      const real = catalog[item.id];
      if (!real || !Number.isFinite(real.price)) {
        return Response.json({ error: `Unknown product: ${item.id}` }, { status: 400 });
      }
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      total += real.price * qty;
      const option = (item.option || '').toString().slice(0, 60);
      verified.push(`${qty}x ${real.name}${option ? ` [${option}]` : ''} (₪${real.price})`);
    }

    // 3. Write the order with the SERVER's total, not the client's.
    const orderId = 'ORD-' + Date.now();
    const date = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jerusalem' });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "'Orders'!A:H",
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          orderId, date,
          customerName.toString().slice(0, 100),
          phone.toString().slice(0, 30),
          address.toString().slice(0, 300),
          verified.join(', '),
          total,
          'NEW',
        ]],
      },
    });

    return Response.json({ orderId, total }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to save order' }, { status: 500 });
  }
};

export const config = { path: '/api/orders' };