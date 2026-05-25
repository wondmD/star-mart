'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form } from 'formik';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/Button';
import { FormikInput } from '@/components/FormElements';
import { FormikZustandBridge } from '@/components/FormikZustandBridge';
import { AuthPageLayout } from '@/components/auth/AuthPageLayout';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { signupValidationSchema } from '@/schemas';
import { AUTH_ERROR_CODES } from '@/lib/auth-codes';
import { AuthApiError } from '@/lib/auth-api-error';
import { getSafeReturnToPath } from '@/lib/auth-url';
import { authService, getLoginPath, getVerifyEmailPath } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useFormStore } from '@/stores/form-store';

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getSafeReturnToPath(searchParams.get('returnTo') ?? undefined);
  const { setUser } = useAuthStore();
  const { setErrors: setFormErrors, resetForm, getFieldError } = useFormStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const submitError = getFieldError('submit');

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="Create Account"
      subtitle="Create your account to start shopping on StarMart."
    >
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirm_password: '',
          full_name: '',
        }}
        validationSchema={signupValidationSchema}
        validateOnChange
        validateOnBlur
        onSubmit={async (values) => {
          setIsLoading(true);
          try {
            const result = await authService.signup(values);
            resetForm();

            if (result.requiresEmailConfirmation) {
              toast.success(
                result.message ||
                  'Account created! Check your email to verify your account.',
                { duration: 6000 },
              );
              router.push(getVerifyEmailPath(result.email ?? values.email, 'created'));
              return;
            }

            setUser(result.user);
            toast.success(result.message || 'Welcome to StarMart!');
              router.push(returnTo);
          } catch (error) {
            if (
              error instanceof AuthApiError &&
              error.code === AUTH_ERROR_CODES.EMAIL_EXISTS &&
              error.email
            ) {
              resetForm();
              toast.error('This email is already registered. Please sign in instead.');
                router.push(
                  getLoginPath({
                    email: error.email,
                    returnTo: returnTo === '/' ? undefined : returnTo,
                  }),
                );
              return;
            }

            if (error instanceof AuthApiError && error.code === 'RATE_LIMITED') {
              const rateMessage = error.message;
              setFormErrors({ submit: rateMessage });
              toast.error(rateMessage, { duration: 8000 });
              return;
            }

            const errorMessage = error instanceof Error ? error.message : 'Signup failed';
            setFormErrors({ submit: errorMessage });
            toast.error(errorMessage);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {({ values }) => (
          <Form
            className="space-y-5 rounded-lg border p-8 shadow-md"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
          >
            <FormikZustandBridge />
            {submitError ? (
              <p
                className="rounded-lg border px-4 py-3 text-sm"
                style={{
                  color: 'var(--error)',
                  borderColor: 'var(--error)',
                  backgroundColor: 'var(--bg-primary)',
                }}
              >
                {submitError}
              </p>
            ) : null}

            <FormikInput name="full_name" type="text" label="Full Name" placeholder="John Doe" />
            <FormikInput name="email" type="email" label="Email Address" placeholder="you@example.com" />

            <div>
              <FormikInput name="password" type="password" label="Password" placeholder="••••••••" />
              <PasswordStrengthMeter password={values.password} />
            </div>

            <FormikInput
              name="confirm_password"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
            />

            <Button type="submit" size="lg" className="flex w-full items-center justify-center gap-2" loading={isLoading}>
              <UserPlus className="h-5 w-5" />
              Create Account
            </Button>

            <GoogleSignInButton isLoading={isGoogleLoading} onClick={handleGoogleSignIn} />

            <div className="text-center text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
              <Link
                href={getLoginPath({
                  returnTo: returnTo === '/' ? undefined : returnTo,
                })}
                className="font-semibold"
                style={{ color: 'var(--accent-secondary)' }}
              >
                Sign In
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthPageLayout>
  );
}
