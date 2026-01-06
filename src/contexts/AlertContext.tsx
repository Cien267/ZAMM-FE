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

type AlertOptions = {
  title?: string
  description: string | ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm: () => Promise<void> | void
}

type AlertContextType = {
  openAlert: (options: AlertOptions) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<AlertOptions | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openAlert = (options: AlertOptions) => {
    setConfig(options)
    setIsOpen(true)
  }

  const handleConfirm = async () => {
    if (config?.onConfirm) {
      setIsLoading(true)
      await config.onConfirm()
      setIsLoading(false)
    }
    setIsOpen(false)
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
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {config?.cancelText || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
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
