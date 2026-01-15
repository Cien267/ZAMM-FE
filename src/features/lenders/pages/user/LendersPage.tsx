import { AssignLender } from '../../components/user/AssignLender'

export const LendersPage = () => {
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lenders</h1>
          <p className="text-muted-foreground mt-1">
            Choose the lenders you work with, and they'll be available for all
            your liabilities.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <AssignLender />
      </div>
    </>
  )
}

export default LendersPage
