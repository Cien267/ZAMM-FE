import { useQuery } from '@tanstack/react-query'
import { staffService } from '../services/staffsService'
import type { StaffQuery } from '../types'
import { staffsKeys } from '../constants'

export const useStaffsQueries = () => {
  const useStaffsList = (query: StaffQuery) => {
    return useQuery({
      queryKey: staffsKeys.staffsList(query),
      queryFn: () => staffService.getStaffs(query),
    })
  }

  const useStaff = (id: string, enabled = true) => {
    return useQuery({
      queryKey: staffsKeys.staffDetail(id),
      queryFn: () => staffService.getStaff(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useStaffsList,
    useStaff,
  }
}
