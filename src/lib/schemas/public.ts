import { z } from 'zod';

export const ContactoSchema = z.object({
  name: z.string().min(2, 'El nombre es demasiado corto').max(120),
  email: z.string().email('Email no válido').max(254),
  phone: z.string().max(40).optional().default(''),
  subject: z.string().max(200).optional().default(''),
  message: z.string().min(10, 'El mensaje es demasiado corto').max(5000),
});

export const EstudioTextSchema = z.object({
  method: z.enum(['upload', 'manual']).optional().default('manual'),
  name: z.string().min(2, 'El nombre es demasiado corto').max(120),
  email: z.string().email('Email no válido').max(254),
  phone: z.string().max(40).optional().default(''),
  company: z.string().max(120).optional().default(''),
  kwConsumed: z.string().max(20).optional().default(''),
});

export const SubscribeSchema = z.object({
  email: z.string().email('Email no válido').max(254),
  consent: z.literal(true, { error: 'Debes aceptar el consentimiento' }),
  fullName: z.string().max(120).optional(),
  locale: z.enum(['ES', 'CA']).optional().default('ES'),
});

export type ContactoInput = z.infer<typeof ContactoSchema>;
export type EstudioTextInput = z.infer<typeof EstudioTextSchema>;
export type SubscribeInput = z.infer<typeof SubscribeSchema>;
