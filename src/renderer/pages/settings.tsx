import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Building2,
    AlertCircle,
    DollarSign,
    Monitor,
    Calendar,
    Globe
} from 'lucide-react';
import { AppSettings } from '@/types';
import { useTheme } from '@/components/theme-provider';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

const formSchema = z.object({
    companyName: z.string().min(2, {
        message: 'Company name must be at least 2 characters.',
    }),
    lowStockThreshold: z.preprocess(
        (val) => parseInt(val as string, 10),
        z.number().min(1, {
            message: 'Threshold must be at least 1.',
        })
    ),
    defaultCurrency: z.string(),
    emailNotifications: z.boolean(),
    theme: z.enum(['light', 'dark', 'system']),
    dateFormat: z.string(),
    timeZone: z.string(),
});

// Mock initial settings
const initialSettings: AppSettings = {
    companyName: 'Electronics Store',
    lowStockThreshold: 5,
    defaultCurrency: 'USD',
    emailNotifications: true,
    theme: 'system',
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'UTC',
};

export function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialSettings,
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update theme if changed
            if (values.theme !== theme) {
                setTheme(values.theme);
            }

            toast.success('Settings updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your application preferences
                </p>
            </div>

            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                                <CardDescription>
                                    Configure basic application settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-8" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                This name will be displayed throughout the application
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lowStockThreshold"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Low Stock Threshold</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <AlertCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        className="pl-8"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Products below this quantity will be marked as low stock
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="defaultCurrency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Default Currency</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                                    <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Currency used for displaying prices
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Configure notification preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="emailNotifications"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Email Notifications
                                                </FormLabel>
                                                <FormDescription>
                                                    Receive email alerts for low stock and important updates
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Display Settings</CardTitle>
                                <CardDescription>
                                    Customize how information is displayed
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="theme"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Theme</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <Monitor className="w-4 h-4 mr-2 text-muted-foreground" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="system">System</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select your preferred theme
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dateFormat"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date Format</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Choose how dates are displayed
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="timeZone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time Zone</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="UTC">UTC</SelectItem>
                                                    <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                                                    <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                                                    <SelectItem value="GMT">GMT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select your time zone
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}