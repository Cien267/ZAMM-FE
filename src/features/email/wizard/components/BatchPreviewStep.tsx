export const BatchPreviewStep = ({ batchId, onBack, onConfirm }) => {
  const { data: batch, isLoading } = useQuery(['preview', batchId], () =>
    fetchBatch(batchId)
  )
  const [activeIndex, setActiveIndex] = useState(0)

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    )

  const currentItem = batch.items[activeIndex]

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Sidebar: Recipient List */}
      <div className="col-span-3 border rounded-md overflow-y-auto">
        {batch.items.map((item, idx) => (
          <div
            key={item.id}
            className={`p-3 cursor-pointer border-b last:border-0 hover:bg-slate-50 ${activeIndex === idx ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            onClick={() => setActiveIndex(idx)}
          >
            <p className="text-sm font-semibold truncate">
              {item.recipientEmail}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content: Iframe Preview */}
      <div className="col-span-9 flex flex-col border rounded-md bg-white">
        <div className="p-3 border-b bg-slate-50 flex justify-between items-center text-xs">
          <span>
            Subject:{' '}
            <strong className="text-slate-700">
              {currentItem.subjectRendered}
            </strong>
          </span>
          <Badge variant="outline">Preview Mode</Badge>
        </div>
        <iframe
          srcDoc={currentItem.bodyHtmlRendered}
          className="flex-1 w-full border-none"
          sandbox="allow-popups"
        />
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="ghost" onClick={onBack}>
            Back to Edit
          </Button>
          <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700">
            Approve & Send All
          </Button>
        </div>
      </div>
    </div>
  )
}
