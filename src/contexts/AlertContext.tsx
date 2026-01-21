import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'

type AlertOptions = {
  title?: string
  description: string | ReactNode
  cancelText?: string
  confirmText?: string
  showReasonInput?: boolean
  onConfirm: () => Promise<void> | void
  onSuccess?: (reason: string) => Promise<void> | void
}

type AlertContextType = {
  openAlert: (options: AlertOptions) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<AlertOptions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState('')

  const openAlert = (options: AlertOptions) => {
    setConfig(options)
    setReason('')
    setIsOpen(true)
  }

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (config?.onConfirm) {
      setIsLoading(true)
      try {
        await config.onConfirm()

        if (config.showReasonInput && config.onSuccess) {
          await config.onSuccess(reason)
        }
        setIsOpen(false)
      } catch (error) {
        console.error('Action failed', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <AlertContext.Provider value={{ openAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {config?.title || 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {config?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {config?.showReasonInput && (
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">
                Reason for deletion
              </label>
              <Textarea
                placeholder="Why are you deleting this?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {config?.cancelText || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading || (config?.showReasonInput && reason === '')}
              className="bg-destructive text-destructive-foreground! hover:bg-destructive/90"
            >
              {isLoading ? 'Processing...' : config?.confirmText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlert must be used within AlertProvider')
  return context
}
