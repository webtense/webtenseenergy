interface ScanResult {
  safe: boolean;
  threat?: string;
}

export async function scanFile(buffer: Buffer, filename: string): Promise<ScanResult> {
  const ext = filename.toLowerCase().split('.').pop();
  const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];

  if (!ext || !allowedExtensions.includes(ext)) {
    return { safe: false, threat: 'Extension no permitida' };
  }

  if (buffer.length === 0) {
    return { safe: false, threat: 'Archivo vacio' };
  }

  const suspiciousPatterns = [
    Buffer.from('TVqQ'),
    Buffer.from('UEsDBBQ'),
    Buffer.from('PK\x03\x04'),
  ];

  for (const pattern of suspiciousPatterns) {
    if (buffer.slice(0, pattern.length).equals(pattern)) {
      return { safe: false, threat: 'Posible executable embebido' };
    }
  }

  return { safe: true };
}
