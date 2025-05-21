'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollIcon as PollIcon, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (token && type === 'signup') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });

          if (error) {
            throw error;
          }

          setVerificationStatus('success');
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

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
          
          {verificationStatus === 'loading' && (
            <>
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Verifying your email</h1>
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <Alert className="border-green-200 bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle>Email verified successfully!</AlertTitle>
                <AlertDescription>
                  Your email has been verified. You will be redirected to sign in shortly.
                </AlertDescription>
              </Alert>
              <Button asChild className="mt-4">
                <Link href="/auth/signin">Sign in now</Link>
              </Button>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-5 w-5" />
                <AlertTitle>Verification failed</AlertTitle>
                <AlertDescription>
                  We couldn't verify your email address. The link may have expired or is invalid.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 mt-4">
                <Button asChild variant="outline">
                  <Link href="/auth/signup">Sign up again</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}