import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { staffsKeys } from '../constants'
import { staffService } from '../services/staffsService'
import type {
  CreateStaffInput,
  UpdateStaffInput,
  UpdateRolesInput,
} from '../types'

export const useStaffs = () => {
  const queryClient = useQueryClient()

  const createStaffMutation = useMutation({
    mutationFn: (data: CreateStaffInput) => staffService.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffsKeys.staffs() })
      toast.success('Staff created successfully!')
    },
    onError: (error: any) => {
      if (error.statusCode !== 403) {
        toast.error(error.message || 'Failed to create staff')
      }
      console.error('Create staff error:', error)
    },
  })

  const updateStaffMutation = useMutation({
    mutationFn: (data: UpdateStaffInput) => staffService.updateStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffsKeys.staffs() })
      toast.success('Staff updated successfully!')
    },
    onError: (error: any) => {
      if (error.statusCode !== 403) {
        toast.error(error.message || 'Failed to update staff')
      }
      console.error('Update staff error:', error)
    },
  })

  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) => staffService.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffsKeys.staffs() })
      toast.success('Staff deleted successfully!')
    },
    onError: (error: any) => {
      if (error.statusCode !== 403) {
        toast.error(error.message || 'Failed to delete staff')
      }
      console.error('Delete staff error:', error)
    },
  })

  const updateRolesMutation = useMutation({
    mutationFn: ({
      assignerId,
      data,
    }: {
      assignerId: string
      data: UpdateRolesInput
    }) => staffService.updateRoles(assignerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffsKeys.staffs() })
      toast.success('Roles updated successfully!')
    },
    onError: (error: any) => {
      if (error.statusCode !== 403) {
        toast.error(error.message || 'Failed to update roles')
      }
      console.error('Update roles error:', error)
    },
  })

  return {
    createStaff: createStaffMutation.mutate,
    createStaffAsync: createStaffMutation.mutateAsync,
    isCreatingStaff: createStaffMutation.isPending,
    createStaffError: createStaffMutation.error,

    updateStaff: updateStaffMutation.mutate,
    updateStaffAsync: updateStaffMutation.mutateAsync,
    isUpdatingStaff: updateStaffMutation.isPending,
    updateStaffError: updateStaffMutation.error,

    deleteStaff: deleteStaffMutation.mutate,
    deleteStaffAsync: deleteStaffMutation.mutateAsync,
    isDeletingStaff: deleteStaffMutation.isPending,
    deleteStaffError: deleteStaffMutation.error,

    updateRoles: updateRolesMutation.mutate,
    updateRolesAsync: updateRolesMutation.mutateAsync,
    isUpdatingRoles: updateRolesMutation.isPending,
    updateRolesError: updateRolesMutation.error,
  }
}
