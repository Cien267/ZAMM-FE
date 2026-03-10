import { useState } from 'react'
import { useEmailPreviewBatchQueries } from '../hooks/useEmailPreviewBatchesQueries'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BatchPreviewProps {
  batchId: string
  onCancel: () => void
  onConfirm: () => void
}
export const BatchPreviewStep = ({
  batchId,
  onCancel,
  onConfirm,
}: BatchPreviewProps) => {
  const { useEmailPreviewBatch } = useEmailPreviewBatchQueries()
  const { data: batch, isLoading } = useEmailPreviewBatch(
    batchId || '',
    !!batchId
  )

  const [activeIndex, setActiveIndex] = useState(0)

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    )

  const currentItem = batch?.items[activeIndex]

  return (
    <div className="grid grid-cols-12 gap-4 mt-18">
      <div className="col-span-3 border rounded-md overflow-y-auto">
        {batch?.items.map((item, idx) => (
          <div
            key={item.id}
            className={`p-3 cursor-pointer border-b hover:bg-slate-50 ${activeIndex === idx ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            onClick={() => setActiveIndex(idx)}
          >
            <p className="text-sm font-semibold truncate">
              {item.recipientEmail}
            </p>
          </div>
        ))}
      </div>

      <div className="col-span-9 flex flex-col border rounded-md bg-white">
        <div className="flex flex-col h-full space-y-2">
          <div className="flex-1 bg-white shadow-inner overflow-hidden flex flex-col">
            <div className="bg-slate-100 p-2 border-b flex justify-between">
              <div className="flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              <span className="text-sm">
                Subject:{' '}
                <strong className="text-slate-700">
                  {currentItem?.subjectRendered}
                </strong>
              </span>
            </div>
            <iframe
              title="Email Preview"
              className="w-full h-200 max-h-200"
              srcDoc={currentItem?.bodyHtmlRendered}
              sandbox="allow-popups"
            />
          </div>
        </div>
      </div>
      <div className="p-4 flex justify-end gap-2 col-span-12">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="sky">
          Approve & Send Mails
        </Button>
      </div>
    </div>
  )
}
