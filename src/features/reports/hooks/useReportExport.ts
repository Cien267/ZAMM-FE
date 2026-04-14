import { useState } from 'react'
import type { ExportSettings } from '@/types'
import { reportService } from '../services/reportService'
import { toast } from 'sonner'

export const useReportExport = () => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (settings: ExportSettings) => {
    setIsExporting(true)
    try {
      const response = await reportService.exportReport(settings)
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const extension = settings.format === 'excel' ? 'xlsx' : settings.format
      link.setAttribute('download', `${settings.fileName}.${extension}`)

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Exported!')
    } catch (error: any) {
      console.error('Export failed:', error)
      toast.error(
        error.response?.data?.message ||
          'An error occurred while exporting the report'
      )
    } finally {
      setIsExporting(false)
    }
  }

  return {
    handleExport,
    isExporting,
  }
}
