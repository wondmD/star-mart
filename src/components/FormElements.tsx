import React from 'react';
import { clsx } from 'clsx';
import { Field, FieldProps, FormikHandlers } from 'formik';

function getFieldErrorMessage(errors: FieldProps['form']['errors'], name: string): string {
  const error = errors[name];
  return error ? String(error) : '';
}

function shouldShowFieldError(
  touched: FieldProps['form']['touched'],
  name: string,
  error: string,
): boolean {
  return Boolean(error) && Boolean(touched[name]);
}

function createChangeHandler(
  name: string,
  fieldOnChange: FormikHandlers['handleChange'],
  setFieldTouched: FieldProps['form']['setFieldTouched'],
) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFieldTouched(name, true, false);
    fieldOnChange(e);
  };
}

function createBlurHandler(
  name: string,
  fieldOnBlur: FormikHandlers['handleBlur'],
  setFieldTouched: FieldProps['form']['setFieldTouched'],
) {
  return (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFieldTouched(name, true, false);
    fieldOnBlur(e);
  };
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, style }) => (
  <div
    onClick={onClick}
    className={clsx(
      'rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border',
      onClick && 'cursor-pointer',
      className
    )}
    style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
      ...style,
    }}
  >
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2',
          className
        )}
        style={{
          backgroundColor: 'var(--input-bg)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--input-border)'}`,
          color: 'var(--input-text)',
          boxShadow: 'none',
        }}
        {...props}
      />
      {error && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2',
          className
        )}
        style={{
          backgroundColor: 'var(--input-bg)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--input-border)'}`,
          color: 'var(--input-text)',
          boxShadow: 'none',
        }}
        {...props}
      />
      {error && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  )
);

TextArea.displayName = 'TextArea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          'w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2',
          className
        )}
        style={{
          backgroundColor: 'var(--input-bg)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--input-border)'}`,
          color: 'var(--input-text)',
          boxShadow: 'none',
        }}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{error}</p>}
    </div>
  )
);

Select.displayName = 'Select';

interface FormikInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label?: string;
  name: string;
}

export const FormikInput: React.FC<FormikInputProps> = ({ label, name, ...props }) => (
  <Field name={name}>
    {({ field, form }: FieldProps) => {
      const errorMsg = getFieldErrorMessage(form.errors, name);
      const showError = shouldShowFieldError(form.touched, name, errorMsg);
      return (
        <Input
          {...field}
          {...props}
          label={label}
          error={showError ? errorMsg : ''}
          onChange={createChangeHandler(name, field.onChange, form.setFieldTouched)}
          onBlur={createBlurHandler(name, field.onBlur, form.setFieldTouched)}
        />
      );
    }}
  </Field>
);

interface FormikTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  label?: string;
  name: string;
}

export const FormikTextArea: React.FC<FormikTextAreaProps> = ({ label, name, ...props }) => (
  <Field name={name}>
    {({ field, form }: FieldProps) => {
      const errorMsg = getFieldErrorMessage(form.errors, name);
      const showError = shouldShowFieldError(form.touched, name, errorMsg);
      return (
        <TextArea
          {...field}
          {...props}
          label={label}
          error={showError ? errorMsg : ''}
          onChange={createChangeHandler(name, field.onChange, form.setFieldTouched)}
          onBlur={createBlurHandler(name, field.onBlur, form.setFieldTouched)}
        />
      );
    }}
  </Field>
);

interface FormikSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  label?: string;
  name: string;
  options: Array<{ value: string; label: string }>;
}

export const FormikSelect: React.FC<FormikSelectProps> = ({ label, name, options, ...props }) => (
  <Field name={name}>
    {({ field, form }: FieldProps) => {
      const errorMsg = getFieldErrorMessage(form.errors, name);
      const showError = shouldShowFieldError(form.touched, name, errorMsg);
      return (
        <Select
          {...field}
          {...props}
          label={label}
          options={options}
          error={showError ? errorMsg : ''}
          onChange={createChangeHandler(name, field.onChange, form.setFieldTouched)}
          onBlur={createBlurHandler(name, field.onBlur, form.setFieldTouched)}
        />
      );
    }}
  </Field>
);
