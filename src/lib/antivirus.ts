import { fileTypeFromBuffer } from 'file-type';

interface ScanResult {
  safe: boolean;
  threat?: string;
}

const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

// Patterns that indicate embedded executables regardless of extension
const EXECUTABLE_MAGIC = [
  Buffer.from('TVqQ'), // MZ header (Windows PE executable)
];

export async function scanFile(buffer: Buffer, filename: string): Promise<ScanResult> {
  const ext = filename.toLowerCase().split('.').pop();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { safe: false, threat: 'Extension no permitida' };
  }

  if (buffer.length === 0) {
    return { safe: false, threat: 'Archivo vacio' };
  }

  // Detect real MIME type from file contents (not just extension)
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
    return {
      safe: false,
      threat: detected
        ? `Tipo de archivo no permitido: ${detected.mime}`
        : 'No se pudo determinar el tipo de archivo',
    };
  }

  // Secondary check: ensure detected MIME matches declared extension
  const extMimeMap: Record<string, string[]> = {
    pdf: ['application/pdf'],
    png: ['image/png'],
    jpg: ['image/jpeg'],
    jpeg: ['image/jpeg'],
  };
  const allowedMimesForExt = extMimeMap[ext] ?? [];
  if (!allowedMimesForExt.includes(detected.mime)) {
    return { safe: false, threat: `La extensión .${ext} no coincide con el contenido real` };
  }

  // Check for embedded executable signatures
  for (const pattern of EXECUTABLE_MAGIC) {
    if (buffer.slice(0, pattern.length).equals(pattern)) {
      return { safe: false, threat: 'Posible executable embebido detectado' };
    }
  }

  return { safe: true };
}
