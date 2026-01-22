import {
  LayoutDashboard,
  Users,
  FileText,
  // SquareUserRound,
  Landmark,
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  badge?: string | number
  roles?: string[]
}

export const navigationItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: Users,
    path: '/clients',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: '/reports',
  },
  {
    id: 'lenders',
    label: 'Lenders',
    icon: Landmark,
    path: '/lenders',
  },
  // {
  //   id: 'staffs',
  //   label: 'Staffs',
  //   icon: SquareUserRound,
  //   path: '/staffs',
  // },
]
