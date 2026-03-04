import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepperProps {
  steps: string[]
  activeStep: number
}

export function Stepper({ steps, activeStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full py-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = activeStep > stepNumber
        const isActive = activeStep === stepNumber

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center relative">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 bg-white',
                  isCompleted
                    ? 'bg-sky-600 border-sky-600 text-white'
                    : isActive
                      ? 'border-sky-600 text-sky-600 ring-4 ring-sky-50'
                      : 'border-slate-300 text-slate-400'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>

              <span
                className={cn(
                  'absolute -bottom-10 text-sm font-medium uppercase tracking-wider whitespace-nowrap',
                  isActive ? 'text-sky-600 font-bold' : 'text-slate-500'
                )}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="w-32 h-0.5 mx-2 bg-slate-200 relative overflow-hidden">
                <div
                  className={cn(
                    'absolute top-0 left-0 h-full bg-sky-600 transition-all duration-500',
                    isCompleted ? 'w-full' : 'w-0'
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
