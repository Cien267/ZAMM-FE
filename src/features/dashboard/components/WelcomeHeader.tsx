import { useAuth } from '@/features/auth/hooks/useAuth'

export const WelcomeHeader: React.FC = () => {
  const { user } = useAuth()
  const userName = user?.fullName || 'Admin'

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Welcome,{' '}
        <span className="font-extrabold text-yellow-500">{userName}</span>
      </h1>
      <p className="text-muted-foreground mt-1">
        Here's what's happening with your clients and loans today.
      </p>
    </div>
  )
}
