import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/use-auth'
import { extractError } from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginForm) {
    try {
      const data = await login.mutateAsync({
        ...values,
        device_name: navigator.userAgent,
      })
      toast.success(`Selamat datang, ${data.user.name}!`)
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-accent">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif tracking-wide">Doc Manager</CardTitle>
          <CardDescription>Document Management System · Masuk untuk mulai</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@test.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {login.isPending ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 rounded-md bg-muted p-3 text-xs text-muted-foreground leading-relaxed">
            <div className="font-semibold text-foreground mb-1">Demo accounts</div>
            <code className="block">admin@test.com / 12341234 (admin)</code>
            <code className="block">admin1@test.com / 12341234 (editor)</code>
            <code className="block">admin2@test.com / 12341234 (viewer)</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
