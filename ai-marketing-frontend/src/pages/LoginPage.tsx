import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useLogin } from '../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    await loginMutation.mutateAsync(values);
    navigate(from, { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-[1fr_1.1fr]">
          <section className="border-b bg-slate-950 p-8 text-white dark:border-slate-800 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-950">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">AI Marketing</p>
                <p className="text-sm text-slate-300">Content generator</p>
              </div>
            </div>

            <div className="mt-16 max-w-md">
              <p className="text-sm font-medium uppercase tracking-wide text-cyan-200">Campaign workspace</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight">
                Generate platform-aware copy and keep every result organized.
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Sign in to create content, review generated variations, and manage your saved history.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            <div className="mx-auto mt-8 max-w-md">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Continue building marketing content for your products.
              </p>

              <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  autoComplete="email"
                  error={errors.email?.message}
                  label="Email"
                  type="email"
                  {...register('email')}
                />
                <Input
                  autoComplete="current-password"
                  error={errors.password?.message}
                  label="Password"
                  type="password"
                  {...register('password')}
                />
                <Button icon={<ArrowRight className="h-4 w-4" />} isLoading={loginMutation.isPending} type="submit">
                  Login
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                New here?{' '}
                <Link className="font-medium text-slate-950 underline dark:text-white" to="/register">
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
