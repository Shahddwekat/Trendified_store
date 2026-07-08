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

  const { name, phone, request } = body || {};
  if (!name || !phone || !request) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const sheets = getSheetsClient();
    const requestId = 'REQ-' + Date.now();
    const date = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jerusalem' });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "'Requests'!A:E",
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          requestId,
          date,
          name.toString().slice(0, 100),
          phone.toString().slice(0, 30),
          request.toString().slice(0, 500),
        ]],
      },
    });

    return Response.json({ requestId }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to save request' }, { status: 500 });
  }
};

export const config = { path: '/api/requests' };