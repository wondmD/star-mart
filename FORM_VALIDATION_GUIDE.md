# Form Validation System Guide

This guide documents the comprehensive form validation system built with **Zustand**, **Formik**, and **Yup** for the StarMart application.

## Architecture Overview

The system is composed of three main layers:

### 1. **Validation Schemas (Yup)** - `/src/lib/validation.ts`
Centralized validation rules and schemas for all forms in the application.

### 2. **Form State Management (Zustand)** - `/src/stores/form-store.ts`
Manages form-wide state including errors, touched fields, and submission status.

### 3. **Form Components (Formik)** - Login & Signup Pages
Formik handles form binding, submission, and real-time validation.

---

## Validation Schemas

### Available Schemas

#### 1. **loginValidationSchema**
For user login with email and password.

```typescript
import { loginValidationSchema } from '@/schemas';

// Validates:
// - email: Valid email format, required
// - password: Minimum 6 characters, required
```

#### 2. **signupValidationSchema**
For user registration with comprehensive password rules.

```typescript
import { signupValidationSchema } from '@/schemas';

// Validates:
// - full_name: 2-50 chars, letters/spaces/hyphens/apostrophes only
// - email: Valid email format, required
// - password: Strong password with uppercase, lowercase, numbers
// - confirm_password: Must match password field
```

#### 3. **checkoutValidationSchema**
For order checkout information.

```typescript
import { checkoutValidationSchema } from '@/schemas';

// Validates:
// - full_name: 2-50 chars
// - phone_number: 9-15 digits, international format support
// - address: 5-100 chars
// - city: 2-50 chars
// - postal_code: 3-10 chars
// - country: Required
```

### Custom Schema Builders

Individual schema validators for specific fields:

```typescript
import { 
  emailSchema, 
  passwordSchema, 
  nameSchema 
} from '@/schemas';

// Use in custom Yup schemas
const customSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});
```

---

## Form State Management (Zustand)

### useFormStore Hook

Manages all form-level state and validation errors.

```typescript
import { useFormStore } from '@/stores/form-store';

const {
  // State
  errors,           // { fieldName: 'error message' }
  touched,          // { fieldName: boolean }
  isSubmitting,     // boolean
  isValidating,     // boolean
  
  // Actions
  setFieldError,    // (field: string, error: string) => void
  setFieldTouched,  // (field: string, touched: boolean) => void
  setErrors,        // (errors: object) => void
  setTouched,       // (touched: object) => void
  setIsSubmitting,  // (isSubmitting: boolean) => void
  setIsValidating,  // (isValidating: boolean) => void
  resetForm,        // () => void
  getFieldError,    // (field: string) => string | undefined
  isFieldTouched,   // (field: string) => boolean
} = useFormStore();
```

### Usage Examples

```typescript
// Get a specific field error
const emailError = useFormStore((state) => state.getFieldError('email'));

// Set error on field
const { setFieldError } = useFormStore();
setFieldError('email', 'This email is already taken');

// Reset entire form
const { resetForm } = useFormStore();
resetForm();
```

---

## Implementation Examples

### Login Page Integration

```typescript
'use client';

import { useState } from 'react';
import { Formik, Form } from 'formik';
import { useAuthStore } from '@/stores/auth-store';
import { useFormStore } from '@/stores/form-store';
import { loginValidationSchema } from '@/schemas';
import { authService } from '@/services/auth';

export default function LoginPage() {
  const { setUser } = useAuthStore();
  const { setErrors: setFormErrors, resetForm } = useFormStore();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginValidationSchema}
      onSubmit={async (values) => {
        setIsLoading(true);
        try {
          const user = await authService.login(values);
          setUser(user);
          resetForm();
          // Navigate on success
        } catch (error) {
          setFormErrors({ submit: error.message });
          // Show error toast
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {({ errors, touched, values }) => (
        <Form>
          {/* Form fields */}
        </Form>
      )}
    </Formik>
  );
}
```

### Signup Page with Password Strength

```typescript
import { useMemo } from 'react';
import { checkPasswordStrength } from '@/schemas';

export default function SignupPage() {
  // ... setup code

  return (
    <Formik
      // ... Formik props
      onSubmit={async (values) => {
        try {
          const user = await authService.signup(values);
          setUser(user);
          resetForm();
        } catch (error) {
          setFormErrors({ submit: error.message });
        }
      }}
    >
      {({ errors, touched, values }) => {
        const passwordStrength = useMemo(
          () => checkPasswordStrength(values.password),
          [values.password]
        );

        return (
          <Form>
            <Input name="password" type="password" />
            
            {values.password && (
              <div className="password-strength-meter">
                {/* Display strength indicator */}
                <div style={{
                  width: `${(passwordStrength.score / 5) * 100}%`,
                  backgroundColor: passwordStrength.strength === 'strong' ? '#10b981' : '#ef4444'
                }} />
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}
```

---

## Utility Functions

### validateField()
Validate a single field against a schema.

```typescript
import { validateField, loginValidationSchema } from '@/schemas';

const error = await validateField('email', 'test@example.com', loginValidationSchema);
if (error) {
  console.log('Validation error:', error);
}
```

### getValidationErrors()
Extract all validation errors from a Yup ValidationError.

```typescript
import { getValidationErrors } from '@/schemas';
import * as yup from 'yup';

try {
  await schema.validate(data);
} catch (error) {
  const errors = getValidationErrors(error);
  console.log(errors);
  // { email: 'Invalid email', password: 'Too short' }
}
```

### checkPasswordStrength()
Analyze password strength and get recommendations.

```typescript
import { checkPasswordStrength } from '@/schemas';

const result = checkPasswordStrength('MyPass123');
// Returns:
// {
//   score: 4,
//   strength: 'good',
//   feedback: ['Add special characters for extra security']
// }
```

---

## Validation Rules Summary

### Password Requirements

| Rule | Details |
|------|---------|
| **Length** | Minimum 8 characters |
| **Uppercase** | At least one uppercase letter (A-Z) |
| **Lowercase** | At least one lowercase letter (a-z) |
| **Number** | At least one digit (0-9) |
| **Special** | Optional (recommended) |

### Email Requirements

- Valid email format (RFC 5322)
- Unique per application rules

### Name Requirements

- 2-50 characters
- Letters, spaces, hyphens, apostrophes only

### Phone Number Requirements

- 9-15 digits (international format)
- Supports leading `+` for country code

---

## Error Handling Patterns

### Pattern 1: Field-Level Errors

```typescript
{({ errors, touched }) => (
  <Input
    name="email"
    error={touched.email ? errors.email : ''}
  />
)}
```

### Pattern 2: Form-Level Errors

```typescript
const formStore = useFormStore();
const submitError = formStore.getFieldError('submit');

{submitError && (
  <div className="error-alert">{submitError}</div>
)}
```

### Pattern 3: Custom Validation

```typescript
onSubmit={async (values) => {
  try {
    // Custom validation
    if (await checkEmailExists(values.email)) {
      setFormErrors({ email: 'Email already registered' });
      return;
    }
    
    // Continue with submission
  } catch (error) {
    setFormErrors({ submit: error.message });
  }
}}
```

---

## Best Practices

### 1. **Use Zustand for Global Form State**
When multiple components need to access validation state, use the form store.

### 2. **Leverage Formik's Touched Field**
Only show errors after user interaction to avoid overwhelming UX.

```typescript
error={touched.email ? errors.email : ''}
```

### 3. **Implement Real-Time Validation**
Use `useMemo` and Formik's `validateOnChange` for responsive feedback.

### 4. **Display Password Strength**
Give users immediate feedback on password quality.

### 5. **Reset on Success**
Always reset form state after successful submission.

```typescript
resetForm(); // Zustand action
```

### 6. **Validate Server-Side**
Never rely solely on client-side validation for security.

---

## File Structure

```
src/
├── lib/
│   └── validation.ts          # Validation schemas and utilities
├── stores/
│   ├── auth-store.ts          # User authentication state
│   └── form-store.ts          # Form validation state (NEW)
├── schemas/
│   └── index.ts               # Re-exports from validation.ts
└── app/auth/
    ├── login/
    │   └── page.tsx           # Login form with validation
    └── signup/
        └── page.tsx           # Signup form with strength indicator
```

---

## Migration Guide

If you're updating existing forms to use this system:

1. **Import the form store**: `import { useFormStore } from '@/stores/form-store'`
2. **Use validation schemas**: `import { loginValidationSchema } from '@/schemas'`
3. **Update error handling**: Use both Formik and Zustand together
4. **Add reset logic**: Call `resetForm()` on successful submission
5. **Test validation**: Verify all fields validate correctly

---

## Troubleshooting

### Validation not triggering
- Ensure `validationSchema` is properly passed to Formik
- Check field names match schema shape

### Errors not displaying
- Verify `touched` state is being set
- Use conditional rendering: `touched.field && errors.field`

### Form store not updating
- Call store actions inside event handlers or effects
- Subscribe with `useFormStore((state) => state.fieldName)`

---

## Future Enhancements

- [ ] Async field validation (email uniqueness check)
- [ ] Custom error messages per user language
- [ ] Form-level success/warning messages
- [ ] Undo/Redo functionality
- [ ] Form history tracking
