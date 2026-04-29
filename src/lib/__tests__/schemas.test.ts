import { describe, it, expect } from 'vitest';
import { ContactoSchema, EstudioTextSchema, SubscribeSchema } from '../schemas/public';
import {
  LeadUpdateSchema,
  StudyUpdateSchema,
  PostCreateSchema,
  CampaignCreateSchema,
} from '../schemas/admin';

describe('ContactoSchema', () => {
  it('acepta datos válidos', () => {
    const result = ContactoSchema.safeParse({
      name: 'Juan García',
      email: 'juan@example.com',
      message: 'Hola, me interesa vuestra oferta.',
    });
    expect(result.success).toBe(true);
  });

  it('aplica defaults a campos opcionales', () => {
    const result = ContactoSchema.safeParse({
      name: 'Ana',
      email: 'ana@test.com',
      message: 'Mensaje de prueba largo suficiente.',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe('');
      expect(result.data.subject).toBe('');
    }
  });

  it('rechaza nombre demasiado corto', () => {
    const result = ContactoSchema.safeParse({
      name: 'A',
      email: 'a@test.com',
      message: 'Mensaje suficientemente largo.',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza email inválido', () => {
    const result = ContactoSchema.safeParse({
      name: 'Nombre Válido',
      email: 'no-es-email',
      message: 'Mensaje suficientemente largo.',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza mensaje demasiado corto', () => {
    const result = ContactoSchema.safeParse({
      name: 'Nombre Válido',
      email: 'valid@example.com',
      message: 'Corto',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza nombre superior a 120 caracteres', () => {
    const result = ContactoSchema.safeParse({
      name: 'A'.repeat(121),
      email: 'valid@example.com',
      message: 'Mensaje suficientemente largo.',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza mensaje superior a 5000 caracteres', () => {
    const result = ContactoSchema.safeParse({
      name: 'Nombre',
      email: 'valid@example.com',
      message: 'X'.repeat(5001),
    });
    expect(result.success).toBe(false);
  });
});

describe('EstudioTextSchema', () => {
  it('acepta datos mínimos válidos', () => {
    const result = EstudioTextSchema.safeParse({
      name: 'Pedro López',
      email: 'pedro@empresa.com',
    });
    expect(result.success).toBe(true);
  });

  it('aplica default de method=manual', () => {
    const result = EstudioTextSchema.safeParse({
      name: 'María',
      email: 'maria@test.com',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.method).toBe('manual');
    }
  });

  it('acepta method=upload', () => {
    const result = EstudioTextSchema.safeParse({
      name: 'María',
      email: 'maria@test.com',
      method: 'upload',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza method inválido', () => {
    const result = EstudioTextSchema.safeParse({
      name: 'María',
      email: 'maria@test.com',
      method: 'fax',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza email inválido', () => {
    const result = EstudioTextSchema.safeParse({
      name: 'Nombre',
      email: 'malo',
    });
    expect(result.success).toBe(false);
  });
});

describe('SubscribeSchema', () => {
  it('acepta suscripción válida con consentimiento', () => {
    const result = SubscribeSchema.safeParse({
      email: 'subs@example.com',
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it('aplica default de locale=ES', () => {
    const result = SubscribeSchema.safeParse({
      email: 'subs@example.com',
      consent: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.locale).toBe('ES');
    }
  });

  it('acepta locale=CA', () => {
    const result = SubscribeSchema.safeParse({
      email: 'subs@example.com',
      consent: true,
      locale: 'CA',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza consent=false', () => {
    const result = SubscribeSchema.safeParse({
      email: 'subs@example.com',
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it('rechaza sin consent', () => {
    const result = SubscribeSchema.safeParse({
      email: 'subs@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza email inválido', () => {
    const result = SubscribeSchema.safeParse({
      email: 'noesvalido',
      consent: true,
    });
    expect(result.success).toBe(false);
  });
});

describe('LeadUpdateSchema', () => {
  it('acepta actualización de estado', () => {
    expect(LeadUpdateSchema.safeParse({ status: 'QUALIFIED' }).success).toBe(true);
  });

  it('acepta estado y nota juntos', () => {
    expect(LeadUpdateSchema.safeParse({ status: 'CONTACTED', note: 'Llamé hoy' }).success).toBe(
      true
    );
  });

  it('acepta objeto vacío (ningún campo requerido)', () => {
    expect(LeadUpdateSchema.safeParse({}).success).toBe(true);
  });

  it('rechaza status inválido', () => {
    expect(LeadUpdateSchema.safeParse({ status: 'PENDIENTE' }).success).toBe(false);
  });

  it('rechaza nota superior a 4000 caracteres', () => {
    expect(LeadUpdateSchema.safeParse({ note: 'X'.repeat(4001) }).success).toBe(false);
  });
});

describe('StudyUpdateSchema', () => {
  it('acepta estados válidos', () => {
    for (const status of ['NEW', 'REVIEWING', 'QUOTED', 'WON', 'LOST']) {
      expect(StudyUpdateSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it('rechaza status inválido', () => {
    expect(StudyUpdateSchema.safeParse({ status: 'PENDING' }).success).toBe(false);
  });
});

describe('PostCreateSchema', () => {
  it('acepta post mínimo válido', () => {
    const result = PostCreateSchema.safeParse({
      title: 'Titulo del post',
      content: 'Contenido del artículo.',
    });
    expect(result.success).toBe(true);
  });

  it('aplica defaults: status=DRAFT, locale=ES', () => {
    const result = PostCreateSchema.safeParse({
      title: 'Titulo',
      content: 'Contenido.',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('DRAFT');
      expect(result.data.locale).toBe('ES');
    }
  });

  it('rechaza título vacío', () => {
    expect(PostCreateSchema.safeParse({ title: '', content: 'ok' }).success).toBe(false);
  });

  it('rechaza contenido vacío', () => {
    expect(PostCreateSchema.safeParse({ title: 'Titulo', content: '' }).success).toBe(false);
  });

  it('rechaza status inválido', () => {
    expect(
      PostCreateSchema.safeParse({ title: 'T', content: 'C', status: 'BORRADOR' }).success
    ).toBe(false);
  });

  it('acepta seoTitle/seoDescription opcionales', () => {
    const result = PostCreateSchema.safeParse({
      title: 'Titulo',
      content: 'Contenido.',
      seoTitle: 'SEO Title',
      seoDescription: 'Meta description.',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza seoTitle superior a 70 caracteres', () => {
    expect(
      PostCreateSchema.safeParse({ title: 'T', content: 'C', seoTitle: 'X'.repeat(71) }).success
    ).toBe(false);
  });
});

describe('CampaignCreateSchema', () => {
  it('acepta campaña mínima válida', () => {
    const result = CampaignCreateSchema.safeParse({
      name: 'Campaña Enero',
      subject: 'Novedades de enero',
    });
    expect(result.success).toBe(true);
  });

  it('aplica defaults: status=DRAFT, locale=ES, blocks=[]', () => {
    const result = CampaignCreateSchema.safeParse({
      name: 'Campaña',
      subject: 'Asunto',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('DRAFT');
      expect(result.data.locale).toBe('ES');
      expect(result.data.blocks).toEqual([]);
    }
  });

  it('rechaza nombre vacío', () => {
    expect(CampaignCreateSchema.safeParse({ name: '', subject: 'ok' }).success).toBe(false);
  });

  it('rechaza asunto vacío', () => {
    expect(CampaignCreateSchema.safeParse({ name: 'ok', subject: '' }).success).toBe(false);
  });

  it('acepta bloques con estructura correcta', () => {
    const result = CampaignCreateSchema.safeParse({
      name: 'Camp',
      subject: 'Asunto',
      blocks: [{ sortOrder: 0, type: 'text', content: '<p>Hola</p>' }],
    });
    expect(result.success).toBe(true);
  });

  it('rechaza bloque con sortOrder negativo', () => {
    const result = CampaignCreateSchema.safeParse({
      name: 'Camp',
      subject: 'Asunto',
      blocks: [{ sortOrder: -1, type: 'text', content: 'ok' }],
    });
    expect(result.success).toBe(false);
  });
});
