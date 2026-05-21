'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { Button } from '@/components/Button';
import { FormikInput } from '@/components/FormElements';
import { FormikZustandBridge } from '@/components/FormikZustandBridge';
import { signupValidationSchema, checkPasswordStrength } from '@/schemas';
import { AUTH_ERROR_CODES } from '@/lib/auth-codes';
import { AuthApiError } from '@/lib/auth-api-error';
import { authService, getVerifyEmailPath } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useFormStore } from '@/stores/form-store';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { ButtonSpinner } from '@/components/Spinner';

export default function SignupPage() {
  const router = useRouter();
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
      const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed';
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Account</h2>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Create your account to start shopping on StarMart.
          </p>
        </div>

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
                router.push(
                  getVerifyEmailPath(result.email ?? values.email, 'created'),
                );
                return;
              }

              setUser(result.user);
              toast.success(result.message || 'Welcome to StarMart!');
              router.push('/');
            } catch (error) {
              if (
                error instanceof AuthApiError &&
                error.code === AUTH_ERROR_CODES.EMAIL_EXISTS &&
                error.email
              ) {
                resetForm();
                toast.error('This email is already registered. Please sign in instead.');
                router.push(`/auth/login?email=${encodeURIComponent(error.email)}`);
                return;
              }

              if (
                error instanceof AuthApiError &&
                error.code === 'RATE_LIMITED'
              ) {
                const rateMessage = error.message;
                setFormErrors({ submit: rateMessage });
                toast.error(rateMessage, { duration: 8000 });
                return;
              }

              const errorMessage =
                error instanceof Error ? error.message : 'Signup failed';
              setFormErrors({ submit: errorMessage });
              toast.error(errorMessage);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {({ values }) => {
            const passwordStrength = useMemo(
              () => checkPasswordStrength(values.password),
              [values.password],
            );

            return (
              <Form
                className="space-y-5 p-8 rounded-lg shadow-md border"
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
                <FormikInput name="full_name" type="text" label="Full Name" placeholder="John Doe" />
                <FormikInput name="email" type="email" label="Email Address" placeholder="you@example.com" />

                <div>
                  <FormikInput name="password" type="password" label="Password" placeholder="••••••••" />
                  {values.password && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          Password Strength
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{
                            color:
                              passwordStrength.strength === 'strong'
                                ? '#10b981'
                                : passwordStrength.strength === 'good'
                                  ? '#f59e0b'
                                  : passwordStrength.strength === 'fair'
                                    ? '#f97316'
                                    : '#ef4444',
                          }}
                        >
                          {passwordStrength.strength.charAt(0).toUpperCase() +
                            passwordStrength.strength.slice(1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor:
                              passwordStrength.strength === 'strong'
                                ? '#10b981'
                                : passwordStrength.strength === 'good'
                                  ? '#f59e0b'
                                  : passwordStrength.strength === 'fair'
                                    ? '#f97316'
                                    : '#ef4444',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <FormikInput
                  name="confirm_password"
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  loading={isLoading}
                >
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  loading={isGoogleLoading}
                  onClick={handleGoogleSignIn}
                >
                  {isGoogleLoading ? <ButtonSpinner /> : <SiGoogle className="h-5 w-5" />}
                  Continue with Google
                </Button>

                <div className="text-center text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                  <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--accent-secondary)' }}>
                    Sign In
                  </Link>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
