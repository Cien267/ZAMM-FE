import { useFirmEmailSettingsQueries } from '../../firm-settings/hooks/useFirmEmailSettingsQueries'
import { useAuth } from '@/features/auth/hooks/useAuth'

import { renderFullPreview } from '../lib/utils'

interface PreviewBodyTemplateProps {
  bodyHtml: string
}

export const PreviewBodyTemplate = ({ bodyHtml }: PreviewBodyTemplateProps) => {
  const { useFirmEmailSettingByBrokerageId } = useFirmEmailSettingsQueries()
  const { user } = useAuth()
  const { data: firmSettings } = useFirmEmailSettingByBrokerageId(
    user?.brokerageId || '',
    !!user?.brokerageId
  )

  return (
    <div className="flex flex-col h-full space-y-2">
      <label className="font-semibold text-sm">Live Preview</label>
      <div className="flex-1 border rounded-lg bg-white shadow-inner overflow-hidden flex flex-col">
        <div className="bg-slate-100 p-2 border-b flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <iframe
          title="Email Preview"
          className="w-full h-full"
          srcDoc={renderFullPreview(bodyHtml, firmSettings)}
          sandbox="allow-popups"
        />
      </div>
    </div>
  )
}
