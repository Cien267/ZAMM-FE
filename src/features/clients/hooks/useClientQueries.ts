import { useQuery } from "@tanstack/react-query"
import { clientService } from "../services/clientService"
import type { PersonQuery, CompanyQuery } from "../types"

export const clientKeys = {
  all: ["clients"] as const,
  people: () => [...clientKeys.all, "people"] as const,
  peopleList: (query: any) => [...clientKeys.people(), "list", query] as const,
  personDetail: (id: string) => [...clientKeys.people(), "detail", id] as const,
  companies: () => [...clientKeys.all, "companies"] as const,
  companiesList: (query: any) =>
    [...clientKeys.companies(), "list", query] as const,
  companyDetail: (id: string) =>
    [...clientKeys.companies(), "detail", id] as const,
}

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
