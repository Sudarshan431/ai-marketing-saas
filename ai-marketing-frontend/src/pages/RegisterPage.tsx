import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useRegister } from '../hooks/useAuth';
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas';

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onSubmit(values: RegisterFormValues) {
    await registerMutation.mutateAsync(values);
    navigate('/dashboard', { replace: true });
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
                <p className="text-sm text-slate-300">SaaS dashboard</p>
              </div>
            </div>

            <div className="mt-16 max-w-md">
              <p className="text-sm font-medium uppercase tracking-wide text-emerald-200">Start creating</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight">
                Keep campaigns, AI results, and product context in one place.
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Register once and your generated content history follows every authenticated request.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            <div className="mx-auto mt-8 max-w-md">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Create account</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your workspace will connect to the Spring Boot backend.
              </p>

              <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                <Input error={errors.name?.message} label="Name" {...register('name')} />
                <Input
                  autoComplete="email"
                  error={errors.email?.message}
                  label="Email"
                  type="email"
                  {...register('email')}
                />
                <Input
                  autoComplete="new-password"
                  error={errors.password?.message}
                  label="Password"
                  type="password"
                  {...register('password')}
                />
                <Button icon={<ArrowRight className="h-4 w-4" />} isLoading={registerMutation.isPending} type="submit">
                  Register
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link className="font-medium text-slate-950 underline dark:text-white" to="/login">
                  Login
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
