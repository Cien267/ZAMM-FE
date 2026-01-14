import { LendersTable } from '../components/LendersTable'

export const LendersPage = () => {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lenders</h1>
          <p className="text-muted-foreground mt-1">Manage your lenders</p>
        </div>
      </div>
      <div className="mt-6">
        <LendersTable />
      </div>
    </>
  )
}

export default LendersPage
