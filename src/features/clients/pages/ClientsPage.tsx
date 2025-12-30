import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeopleTable } from "../components/people/PeopleTable"
// import { CompanyTable } from "../components/company/CompanyTable"
import { CLIENT_TYPES } from "../constants"
import type { ClientType } from "../types"

export const ClientsPage = () => {
  const [activeTab, setActiveTab] = useState<ClientType>(CLIENT_TYPES.PEOPLE)

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
        onValueChange={(value) => setActiveTab(value as ClientType)}
      >
        <TabsList>
          <TabsTrigger value={CLIENT_TYPES.PEOPLE}>People</TabsTrigger>
          <TabsTrigger value={CLIENT_TYPES.COMPANY}>Companies</TabsTrigger>
        </TabsList>

        <TabsContent value={CLIENT_TYPES.PEOPLE} className="mt-6">
          <PeopleTable />
        </TabsContent>

        <TabsContent value={CLIENT_TYPES.COMPANY} className="mt-6">
          {/* <CompanyTable /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ClientsPage
