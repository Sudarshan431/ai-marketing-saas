import { z } from 'zod';

export const platforms = [
  'instagram',
  'linkedin',
  'email',
  'google_ads',
  'product_description',
] as const;

export const generateContentSchema = z.object({
  productName: z.string().min(2, 'Product name is required.').max(120),
  productDescription: z.string().min(2, 'Product description is required.').max(2500),
  targetAudience: z.string().min(2, 'Target audience is required.').max(250),
  platform: z.enum(platforms),
  tone: z.string().min(2, 'Tone is required.').max(80),
  goal: z.string().min(2, 'Goal is required.').max(250),
  keywordsText: z.string().optional(),
});

export type GenerateContentFormValues = z.infer<typeof generateContentSchema>;

export function splitKeywords(value?: string): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 20);
}
