'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { UseFormReturn } from 'react-hook-form';
import { BookingFormValues } from '@/pages/user/BookingCheckout';
import { CustomInputField } from '@/components/ui/customInputField';

type Props = {
  form: UseFormReturn<BookingFormValues>;
};

export default function BankCard({ form }: Props) {
  return (
    <Card className="p-0 mt-4 border-none shadow-none">
      <CardHeader className="p-4 pt-0 text-lg font-semibold">Bank Card Information</CardHeader>
      <CardContent className="flex flex-col gap-4 pl-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3">
          <CustomInputField
            form={form}
            name="cardName"
            label="Full Name on Card"
            placeholder="Full Name"
            required
          />
          <CustomInputField
            form={form}
            name="cardNumber"
            label="Card Number"
            placeholder="*******************"
            maxLength={16}
            required
          />
          <CustomInputField
            form={form}
            name="expiryDate"
            label="Expiry Date"
            placeholder="MM/YY"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
