import { LendersTable } from '../../components/admin/LendersTable'

export const AdminLendersPage = () => {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lenders Management</h1>
          <p className="text-muted-foreground mt-1">Manage your lenders</p>
        </div>
      </div>
      <div className="mt-6">
        <LendersTable />
      </div>
    </>
  )
}

export default AdminLendersPage
