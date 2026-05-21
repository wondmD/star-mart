import * as yup from 'yup';

/**
 * Password validation rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .required('Password is required');

export const emailSchema = yup
  .string()
  .email('Please enter a valid email address')
  .required('Email address is required');

export const nameSchema = yup
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .max(50, 'Full name must not exceed 50 characters')
  .matches(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes')
  .required('Full name is required');

/**
 * Enhanced login validation schema with better error messages
 */
export const loginValidationSchema = yup.object().shape({
  email: emailSchema,
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

/**
 * Enhanced signup validation schema with comprehensive checks
 */
export const signupValidationSchema = yup.object().shape({
  full_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

/**
 * Checkout validation schema for address and payment info
 */
export const checkoutValidationSchema = yup.object().shape({
  full_name: nameSchema,
  phone_number: yup
    .string()
    .matches(/^[+]?[0-9]{9,15}$/, 'Phone number must be 9-15 digits')
    .required('Phone number is required'),
  address: yup
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(100, 'Address must not exceed 100 characters')
    .required('Address is required'),
  city: yup
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must not exceed 50 characters')
    .required('City is required'),
  postal_code: yup
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(10, 'Postal code must not exceed 10 characters')
    .required('Postal code is required'),
  country: yup
    .string()
    .min(2, 'Country must be at least 2 characters')
    .required('Country is required'),
});

/**
 * Utility function to validate a single field
 */
export const validateField = async (
  fieldName: string,
  value: unknown,
  schema: yup.ObjectSchema<Record<string, unknown>>,
): Promise<string | null> => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
  }
  return null;
};

/**
 * Utility function to get all validation errors
 */
export const getValidationErrors = (error: yup.ValidationError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.inner.forEach((err) => {
    if (err.path) {
      errors[err.path] = err.message;
    }
  });
  return errors;
};

/**
 * Utility function to check password strength
 */
export const checkPasswordStrength = (password: string): {
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return { score: 0, strength: 'weak', feedback: ['Password is required'] };
  }

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters for extra security');
  }

  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  if (score === 5) strength = 'strong';
  else if (score === 4) strength = 'good';
  else if (score >= 2) strength = 'fair';

  return { score, strength, feedback };
};
