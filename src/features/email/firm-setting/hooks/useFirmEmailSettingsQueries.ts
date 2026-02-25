import { useQuery } from '@tanstack/react-query'
import { firmEmailSettingService } from '../services/firmEmailSettingService'
import { firmEmailSettingKeys } from '../constants'

export const useFirmEmailSettingsQueries = () => {
  const useFirmEmailSettingByBrokerageId = (
    brokerageId: string,
    enabled = true
  ) => {
    return useQuery({
      queryKey: firmEmailSettingKeys.firmEmailSettingDetailByBrokerage(),
      queryFn: () =>
        firmEmailSettingService.getFirmEmailSettingByBrokerageId(brokerageId),
      enabled: enabled && !!brokerageId,
    })
  }

  return {
    useFirmEmailSettingByBrokerageId,
  }
}
