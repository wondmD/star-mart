import { redirect } from 'next/navigation';

type SignupRedirectProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupRedirect({ searchParams }: SignupRedirectProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      query.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      query.set(key, value[0]);
    }
  }

  const queryString = query.toString();
  redirect(queryString ? `/auth/signup?${queryString}` : '/auth/signup');
}
