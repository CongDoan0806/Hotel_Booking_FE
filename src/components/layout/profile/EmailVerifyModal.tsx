import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { verifyEmailChange } from '@/services/auth';
import { getCurrentUser, logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/components/common/Loading';
import { CustomInputField } from '@/components/ui/customInputField';

const schema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must be numeric'),
});

type FormData = z.infer<typeof schema>;

type EmailVerifyDialogProps = {
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
   onVerifySuccess?: () => void;
};

export const EmailVerifyModal: React.FC<EmailVerifyDialogProps> = ({
  email,
  open,
  onOpenChange,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const user = getCurrentUser();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await verifyEmailChange({
        userId: user?.id,
        newEmail: email,
        otp: parseInt(data.code, 10),
      });

      toast({
        title: 'Email updated',
        description: 'Your email has been successfully updated. Please log in again.',
        variant: 'success',
      });

      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err: any) {
      toast({
        title: 'Verification failed',
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
          <DialogTitle className="flex items-end justify-between font-bold">
            Email Settings
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              x
            </Button>
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm font-bold text-center">Check your Email</p>
        <p className="text-sm text-center">
          We’ve sent a verification code to <strong>{email}</strong>
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
            <CustomInputField
              form={form}
              name="code"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              required
            />
            <Button type="submit" className="w-full">
              {isLoading ? <Loading variant="spinner" size="md" /> : 'Verify Code'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
