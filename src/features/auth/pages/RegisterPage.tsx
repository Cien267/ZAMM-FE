import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Loader2, UserPlus, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '../hooks/useAuth'
import { RegisterSchema, type RegisterInput } from '../types/auth.types'
import logo from '@/assets/images/logo.png'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Toaster } from 'sonner'

export const RegisterPage = () => {
  usePageTitle('Register')
  const { register, isRegistering, registerError } = useAuth()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      userName: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: RegisterInput) => {
    register(data)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-muted/50 px-4 py-12">
      <img src={logo} alt="" />
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6" /> Create an account
          </CardTitle>
          <CardDescription>
            Enter your details below to create your Zamm account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@example.com"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {registerError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{registerError.message}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isRegistering}
              >
                {isRegistering && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRegistering ? 'Creating account...' : 'Register'}
              </Button>

              <div className="text-center text-sm text-gray-900">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster
        toastOptions={{
          classNames: {
            error: 'bg-red-50! border-red-200! text-red-900!',
            success: 'bg-green-50! border-green-200! text-green-900!',
            warning: 'bg-yellow-50! border-yellow-200! text-yellow-900!',
            info: 'bg-blue-50! border-blue-200! text-blue-900!',
          },
        }}
      />
    </div>
  )
}

export default RegisterPage
