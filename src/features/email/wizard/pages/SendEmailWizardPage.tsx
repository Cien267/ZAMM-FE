import { useState } from 'react'
import type { CreateRecipientInput } from '../types'
import { ConfigurationStep } from '../components/ConfigurationStep'
import { BatchPreviewStep } from '../components/BatchPreviewStep'
import { CompletionStep } from '../components/CompletionStep'
import { Stepper } from '../components/Stepper'
import { useEmailPreviewBatches } from '../hooks/useEmailPreviewBatches'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useFirmEmailSettingsQueries } from '@/features/email/firm-settings/hooks/useFirmEmailSettingsQueries'
import { useNavigate } from 'react-router-dom'

export const SendEmailWizardPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedRecipients, setSelectedRecipients] = useState<
    CreateRecipientInput[]
  >([])

  const {
    createEmailPreviewBatchAsync,
    deleteEmailPreviewBatchAsync,
    approveEmailPreviewBatchAsync,
  } = useEmailPreviewBatches()
  const { useFirmEmailSettingByBrokerageId } = useFirmEmailSettingsQueries()
  const { user } = useAuth()
  const { data: firmEmailSetting } = useFirmEmailSettingByBrokerageId(
    user?.brokerageId || '',
    !!user?.brokerageId
  )

  const handleGeneratePreview = async () => {
    try {
      const response = await createEmailPreviewBatchAsync({
        templateId: selectedTemplate,
        firmId: firmEmailSetting?.id || '',
        recipients: selectedRecipients,
      })

      setBatchId(response.id)
      setStep(2)
    } catch (error) {
      console.error('Error generating email preview:', error)
    }
  }

  const handleCancel = async () => {
    try {
      await deleteEmailPreviewBatchAsync(batchId!)
      navigate('/email/history')
    } catch (error) {
      console.error('Error canceling email preview:', error)
    }
  }

  const handleApprove = async () => {
    try {
      await approveEmailPreviewBatchAsync(batchId!)
      setStep(3)
    } catch (error) {
      console.error('Error approving email preview:', error)
    }
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Stepper
        activeStep={step}
        steps={['Configuration', 'Preview Batch', 'Completion']}
      />

      {step === 1 && (
        <ConfigurationStep
          onNext={handleGeneratePreview}
          selectedTemplate={selectedTemplate}
          setTemplate={setSelectedTemplate}
          selectedRecipients={selectedRecipients}
          setRecipients={setSelectedRecipients}
        />
      )}

      {step === 2 && (
        <BatchPreviewStep
          batchId={batchId!}
          onCancel={handleCancel}
          onConfirm={handleApprove}
        />
      )}

      {step === 3 && <CompletionStep />}
    </div>
  )
}

export default SendEmailWizardPage
