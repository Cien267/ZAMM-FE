import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { peopleKeys } from '../constants'
import { sharedKeys } from '@/hooks/useSharedData'
import { reportKeys } from '@/features/reports/constants'
import { peopleService } from '../services/peopleService'
import type { CreatePersonInput, UpdatePersonInput } from '../types'

export const usePeople = () => {
  const queryClient = useQueryClient()

  const createPersonMutation = useMutation({
    mutationFn: (data: CreatePersonInput) => peopleService.createPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.people() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.people })
      queryClient.invalidateQueries({ queryKey: ['shared', 'people-company'] })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      toast.success('Person created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create person')
      console.error('Create person error:', error)
    },
  })

  const updatePersonMutation = useMutation({
    mutationFn: (data: UpdatePersonInput) => peopleService.updatePerson(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.people() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.people })
      queryClient.invalidateQueries({ queryKey: ['shared', 'people-company'] })
      queryClient.invalidateQueries({
        queryKey: peopleKeys.personDetail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      toast.success('Person updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update person')
      console.error('Update person error:', error)
    },
  })

  const deletePersonMutation = useMutation({
    mutationFn: (id: string) => peopleService.deletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKeys.people() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.people })
      queryClient.invalidateQueries({ queryKey: ['shared', 'people-company'] })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      toast.success('Person deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete person')
      console.error('Delete person error:', error)
    },
  })

  return {
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
  }
}
