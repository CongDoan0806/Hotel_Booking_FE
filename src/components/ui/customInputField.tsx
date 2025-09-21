import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getInputClass, getLabelClass } from '@/utils/formStyles';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type CustomInputFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
};

export function CustomInputField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  maxLength,
  required,
}: CustomInputFieldProps<T>) {
  const { errors } = form.formState;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={getLabelClass(!!errors[name])}>
            {label}
            {required && <span className="text-red-500 ml-1 text-xs">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              maxLength={maxLength}
              className={getInputClass(!!errors[name])}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
