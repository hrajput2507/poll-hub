'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormError from '@/components/ui/form-error';
import Link from 'next/link';
import { ScrollIcon as PollIcon, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const signUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password);
      toast({
        title: 'Account created successfully',
        description: 'Please check your email for verification',
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message) {
        setError('root', { message: error.message });
      } else {
        setError('root', { message: 'An error occurred during sign up. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col space-y-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/">
            <div className="flex items-center gap-2">
              <PollIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">PollHub</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create an account
          </p>
        </div>
        
        <div className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              <FormError error={errors.email?.message} />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              <FormError error={errors.password?.message} />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              <FormError error={errors.confirmPassword?.message} />
            </div>
            
            <FormError error={errors.root?.message} />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}