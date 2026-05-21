import { create } from 'zustand';

interface FormFieldError {
  [key: string]: string;
}

interface FormState {
  errors: FormFieldError;
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
  isValidating: boolean;
}

interface FormActions {
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  setErrors: (errors: FormFieldError) => void;
  setTouched: (touched: { [key: string]: boolean }) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsValidating: (isValidating: boolean) => void;
  resetForm: () => void;
  getFieldError: (field: string) => string | undefined;
  isFieldTouched: (field: string) => boolean;
}

export interface FormStore extends FormState, FormActions {}

const initialState: FormState = {
  errors: {},
  touched: {},
  isSubmitting: false,
  isValidating: false,
};

export const useFormStore = create<FormStore>((set, get) => ({
  ...initialState,

  setFieldError: (field: string, error: string) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: error,
      },
    }));
  },

  setFieldTouched: (field: string, touched: boolean) => {
    set((state) => ({
      touched: {
        ...state.touched,
        [field]: touched,
      },
    }));
  },

  setErrors: (errors: FormFieldError) => {
    set({ errors });
  },

  setTouched: (touched: { [key: string]: boolean }) => {
    set({ touched });
  },

  setIsSubmitting: (isSubmitting: boolean) => {
    set({ isSubmitting });
  },

  setIsValidating: (isValidating: boolean) => {
    set({ isValidating });
  },

  resetForm: () => {
    set(initialState);
  },

  getFieldError: (field: string) => {
    return get().errors[field];
  },

  isFieldTouched: (field: string) => {
    return get().touched[field] || false;
  },
}));
