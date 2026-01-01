import { useQuery } from "@tanstack/react-query"
import { clientService } from "@/features/clients/services/clientService"
import { assetService } from "@/features/assets/services/assetService"
import { authService } from "@/features/auth/services/authService"
import { liabilityService } from "@/features/liabilities/services/liabilityService"

export const sharedKeys = {
  people: ["shared", "people"] as const,
  companies: ["shared", "companies"] as const,
  assets: ["shared", "assets"] as const,
  liabilities: ["shared", "liabilities"] as const,
  users: ["shared", "users"] as const,
}

export const useAllPeople = () => {
  return useQuery({
    queryKey: sharedKeys.people,
    queryFn: () => clientService.getPeople({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllCompanies = () => {
  return useQuery({
    queryKey: sharedKeys.companies,
    queryFn: () => clientService.getCompanies({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllAssets = () => {
  return useQuery({
    queryKey: sharedKeys.assets,
    queryFn: () => assetService.getAssets({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLiabilities = () => {
  return useQuery({
    queryKey: sharedKeys.liabilities,
    queryFn: () => liabilityService.getLiabilities({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllUsers = () => {
  return useQuery({
    queryKey: sharedKeys.users,
    queryFn: () => authService.getAllUser(),
    staleTime: 5 * 60 * 1000,
  })
}
