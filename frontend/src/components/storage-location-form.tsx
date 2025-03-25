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

interface StorageLocationFormProps {
  onSuccess: () => void;
  loggedInUser: { id: string }; // Adjust the type based on your Supabase user object
}

export function StorageLocationForm({ onSuccess, loggedInUser }: StorageLocationFormProps) {
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
        .from('storage_locations')
        .insert([{ name: data.name, user_id: loggedInUser.id }]);

      if (error) throw error;
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating storage location:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Storage Location Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Storage Location'}
      </Button>
    </form>
  );
}