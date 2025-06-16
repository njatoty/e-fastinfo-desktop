import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Laptop,
  User,
  Mail,
  Lock,
  Building2,
  Globe,
  Palette,
  Monitor,
  Calendar,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { currencies } from '@/lib/data';
import { Trans, useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const stepFields: Record<number, Array<keyof SetupFormValues>> = {
  1: ['language'],
  2: ['adminName', 'adminEmail', 'adminPassword', 'confirmPassword'],
  3: ['companyName', 'companyEmail', 'companyPhone'],
  4: ['theme', 'currency', 'dateFormat', 'lowStockThreshold'],
};

const setupFormSchema = z
  .object({
    // Admin Account
    adminName: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    adminEmail: z
      .string()
      .email({
        message: 'Please enter a valid email address.',
      })
      .optional(),
    adminPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string(),

    // Company Settings
    companyName: z.string().min(2, {
      message: 'Company name must be at least 2 characters.',
    }),
    companyEmail: z
      .string()
      .email({
        message: 'Please enter a valid company email.',
      })
      .optional(),
    companyPhone: z
      .string()
      .regex(/^\d{10}$/, {
        message: 'Phone number must be 10 digits',
      })
      .optional(),

    // App Settings
    language: z.string(),
    theme: z.enum(['light', 'dark', 'system']),
    currency: z.string(),
    dateFormat: z.string(),
    lowStockThreshold: z.preprocess(
      (val) => parseInt(val as string, 10),
      z.number().min(1, {
        message: 'Threshold must be at least 1.',
      })
    ),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SetupFormValues = z.infer<typeof setupFormSchema>;

export function SetupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { i18n, t } = useTranslation();

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      adminName: '',
      adminEmail: undefined,
      adminPassword: '',
      confirmPassword: '',
      companyName: '',
      companyEmail: undefined,
      companyPhone: undefined,
      language: 'fr',
      theme: 'system',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      lowStockThreshold: 5,
    },
  });

  const onSubmit = async (values: SetupFormValues) => {
    const finalFields = stepFields[currentStep];
    const isFinalValid = await form.trigger(finalFields);

    if (!isFinalValid) return;

    setIsSubmitting(true);

    try {
      // Store setup data
      localStorage.setItem('electronics-setup-complete', 'true');
      localStorage.setItem(
        'electronics-admin-user',
        JSON.stringify({
          id: '1',
          name: values.adminName,
          email: values.adminEmail,
          role: 'admin',
        })
      );
      localStorage.setItem(
        'electronics-app-settings',
        JSON.stringify({
          companyName: values.companyName,
          companyEmail: values.companyEmail,
          language: values.language,
          theme: values.theme,
          currency: values.currency,
          dateFormat: values.dateFormat,
          lowStockThreshold: values.lowStockThreshold,
        })
      );

      toast.success('Setup completed successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Setup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const currentFields = stepFields[currentStep] ?? [];
    const isValid = await form.trigger(currentFields);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: t('setup.steps.language.title'),
      description: t('setup.steps.language.description'),
      icon: Globe,
    },
    {
      title: t('setup.steps.admin.title'),
      description: t('setup.steps.admin.description'),
      icon: User,
    },
    {
      title: t('setup.steps.company.title'),
      description: t('setup.steps.company.description'),
      icon: Building2,
    },
    {
      title: t('setup.steps.preferences.title'),
      description: t('setup.steps.preferences.description'),
      icon: Monitor,
    },
  ];

  return (
    <div className="min-h-0 flex-grow flex flex-col">
      <ScrollArea className="flex-grow overflow-auto max-h-electron-content">
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary rounded-full">
                  <Laptop className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                <Trans i18nKey="setup.welcome.title" />
              </h1>
              <p className="mt-2 text-muted-foreground">
                <Trans i18nKey="setup.welcome.subtitle" />
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-stretch place-items-start">
                {steps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isActive = stepNumber === currentStep;
                  const isCompleted = stepNumber < currentStep;
                  const IconComponent = step.icon;

                  return (
                    <div key={stepNumber} className="flex flex-1 items-center">
                      <div className="flex flex-col flex-shrink-0 items-center w-[140px] aspect-square">
                        <div
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                            isActive
                              ? 'border-primary bg-primary text-primary-foreground'
                              : isCompleted
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-muted-foreground bg-background text-muted-foreground'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <IconComponent className="h-5 w-5" />
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <p
                            className={cn(
                              'text-sm font-medium text-pretty',
                              isActive
                                ? 'text-primary'
                                : isCompleted
                                ? 'text-emerald-600'
                                : 'text-muted-foreground'
                            )}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            'flex-1 h-0.5',
                            stepNumber < currentStep
                              ? 'bg-emerald-500'
                              : 'bg-muted'
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(steps[currentStep - 1].icon, {
                    className: 'h-5 w-5',
                  })}
                  {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Step 1: Choose Language */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('setup.form.preferences.language.label')}
                              </FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  i18n.changeLanguage(value);
                                  field.onChange(value);
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <Globe className="mr-2 h-4 w-4" />
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">
                                    {t(
                                      'setup.form.preferences.language.options.en'
                                    )}
                                  </SelectItem>
                                  <SelectItem value="fr">
                                    {t(
                                      'setup.form.preferences.language.options.fr'
                                    )}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                {t(
                                  'setup.form.preferences.language.description'
                                )}
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {/* Step 2: Admin Account */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="adminName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('setup.form.admin.name.label')}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-8"
                                    placeholder={t(
                                      'setup.form.admin.name.placeholder'
                                    )}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="adminEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('setup.form.admin.email.label')}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-8"
                                    type="email"
                                    placeholder={t(
                                      'setup.form.admin.email.placeholder'
                                    )}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="adminPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('setup.form.admin.password.label')}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-8"
                                    type="password"
                                    placeholder={t(
                                      'setup.form.admin.password.placeholder'
                                    )}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                {t('setup.form.admin.password.description')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('setup.form.admin.confirmPassword.label')}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-8"
                                    type="password"
                                    placeholder={t(
                                      'setup.form.admin.confirmPassword.placeholder'
                                    )}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 3: Company Info */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('setup.form.company.name.label')}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-8"
                                    placeholder={t(
                                      'setup.form.company.name.placeholder'
                                    )}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                {t('setup.form.company.name.description')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companyEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('setup.form.company.email.label')}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-8"
                                    type="email"
                                    placeholder={t(
                                      'setup.form.company.email.placeholder'
                                    )}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                {t('setup.form.company.email.description')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companyPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('setup.form.company.phone.label')}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pl-8"
                                    type="text"
                                    placeholder={t(
                                      'setup.form.company.phone.placeholder'
                                    )}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                {t('setup.form.company.phone.description')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 4: Preferences */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('setup.form.preferences.theme.label')}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <Palette className="mr-2 h-4 w-4" />
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="light">
                                      {t(
                                        'setup.form.preferences.theme.options.light'
                                      )}
                                    </SelectItem>
                                    <SelectItem value="dark">
                                      {t(
                                        'setup.form.preferences.theme.options.dark'
                                      )}
                                    </SelectItem>
                                    <SelectItem value="system">
                                      {t(
                                        'setup.form.preferences.theme.options.system'
                                      )}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('setup.form.preferences.currency.label')}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <DollarSign className="mr-2 h-4 w-4" />
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {currencies.map((currency, index) => (
                                      <SelectItem
                                        key={index}
                                        value={currency.value}
                                      >
                                        {currency.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="dateFormat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('setup.form.preferences.dateFormat.label')}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <Calendar className="mr-2 h-4 w-4" />
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="MM/DD/YYYY">
                                      {t(
                                        'setup.form.preferences.dateFormat.options.MM/DD/YYYY'
                                      )}
                                    </SelectItem>
                                    <SelectItem value="DD/MM/YYYY">
                                      {t(
                                        'setup.form.preferences.dateFormat.options.DD/MM/YYYY'
                                      )}
                                    </SelectItem>
                                    <SelectItem value="YYYY-MM-DD">
                                      {t(
                                        'setup.form.preferences.dateFormat.options.YYYY-MM-DD'
                                      )}
                                    </SelectItem>
                                    <SelectItem value="DD-MM-YYYY">
                                      {t(
                                        'setup.form.preferences.dateFormat.options.DD-MM-YYYY'
                                      )}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lowStockThreshold"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t(
                                    'setup.form.preferences.lowStockThreshold.label'
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="5"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {t(
                                    'setup.form.preferences.lowStockThreshold.description'
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <Trans i18nKey="setup.navigation.previous" />
                      </Button>

                      {currentStep < steps.length ? (
                        <Button type="button" onClick={nextStep}>
                          <Trans i18nKey="setup.navigation.next" />
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <Trans i18nKey="setup.navigation.complete.loading" />
                          ) : (
                            <Trans i18nKey="setup.navigation.complete.default" />
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
