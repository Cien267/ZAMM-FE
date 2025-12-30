import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner" // or your toast library
import { clientKeys } from "./useClientQueries"
import { clientService } from "../services/clientService"
import type {
  CreatePersonInput,
  UpdatePersonInput,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "../types"

export const useClients = () => {
  const queryClient = useQueryClient()

  // People mutations
  const createPersonMutation = useMutation({
    mutationFn: (data: CreatePersonInput) => clientService.createPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.people() })
      toast.success("Person created successfully!")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create person")
      console.error("Create person error:", error)
    },
  })

  const updatePersonMutation = useMutation({
    mutationFn: (data: UpdatePersonInput) => clientService.updatePerson(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.people() })
      queryClient.invalidateQueries({
        queryKey: clientKeys.personDetail(variables.id),
      })
      toast.success("Person updated successfully!")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update person")
      console.error("Update person error:", error)
    },
  })

  const deletePersonMutation = useMutation({
    mutationFn: (id: string) => clientService.deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.people() })
      toast.success("Person deleted successfully!")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete person")
      console.error("Delete person error:", error)
    },
  })

  // Company mutations
  const createCompanyMutation = useMutation({
    mutationFn: (data: CreateCompanyInput) => clientService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.companies() })
      toast.success("Company created successfully!")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create company")
      console.error("Create company error:", error)
    },
  })

  const updateCompanyMutation = useMutation({
    mutationFn: (data: UpdateCompanyInput) => clientService.updateCompany(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.companies() })
      queryClient.invalidateQueries({
        queryKey: clientKeys.companyDetail(variables.id),
      })
      toast.success("Company updated successfully!")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update company")
      console.error("Update company error:", error)
    },
  })

  const deleteCompanyMutation = useMutation({
    mutationFn: (id: string) => clientService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.companies() })
      toast.success("Company deleted successfully!")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete company")
      console.error("Delete company error:", error)
    },
  })

  return {
    // People
    createPerson: createPersonMutation.mutate,
    createPersonAsync: createPersonMutation.mutateAsync,
    isCreatingPerson: createPersonMutation.isPending,
    createPersonError: createPersonMutation.error,

    updatePerson: updatePersonMutation.mutate,
    updatePersonAsync: updatePersonMutation.mutateAsync,
    isUpdatingPerson: updatePersonMutation.isPending,
    updatePersonError: updatePersonMutation.error,

    deletePerson: deletePersonMutation.mutate,
    deletePersonAsync: deletePersonMutation.mutateAsync,
    isDeletingPerson: deletePersonMutation.isPending,
    deletePersonError: deletePersonMutation.error,

    // Companies
    createCompany: createCompanyMutation.mutate,
    createCompanyAsync: createCompanyMutation.mutateAsync,
    isCreatingCompany: createCompanyMutation.isPending,
    createCompanyError: createCompanyMutation.error,

    updateCompany: updateCompanyMutation.mutate,
    updateCompanyAsync: updateCompanyMutation.mutateAsync,
    isUpdatingCompany: updateCompanyMutation.isPending,
    updateCompanyError: updateCompanyMutation.error,

    deleteCompany: deleteCompanyMutation.mutate,
    deleteCompanyAsync: deleteCompanyMutation.mutateAsync,
    isDeletingCompany: deleteCompanyMutation.isPending,
    deleteCompanyError: deleteCompanyMutation.error,
  }
}
