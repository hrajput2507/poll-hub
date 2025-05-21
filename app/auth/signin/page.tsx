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

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast({
        title: 'Signed in successfully',
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message) {
        setError('root', { message: error.message });
      } else {
        setError('root', { message: 'Invalid email or password. Please try again.' });
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
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials below to access your account
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              <FormError error={errors.password?.message} />
            </div>
            
            <FormError error={errors.root?.message} />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}