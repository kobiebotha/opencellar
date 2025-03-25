import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '@/src/lib/supabase';
import { StorageLocation } from '@/src/lib/types';
import { Select } from './ui/select';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  storage_location_id: z.string().min(1, 'Storage location is required'),
});

type FormData = z.infer<typeof schema>;

export function BinForm({ 
  storageLocations,
  onSuccess 
}: { 
  storageLocations: StorageLocation[];
  onSuccess: () => void;
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
      const { error } = await supabase
        .from('bins')
        .insert([data]);

      if (error) throw error;
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating bin:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="storage_location_id">Storage Location</Label>
        <select
          {...register('storage_location_id')}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Select a location</option>
          {storageLocations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        {errors.storage_location_id && (
          <p className="text-sm text-destructive">
            {errors.storage_location_id.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="name">Bin Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Bin'}
      </Button>
    </form>
  );
}