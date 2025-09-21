import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { changePassword } from '@/services/auth';
import { getCurrentUser, logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Loading from '@/components/common/Loading';
import { CustomInputField } from '@/components/ui/customInputField';

const passwordRegex = /^\S*$/;

const schema = z
  .object({
    currentPassword: z
      .string()
      .regex(passwordRegex, 'Current password cannot contain spaces')
      .min(6, 'Current password must be at least 6 characters'),
    newPassword: z
      .string()
      .regex(passwordRegex, 'New password cannot contain spaces')
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .regex(passwordRegex, 'Confirm password cannot contain spaces')
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

type FormData = z.infer<typeof schema>;

interface PasswordSettingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PasswordSettingModal = ({ open, onOpenChange }: PasswordSettingModalProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const { errors } = form.formState;

  const [isloading, setIsLoading] = useState(false);
  const user = getCurrentUser();
  const { toast } = useToast();

  const handleSubmit = async (values: FormData) => {
    setIsLoading(true);
    try {
      await changePassword({
        userId: user?.id,
        ...values,
      });

      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully. Please log in again.',
        variant: 'success',
      });

      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description:
          err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Password Settings</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-5">
            <CustomInputField
              form={form}
              name="currentPassword"
              label="Current Password"
              placeholder="****************"
              required
            />

            <CustomInputField
              form={form}
              name="newPassword"
              label="New Password"
              placeholder="****************"
              required
            />

            <CustomInputField
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="****************"
              required
            />

            <div className="flex justify-end pt-2 space-x-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isloading}>
                {isloading ? <Loading variant="spinner" size="md" /> : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
