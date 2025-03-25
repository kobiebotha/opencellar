import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '@/src/lib/supabase';
import { Bin } from '@/src/lib/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  vintage: z.number().min(1900).max(new Date().getFullYear()),
  count: z.number().min(1),
  bin_id: z.string().min(1, 'Bin is required'),
  value: z.number().min(0),
});

type FormData = z.infer<typeof schema>;

export function WineForm({ bins, onSuccess }: { bins: Bin[]; onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      count: 1,
      value: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const drinkBetween = `[${data.vintage + 2}-01-01,${
        data.vintage + 10
      }-12-31]`;

      const { error } = await supabase.from('wines').insert([
        {
          ...data,
          drink_between: drinkBetween,
        },
      ]);

      if (error) throw error;
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding wine:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Wine Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="vintage">Vintage</Label>
        <Input
          id="vintage"
          type="number"
          {...register('vintage', { valueAsNumber: true })}
        />
        {errors.vintage && (
          <p className="text-sm text-destructive">{errors.vintage.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="count">Number of Bottles</Label>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              register('count').onChange({
                target: {
                  value: Math.max(1, Number(register('count').value) - 1),
                },
              })
            }
          >
            -
          </Button>
          <Input
            id="count"
            type="number"
            {...register('count', { valueAsNumber: true })}
            className="text-center"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              register('count').onChange({
                target: { value: Number(register('count').value) + 1 },
              })
            }
          >
            +
          </Button>
        </div>
        {errors.count && (
          <p className="text-sm text-destructive">{errors.count.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="value">Value per Bottle</Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          {...register('value', { valueAsNumber: true })}
        />
        {errors.value && (
          <p className="text-sm text-destructive">{errors.value.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="bin_id">Bin</Label>
        <select
          {...register('bin_id')}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Select a bin</option>
          {bins.map((bin) => (
            <option key={bin.id} value={bin.id}>
              {bin.name}
            </option>
          ))}
        </select>
        {errors.bin_id && (
          <p className="text-sm text-destructive">{errors.bin_id.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Wine'}
      </Button>
    </form>
  );
}