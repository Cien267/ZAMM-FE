import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import { DefaultLayout } from '@/layouts/DefaultLayout'
import { SuspenseWrapper } from '@/components/common//SuspenseWrapper'
import ErrorPage from '@/pages/ErrorPage'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const DashboardPage = lazy(
  () => import('@/features/dashboard/pages/DashboardPage')
)
const ClientsPage = lazy(() => import('@/features/clients/pages/ClientsPage'))
const PersonDetailPage = lazy(
  () => import('@/features/people/pages/PersonDetailPage')
)
const PeopleTable = lazy(
  () => import('@/features/people/components/PeopleTable')
)

const CompanyTable = lazy(
  () => import('@/features/company/components/CompanyTable')
)
const CompanyDetailPage = lazy(
  () => import('@/features/company/pages/CompanyDetailPage')
)
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        children: [
          {
            path: '/login',
            element: (
              <SuspenseWrapper>
                <LoginPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/register',
            element: (
              <SuspenseWrapper>
                <RegisterPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/clients',
            element: (
              <SuspenseWrapper>
                <ClientsPage />
              </SuspenseWrapper>
            ),
            children: [
              {
                index: true,
                element: <Navigate to="people" replace />,
              },
              {
                path: 'people',
                element: <PeopleTable />,
              },
              {
                path: 'people/:id',
                element: <PersonDetailPage />,
              },
              {
                path: 'companies',
                element: <CompanyTable />,
              },
              {
                path: 'companies/:id',
                element: <CompanyDetailPage />,
              },
            ],
          },
          {
            path: '/reports',
            element: (
              <SuspenseWrapper>
                <ReportsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
    ],
  },
  {
    path: '/unauthorized',
    element: (
      <SuspenseWrapper>
        <UnauthorizedPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/404',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
])
