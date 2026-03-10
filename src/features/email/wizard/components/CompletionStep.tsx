import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export const CompletionStep = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 mt-18">
      <div className="rounded-full bg-green-100 p-3 text-green-600">
        <CheckCircle2 size={48} />
      </div>
      <h3 className="text-xl font-bold">Campaign Queued!</h3>
      <p className="text-muted-foreground text-center">
        Your emails are being processed in the background. <br />
        You can monitor the status in the History table.
      </p>
      <Button
        variant="sky"
        className="mt-10"
        onClick={() => navigate('/email/history')}
      >
        <ArrowLeft /> Back to history
      </Button>
    </div>
  )
}
