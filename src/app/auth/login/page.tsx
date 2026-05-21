'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form } from 'formik';
import { Button } from '@/components/Button';
import { FormikInput } from '@/components/FormElements';
import { FormikZustandBridge } from '@/components/FormikZustandBridge';
import { loginValidationSchema } from '@/schemas';
import { AUTH_ERROR_CODES } from '@/lib/auth-codes';
import { AuthApiError } from '@/lib/auth-api-error';
import { authService, getVerifyEmailPath } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useFormStore } from '@/stores/form-store';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { FullPageSpinner, ButtonSpinner } from '@/components/Spinner';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const { setErrors: setFormErrors, resetForm, getFieldError } = useFormStore();
  const submitError = getFieldError('submit');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const verified = searchParams.get('verified') === 'true';
  const prefilledEmail = searchParams.get('email') ?? '';

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed';
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (verified) {
      toast.success('Email verified successfully. Sign in with your password.', {
        duration: 6000,
      });
    }
  }, [verified]);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome Back
          </h2>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your StarMart account
          </p>
        </div>

        {verified && (
          <div
            className="rounded-lg p-4 text-sm border"
            style={{
              backgroundColor: 'var(--accent-light)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <p className="font-semibold">Email verified</p>
            <p className="mt-1">Your email is confirmed. Enter your password below to sign in.</p>
          </div>
        )}

        <Formik
          initialValues={{
            email: prefilledEmail,
            password: '',
          }}
          enableReinitialize
          validationSchema={loginValidationSchema}
          validateOnChange
          validateOnBlur
          onSubmit={async (values) => {
            setIsLoading(true);
            try {
              const user = await authService.login(values);
              setUser(user);
              resetForm();
              toast.success('Welcome back!');
              router.push('/');
            } catch (error) {
              if (
                error instanceof AuthApiError &&
                error.code === AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED &&
                error.email
              ) {
                toast.error('Verify your email before signing in.');
                router.push(getVerifyEmailPath(error.email, 'exists'));
                return;
              }

              const errorMessage =
                error instanceof Error ? error.message : 'Login failed';
              setFormErrors({ submit: errorMessage });
              toast.error(errorMessage);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {() => (
            <Form
              className="space-y-6 p-8 rounded-lg shadow-md border"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <FormikZustandBridge />
              {submitError && (
                <p
                  className="text-sm rounded-lg px-4 py-3 border"
                  style={{
                    color: 'var(--error)',
                    borderColor: 'var(--error)',
                    backgroundColor: 'var(--bg-primary)',
                  }}
                >
                  {submitError}
                </p>
              )}
              <FormikInput name="email" type="email" label="Email Address" placeholder="you@example.com" />
              <FormikInput name="password" type="password" label="Password" placeholder="••••••••" />

              <Button
                type="submit"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                loading={isLoading}
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                loading={isGoogleLoading}
                onClick={handleGoogleSignIn}
              >
                {isGoogleLoading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <SiGoogle className="h-5 w-5" />
                )}
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    Or
                  </span>
                </div>
              </div>

              <Link href="/auth/signup">
                <Button type="button" variant="outline" className="w-full">
                  Create New Account
                </Button>
              </Link>

              <p className="text-center text-sm">
                <Link href="/auth/verify-email" style={{ color: 'var(--accent-secondary)' }}>
                  Need to verify your email?
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<FullPageSpinner message="Loading login…" />}>
      <LoginForm />
    </Suspense>
  );
}
