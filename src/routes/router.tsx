import { createBrowserRouter, Navigate } from "react-router-dom"
import { lazy } from "react"
import { PrivateRoute } from "./PrivateRoute"
import { PublicRoute } from "./PublicRoute"
import { DefaultLayout } from "@/layouts/DefaultLayout"
import { SuspenseWrapper } from "@/components/common//SuspenseWrapper"
import ErrorPage from "@/pages/ErrorPage"

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"))
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"))
const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage")
)
const ClientsPage = lazy(() => import("@/features/clients/pages/ClientsPage"))
const ClientDetailPage = lazy(
  () => import("@/features/clients/pages/ClientDetailPage")
)
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"))

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        children: [
          {
            path: "/login",
            element: (
              <SuspenseWrapper>
                <LoginPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/register",
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
            path: "/dashboard",
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/clients",
            children: [
              {
                index: true,
                element: (
                  <SuspenseWrapper>
                    <ClientsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: ":id",
                element: (
                  <SuspenseWrapper>
                    <ClientDetailPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
          {
            path: "/reports",
            element: (
              <SuspenseWrapper>
                <ReportsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <SuspenseWrapper>
        <UnauthorizedPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/404",
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
])
