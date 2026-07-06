import { getSheetsClient, SHEET_ID } from './_sheets.js';

export default async (req) => {
  const sheets = getSheetsClient();

  if (req.method === 'GET') {
    try {
      const r = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Products!A2:H',
      });
      const rows = r.data.values || [];
      const products = rows
        .map(([id, name, price, image, description, category, options, available]) => ({
          id, name, price: Number(price),
          image: image || '', description: description || '',
          category: (category || 'other').trim().toLowerCase(),
          options: options ? options.split(',').map(o => o.trim()).filter(Boolean) : [],
          available: available !== 'FALSE' && available !== 'false',
        }))
        .filter(p => p.id && p.name && Number.isFinite(p.price) && p.price > 0 && p.available);
      return Response.json(products);
    } catch (e) {
      console.error(e);
      return Response.json({ error: 'Failed to load products' }, { status: 500 });
    }
  }

  if (req.method === 'POST') {
    if (req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    const { name, price, image, description, category, options } = body || {};
    if (!name || !Number.isFinite(Number(price))) {
      return Response.json({ error: 'Name and numeric price are required' }, { status: 400 });
    }
    try {
      const id = 'P' + Date.now();
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Products!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[id, name, Number(price), image || '', description || '',
                    category || 'other', options || '', 'TRUE']],
        },
      });
      return Response.json({ id }, { status: 201 });
    } catch (e) {
      console.error(e);
      return Response.json({ error: 'Failed to add product' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};

export const config = { path: '/api/products' };