import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // TODO: Integrar Notion API cuando tengas Database ID + Token
  // const NOTION_TOKEN = process.env.NOTION_TOKEN;
  // const DATABASE_ID = process.env.NOTION_DATABASE_ID;

  // Por ahora devolver estructura vacía lista para integración
  const contacts = [];

  const stats = {
    total: 0,
    prospects: 0,
    engaged: 0,
    negocios: 0,
    valor_total: 0,
  };

  return NextResponse.json({ contacts, stats });
}
