import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
    Users,
    Plus,
    MoreHorizontal,
    Shield,
    Mail,
    UserPlus,
    UserMinus,
    Settings,
    Calendar
} from 'lucide-react';
import { Staff } from '@/types';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data for demo
const mockStaff: Staff[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@electronics.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-03-20T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@electronics.com',
        role: 'manager',
        status: 'active',
        lastLogin: '2024-03-19T15:45:00Z',
        createdAt: '2024-01-15T00:00:00Z',
    },
    {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@electronics.com',
        role: 'staff',
        status: 'inactive',
        lastLogin: '2024-03-10T09:20:00Z',
        createdAt: '2024-02-01T00:00:00Z',
    },
];

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    role: z.enum(['admin', 'manager', 'staff'], {
        required_error: 'Please select a role.',
    }),
});

export function StaffPage() {
    const [staff] = useState<Staff[]>(mockStaff);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'staff',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        console.log(values)

        try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Staff member added successfully');
            setIsAddDialogOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add staff member');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: 'active' | 'inactive') => {
        try {
            console.log(`Changing status of staff member ${id} to ${newStatus}`);
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success(`Staff member ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    const getRoleBadgeColor = (role: Staff['role']) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'manager':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'staff':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
                    <p className="text-muted-foreground">
                        Manage staff members and their roles
                    </p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Staff Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Staff Member</DialogTitle>
                            <DialogDescription>
                                Add a new staff member to the system. They will receive an email invitation.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter staff member's name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter staff member's email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="staff">Staff</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Adding...' : 'Add Staff Member'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 font-medium text-left">Name</th>
                                <th className="px-4 py-3 font-medium text-left">Email</th>
                                <th className="px-4 py-3 font-medium text-left">Role</th>
                                <th className="px-4 py-3 font-medium text-left">Status</th>
                                <th className="px-4 py-3 font-medium text-left">Last Login</th>
                                <th className="px-4 py-3 font-medium text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member.id} className="border-b last:border-b-0">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-muted-foreground" />
                                            <span className="font-medium">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span>{member.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-muted-foreground" />
                                            <Badge variant="secondary" className={getRoleBadgeColor(member.role)}>
                                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={member.status === 'active' ? 'default' : 'secondary'}
                                            className={member.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            }
                                        >
                                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {format(new Date(member.lastLogin), 'MMM d, yyyy HH:mm')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    Send Reset Link
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {member.status === 'active' ? (
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleStatusChange(member.id, 'inactive')}
                                                    >
                                                        <UserMinus className="w-4 h-4 mr-2" />
                                                        Deactivate
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(member.id, 'active')}
                                                    >
                                                        <UserPlus className="w-4 h-4 mr-2" />
                                                        Activate
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}