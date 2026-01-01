import { useQuery } from "@tanstack/react-query"
import { clientService } from "../services/clientService"
import type { PersonQuery, CompanyQuery } from "../types"
import { clientKeys } from "../constants"

export const useClientQueries = () => {
  // People queries
  const usePeopleList = (query: PersonQuery) => {
    return useQuery({
      queryKey: clientKeys.peopleList(query),
      queryFn: () => clientService.getPeople(query),
    })
  }

  const usePerson = (id: string, enabled = true) => {
    return useQuery({
      queryKey: clientKeys.personDetail(id),
      queryFn: () => clientService.getPerson(id),
      enabled: enabled && !!id,
    })
  }

  // Company queries
  const useCompaniesList = (query: CompanyQuery) => {
    return useQuery({
      queryKey: clientKeys.companiesList(query),
      queryFn: () => clientService.getCompanies(query),
    })
  }

  const useCompany = (id: string, enabled = true) => {
    return useQuery({
      queryKey: clientKeys.companyDetail(id),
      queryFn: () => clientService.getCompany(id),
      enabled: enabled && !!id,
    })
  }

  return {
    usePeopleList,
    usePerson,
    useCompaniesList,
    useCompany,
  }
}
