'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  })

  async function onSubmit(values: RegisterValues): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.fullName },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (!data.user) {
        toast.error('Registration failed. Please try again.')
        return
      }

      // Create profile row (default role: CLIENT)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: values.email,
        full_name: values.fullName,
        role: 'CLIENT',
      })

      if (profileError) {
        // Profile may already exist (e.g. from auth trigger) — not fatal
        if (!profileError.message.includes('duplicate')) {
          console.error('Profile insert error:', profileError)
        }
      }

      toast.success('Account created! Welcome to VMA.')
      router.push('/portal/dashboard')
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <div className="rounded-2xl border border-vma-border bg-vma-surface p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-vma-text">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-vma-text-muted">
          Join VMA and start growing your business
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-vma-text-muted text-xs uppercase tracking-wider">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Jane Smith"
                    autoComplete="name"
                    className="bg-vma-surface-2 border-vma-border text-vma-text placeholder:text-vma-text-dim focus-visible:ring-vma-violet"
                  />
                </FormControl>
                <FormMessage className="text-vma-red text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-vma-text-muted text-xs uppercase tracking-wider">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="bg-vma-surface-2 border-vma-border text-vma-text placeholder:text-vma-text-dim focus-visible:ring-vma-violet"
                  />
                </FormControl>
                <FormMessage className="text-vma-red text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-vma-text-muted text-xs uppercase tracking-wider">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      autoComplete="new-password"
                      className="bg-vma-surface-2 border-vma-border text-vma-text placeholder:text-vma-text-dim focus-visible:ring-vma-violet pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-vma-text-muted hover:text-vma-text transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-vma-red text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-vma-violet hover:bg-vma-violet-light text-white font-semibold transition-all glow-violet"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-vma-text-muted">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-vma-violet hover:text-vma-violet-light font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
