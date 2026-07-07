import { google } from 'googleapis';

export function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email) throw new Error('ENV MISSING: GOOGLE_SERVICE_ACCOUNT_EMAIL');
  if (!key) throw new Error('ENV MISSING: GOOGLE_PRIVATE_KEY');
  if (!process.env.SHEET_ID) throw new Error('ENV MISSING: SHEET_ID');

  const auth = new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export const SHEET_ID = process.env.SHEET_ID;