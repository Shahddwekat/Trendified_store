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

  const { customerName, phone, address, items, total } = body || {};
  if (!customerName || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const sheets = getSheetsClient();
    const orderId = 'ORD-' + Date.now();
    const date = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jerusalem' });
    const itemsText = items
      .map(i => `${i.qty}x ${i.name}${i.option ? ` [${i.option}]` : ''} (₪${i.price})`)
      .join(', ');

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Orders!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[orderId, date, customerName, phone, address, itemsText, total, 'NEW']],
      },
    });
    return Response.json({ orderId }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to save order' }, { status: 500 });
  }
};

export const config = { path: '/api/orders' };