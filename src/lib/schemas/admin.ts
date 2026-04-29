import { z } from 'zod';

const LocaleEnum = z.enum(['ES', 'CA']);
const PostStatusEnum = z.enum(['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']);
const LeadStatusEnum = z.enum(['NEW', 'QUALIFIED', 'CONTACTED', 'WON', 'LOST', 'SPAM']);
const StudyStatusEnum = z.enum(['NEW', 'REVIEWING', 'QUOTED', 'WON', 'LOST']);
const CampaignStatusEnum = z.enum(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED']);
const ScheduleTypeEnum = z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONCE']);

export const PostCreateSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(300),
  content: z.string().min(1, 'El contenido es obligatorio'),
  locale: LocaleEnum.optional().default('ES'),
  slug: z.string().max(300).optional(),
  excerpt: z.string().max(500).optional(),
  status: PostStatusEnum.optional().default('DRAFT'),
  scheduledFor: z.string().datetime({ offset: true }).nullable().optional(),
  featuredImage: z.string().url().nullable().optional(),
  seoTitle: z.string().max(70).nullable().optional(),
  seoDescription: z.string().max(160).nullable().optional(),
  category: z.string().max(100).nullable().optional(),
});

export const PostUpdateSchema = PostCreateSchema.partial().extend({
  slug: z.string().max(300).optional(),
});

export const LeadUpdateSchema = z.object({
  status: LeadStatusEnum.optional(),
  note: z.string().max(4000).optional(),
});

export const StudyUpdateSchema = z.object({
  status: StudyStatusEnum.optional(),
});

const CampaignBlockSchema = z.object({
  id: z.string().optional(),
  sortOrder: z.number().int().min(0),
  type: z.string().min(1).max(50),
  content: z.string(),
});

export const CampaignCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(200),
  subject: z.string().min(1, 'El asunto es obligatorio').max(200),
  locale: LocaleEnum.optional().default('ES'),
  preheader: z.string().max(200).nullable().optional(),
  status: CampaignStatusEnum.optional().default('DRAFT'),
  scheduleType: ScheduleTypeEnum.nullable().optional(),
  scheduledFor: z.string().datetime({ offset: true }).nullable().optional(),
  blocks: z.array(CampaignBlockSchema).optional().default([]),
});

export type PostCreateInput = z.infer<typeof PostCreateSchema>;
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>;
export type LeadUpdateInput = z.infer<typeof LeadUpdateSchema>;
export type StudyUpdateInput = z.infer<typeof StudyUpdateSchema>;
export type CampaignCreateInput = z.infer<typeof CampaignCreateSchema>;
