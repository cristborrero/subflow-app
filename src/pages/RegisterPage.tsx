import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { signUp, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState<string | null>(null);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError(null);
    try {
      await signUp(data.email, data.password, data.fullName);
      // Wait a moment and then redirect to login (or dashboard if auto-signin is permitted by Supabase rules)
      navigate('/login', { replace: true });
    } catch (error: any) {
      setAuthError(error.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9fc] dark:bg-[#0a2540] p-4 font-sans transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-0 bg-white dark:bg-[#112d4e] overflow-hidden rounded-2xl">
          <CardHeader className="space-y-3 pt-8 pb-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-[#635bff] shadow-md rounded-xl flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-slate-500 dark:text-slate-400">
              Start tracking your subscriptions today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
                  {authError}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-[#635bff] focus:border-[#635bff] transition-colors"
                  {...form.register('fullName')}
                />
                {form.formState.errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-[#635bff] focus:border-[#635bff] transition-colors"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-[#635bff] focus:border-[#635bff] transition-colors"
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#635bff] hover:bg-[#4f46e5] text-white shadow-md transition-all font-semibold rounded-lg pt-2 pb-2 h-11 mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating account...</span>
                  </span>
                ) : 'Sign Up'}
              </Button>
            </form>



            <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#635bff] hover:text-[#4f46e5] transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
