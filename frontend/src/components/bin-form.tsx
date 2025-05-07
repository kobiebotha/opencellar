import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '@/src/lib/supabase';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type FormData = z.infer<typeof schema>;

export function BinForm({
  onSuccess,
  storageLocationId
}: {
  onSuccess: () => void;
  loggedInUserId: string;
  storageLocationId: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const binToInsert = {
        name: data.name,
        storage_location_id: storageLocationId
      };
      const { error } = await supabase
        .from('bins')
        .insert([binToInsert]);

      if (error) {
        console.error('Error creating bin:', error);
        throw error;
      }
      reset();
      onSuccess();
    } catch (error) {
      console.error('Failed in BinForm onSubmit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Bin Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding Bin...' : 'Add Bin'}
      </Button>
    </form>
  );
}