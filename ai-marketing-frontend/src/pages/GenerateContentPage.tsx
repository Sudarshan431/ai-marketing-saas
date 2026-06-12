import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useGenerateContent } from '../hooks/useContent';
import {
  generateContentSchema,
  splitKeywords,
  type GenerateContentFormValues,
} from '../schemas/contentSchemas';
import type { Platform } from '../types/content';

const platformOptions = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Email Campaign', value: 'email' },
  { label: 'Google Ads', value: 'google_ads' },
  { label: 'Product Description', value: 'product_description' },
];

const toneOptions = [
  { label: 'Motivational', value: 'motivational' },
  { label: 'Professional', value: 'professional' },
  { label: 'Friendly', value: 'friendly' },
  { label: 'Bold', value: 'bold' },
  { label: 'Luxury', value: 'luxury' },
  { label: 'Playful', value: 'playful' },
];

export function GenerateContentPage() {
  const navigate = useNavigate();
  const generateMutation = useGenerateContent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateContentFormValues>({
    resolver: zodResolver(generateContentSchema),
    defaultValues: {
      productName: '',
      productDescription: '',
      targetAudience: '',
      platform: 'instagram',
      tone: 'motivational',
      goal: '',
      keywordsText: '',
    },
  });

  async function onSubmit(values: GenerateContentFormValues) {
    await generateMutation.mutateAsync({
      productName: values.productName,
      productDescription: values.productDescription,
      targetAudience: values.targetAudience,
      platform: values.platform as Platform,
      tone: values.tone,
      goal: values.goal,
      keywords: splitKeywords(values.keywordsText),
    });
    navigate('/results');
  }

  return (
    <div className="grid gap-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Generate Content
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
          Create marketing content
        </h1>
      </section>

      <form className="panel grid gap-6 p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input error={errors.productName?.message} label="Product Name" {...register('productName')} />
          <Input error={errors.targetAudience?.message} label="Target Audience" {...register('targetAudience')} />
        </div>

        <Textarea
          error={errors.productDescription?.message}
          label="Product Description"
          {...register('productDescription')}
        />

        <div className="grid gap-5 md:grid-cols-3">
          <Select error={errors.platform?.message} label="Platform" options={platformOptions} {...register('platform')} />
          <Select error={errors.tone?.message} label="Tone" options={toneOptions} {...register('tone')} />
          <Input error={errors.goal?.message} label="Goal" {...register('goal')} />
        </div>

        <Input
          error={errors.keywordsText?.message}
          label="Keywords"
          placeholder="fitness, health, students"
          {...register('keywordsText')}
        />

        <div className="flex justify-end">
          <Button icon={<Sparkles className="h-4 w-4" />} isLoading={generateMutation.isPending} type="submit">
            Generate
          </Button>
        </div>
      </form>
    </div>
  );
}
