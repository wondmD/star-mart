'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { CreditCard, MapPin } from 'lucide-react';
import { Button } from '@/components/Button';
import { FormikInput, FormikTextArea, FormikSelect, Card } from '@/components/FormElements';
import { FormikZustandBridge } from '@/components/FormikZustandBridge';
import { checkoutValidationSchema } from '@/schemas';
import { User } from '@/types';

const COUNTRIES = [
  { value: 'Ethiopia', label: 'Ethiopia' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Uganda', label: 'Uganda' },
];

interface DeliveryFormProps {
  user: User;
  submitError?: string;
  isSubmitting: boolean;
  onSubmit: (values: {
    full_name: string;
    phone_number: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    notes?: string;
  }) => Promise<void>;
}

export function DeliveryForm({
  user,
  submitError,
  isSubmitting,
  onSubmit,
}: DeliveryFormProps) {
  const router = useRouter();

  return (
    <Card>
      <div className="mb-6 flex items-center gap-3">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Delivery Information</h2>
      </div>

      <Formik
        initialValues={{
          full_name: user.full_name || '',
          phone_number: '',
          address: '',
          city: '',
          postal_code: '',
          country: 'Ethiopia',
          notes: '',
        }}
        validationSchema={checkoutValidationSchema}
        validateOnChange
        validateOnBlur
        onSubmit={onSubmit}
      >
        {({ isSubmitting: formSubmitting }) => (
          <Form className="space-y-6">
            <FormikZustandBridge />
            {submitError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            ) : null}

            <div className="grid grid-cols-2 gap-4">
              <FormikInput name="full_name" label="Full Name" placeholder="John Doe" />
              <FormikInput name="phone_number" label="Phone Number" placeholder="0900000000" />
            </div>

            <FormikInput name="address" label="Street Address" placeholder="123 Main Street" />

            <div className="grid grid-cols-2 gap-4">
              <FormikInput name="city" label="City" placeholder="Addis Ababa" />
              <FormikInput name="postal_code" label="Postal Code" placeholder="1000" />
            </div>

            <FormikSelect name="country" label="Country" options={COUNTRIES} />

            <FormikTextArea
              name="notes"
              label="Order Notes (Optional)"
              placeholder="Special instructions for delivery..."
              rows={4}
            />

            <div className="flex gap-4 border-t pt-6">
              <Button variant="outline" className="flex-1" onClick={() => router.back()} type="button">
                Back to Cart
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex flex-1 items-center justify-center gap-2"
                loading={formSubmitting || isSubmitting}
              >
                <CreditCard className="h-5 w-5" />
                Complete Order
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
