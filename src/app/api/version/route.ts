import { VERSION, BUILD_DATE } from '@/lib/version';

export async function GET() {
  return Response.json({
    version: VERSION,
    buildDate: BUILD_DATE,
    timestamp: new Date().toISOString(),
  });
}
