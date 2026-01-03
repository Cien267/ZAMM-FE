import { CLIENT_TYPES } from '../constants'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const ClientsPage = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activeTab = pathname.includes(CLIENT_TYPES.COMPANY)
    ? CLIENT_TYPES.COMPANY
    : CLIENT_TYPES.PEOPLE

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">
          Manage your people and company clients
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => navigate(`/clients/${value}`)}
      >
        <TabsList>
          <TabsTrigger value={CLIENT_TYPES.PEOPLE}>People</TabsTrigger>
          <TabsTrigger value={CLIENT_TYPES.COMPANY}>Companies</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}

export default ClientsPage
