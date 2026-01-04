import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const BrokerageGuard = () => {
  const { user } = useAuth()

  if (user && !user.brokerageId) {
    return <Navigate to="/create-brokerage" replace />
  }

  return <Outlet />
}
