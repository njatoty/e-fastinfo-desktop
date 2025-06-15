import { z } from 'zod';
import { useTranslation } from 'react-i18next';

export function useTranslatedSchema() {
  const { t } = useTranslation();

  const string = (key: string) => ({
    required: () =>
      z.string({ required_error: t(`validation.${key}.required`) }),
    min: (min: number) =>
      z.string().min(min, {
        message: t(`validation.${key}.min`, { count: min }),
      }),
    email: () =>
      z.string().email({
        message: t(`validation.${key}.email`),
      }),
    regex: (pattern: RegExp) =>
      z.string().regex(pattern, {
        message: t(`validation.${key}.invalid`),
      }),
    optionalEmail: () =>
      z
        .string()
        .email({ message: t(`validation.${key}.email`) })
        .or(z.literal('')),
  });

  const number = (key: string) => ({
    min: (min: number) =>
      z.number().min(min, {
        message: t(`validation.${key}.min`, { count: min }),
      }),
    preprocessInt: () =>
      z.preprocess((val) => parseInt(val as string, 10), z.number()),
  });

  const custom = {
    passwordMatch: () =>
      z
        .object({
          adminPassword: z.string(),
          confirmPassword: z.string(),
        })
        .superRefine((data, ctx) => {
          if (data.adminPassword !== data.confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('validation.confirmPassword.match'),
              path: ['confirmPassword'],
            });
          }
        }),
  };

  return { string, number, custom };
}
