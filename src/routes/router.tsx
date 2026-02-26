import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import { BrokerageGuard } from './BrokerageGuard'
import { DefaultLayout } from '@/layouts/DefaultLayout'
import { SuspenseWrapper } from '@/components/common//SuspenseWrapper'
import ErrorPage from '@/pages/ErrorPage'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const CreateBrokeragePage = lazy(
  () => import('@/features/brokerages/pages/CreateBrokeragePage')
)
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
  () => import('@/features/companies/components/CompanyTable')
)
const CompanyDetailPage = lazy(
  () => import('@/features/companies/pages/CompanyDetailPage')
)
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
const StaffsPage = lazy(() => import('@/features/staffs/pages/StaffsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const AssetDetailPage = lazy(
  () => import('@/features/assets/pages/AssetDetailPage')
)
const LiabilityDetailPage = lazy(
  () => import('@/features/liabilities/pages/LiabilityDetailPage')
)
const LendersPage = lazy(
  () => import('@/features/lenders/pages/user/LendersPage')
)
const AdminLendersPage = lazy(
  () => import('@/features/lenders/pages/admin/AdminLendersPage')
)
const AdminLenderDetailPage = lazy(
  () => import('@/features/lenders/pages/admin/AdminLenderDetailPage')
)
const EmailCategoriesPage = lazy(
  () => import('@/features/email/category/pages/EmailCategoriesPage')
)
const FirmEmailSettingPage = lazy(
  () => import('@/features/email/firm-setting/pages/FirmEmailSettingPage')
)

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
        path: '/create-brokerage',
        element: (
          <SuspenseWrapper>
            <CreateBrokeragePage />
          </SuspenseWrapper>
        ),
      },
      {
        element: <BrokerageGuard />,
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
                  {
                    path: 'assets',
                    children: [
                      {
                        index: true,
                        element: <Navigate to="/clients/people" replace />,
                      },
                      {
                        path: ':assetId',
                        element: <AssetDetailPage />,
                      },
                    ],
                  },
                  {
                    path: 'liabilities',
                    children: [
                      {
                        index: true,
                        element: <Navigate to="/clients/people" replace />,
                      },
                      {
                        path: ':liabilityId',
                        element: <LiabilityDetailPage />,
                      },
                    ],
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
                path: '/email',
                children: [
                  {
                    index: true,
                    element: <Navigate to="/email/history" replace />,
                  },
                  // {
                  //   path: 'history',
                  //   element: <PeopleTable />,
                  // },
                  {
                    path: 'categories',
                    element: <EmailCategoriesPage />,
                  },
                  // {
                  //   path: 'templates',
                  //   element: <CompanyTable />,
                  // },
                  {
                    path: 'firm-settings',
                    element: <FirmEmailSettingPage />,
                  },
                ],
              },
              {
                path: '/staffs',
                element: (
                  <SuspenseWrapper>
                    <StaffsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/lenders',
                element: (
                  <SuspenseWrapper>
                    <LendersPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/lenders',
                element: (
                  <SuspenseWrapper>
                    <AdminLendersPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/lenders/:id',
                element: (
                  <SuspenseWrapper>
                    <AdminLenderDetailPage />
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
