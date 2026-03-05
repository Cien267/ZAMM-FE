import { useState } from 'react'
import type { CreateRecipientInput } from '../types'
import { ConfigurationStep } from '../components/ConfigurationStep'
import { BatchPreviewStep } from '../components/BatchPreviewStep'
import { Stepper } from '../components/Stepper'
import { useEmailPreviewBatches } from '../hooks/useEmailPreviewBatches'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useFirmEmailSettingsQueries } from '@/features/email/firm-settings/hooks/useFirmEmailSettingsQueries'

export const SendEmailWizardPage = () => {
  const [step, setStep] = useState(1)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedRecipients, setSelectedRecipients] = useState<
    CreateRecipientInput[]
  >([])

  const { createEmailPreviewBatchAsync } = useEmailPreviewBatches()
  const { useFirmEmailSettingByBrokerageId } = useFirmEmailSettingsQueries()
  const { user } = useAuth()
  const { data: firmEmailSetting } = useFirmEmailSettingByBrokerageId(
    user?.brokerageId || '',
    !!user?.brokerageId
  )

  const handleGeneratePreview = async () => {
    const response = await createEmailPreviewBatchAsync({
      templateId: selectedTemplate,
      firmId: firmEmailSetting?.id || '',
      recipients: selectedRecipients,
    })

    setBatchId(response.id)
    setStep(2)
  }

  // // 2. Logic to final approve
  const handleApprove = async () => {
    // await api.post(`/api/email-preview-batch/${batchId}/approve`)
    setStep(3)
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
          onBack={() => setStep(1)}
          onConfirm={handleApprove}
        />
      )}

      {/*{step === 3 && (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="rounded-full bg-green-100 p-3 text-green-600">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-xl font-bold">Campaign Queued!</h3>
          <p className="text-muted-foreground text-center">
            Your emails are being processed in the background. <br />
            You can monitor the status in the History table.
          </p>
          <Button onClick={() => onOpenChange(false)}>Close Wizard</Button>
        </div>
      )} */}
    </div>
  )
}

export default SendEmailWizardPage
