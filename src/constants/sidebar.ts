import {
  LayoutDashboard,
  Users,
  FileText,
  SquareUserRound,
  Landmark,
  Mail,
  History,
  Settings2,
  LayoutTemplate,
  FolderTree,
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  badge?: string | number
  roles?: string[]
  children?: MenuItem[]
}

export const SIDEBAR_MENU: MenuItem[] = [
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
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    path: '',
    children: [
      {
        id: 'email-history',
        label: 'Email History',
        icon: History,
        path: '/email/history',
      },
      {
        id: 'email-categories',
        label: 'Email Categories',
        icon: FolderTree,
        path: '/email/categories',
      },
      {
        id: 'email-templates',
        label: 'Email Templates',
        icon: LayoutTemplate,
        path: '/email/templates',
      },
      {
        id: 'email-firm-settings',
        label: 'Firm Email Settings',
        icon: Settings2,
        path: '/email/firm-settings',
      },
    ],
  },
  {
    id: 'staffs',
    label: 'Staffs',
    icon: SquareUserRound,
    path: '/staffs',
  },
]
