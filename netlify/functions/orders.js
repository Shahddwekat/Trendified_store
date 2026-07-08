import { getSheetsClient, SHEET_ID } from './_sheets.js';

// Shipping zones live HERE on the server — client can't cheat these.
const SHIPPING = {
  'ضفة غربية': 20,
  'قدس': 30,
  'الداخل': 35,
};

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

  const { firstName, lastName, email, phone, address, city, zone, items } = body || {};

  if (!firstName || !phone || !address || !city || !zone ||
      !Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate the zone — reject anything not in our list.
  if (!(zone in SHIPPING)) {
    return Response.json({ error: 'Invalid shipping zone' }, { status: 400 });
  }
  const shippingCost = SHIPPING[zone];

  try {
    const sheets = getSheetsClient();

    // Read real product prices from the sheet.
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "'Products'!A2:H",
    });
    const rows = r.data.values || [];
    const catalog = {};
    for (const [id, name, price] of rows) {
      if (id) catalog[id] = { name, price: Number(price) };
    }

    // Rebuild each line from trusted data.
    const verified = [];
    let productsTotal = 0;
    for (const item of items) {
      const real = catalog[item.id];
      if (!real || !Number.isFinite(real.price)) {
        return Response.json({ error: `Unknown product: ${item.id}` }, { status: 400 });
      }
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      productsTotal += real.price * qty;
      const option = (item.option || '').toString().slice(0, 60);
      verified.push(`${qty}x ${real.name}${option ? ` [${option}]` : ''} (₪${real.price})`);
    }

    const total = productsTotal + shippingCost;

    const orderId = 'ORD-' + Date.now();
    const date = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jerusalem' });

    // Write in EXACT column order: A..M
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "'Orders'!A:M",
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          orderId,
          date,
          firstName.toString().slice(0, 60),
          (lastName || '').toString().slice(0, 60),
          (email || '').toString().slice(0, 100),
          phone.toString().slice(0, 30),
          address.toString().slice(0, 300),
          city.toString().slice(0, 60),
          zone,
          shippingCost,
          verified.join(', '),
          total,
          'NEW',
        ]],
      },
    });

    return Response.json({ orderId, total, shippingCost }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to save order' }, { status: 500 });
  }
};

export const config = { path: '/api/orders' };