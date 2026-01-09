import { ArrowRight, History, MinusCircle, PlusCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Event } from '../types'

export const ModificationDiff = ({ event }: { event: Event }) => {
  const changes = JSON.parse(event.modifiedValuesObject || '{}')
  const fieldKeys = Object.keys(changes)

  if (fieldKeys.length === 0) return null

  return (
    <div className="space-y-4 rounded-xl bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold leading-none">Modified Fields</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Reviewing {fieldKeys.length} updated attributes
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-50">Field Name</TableHead>
              <TableHead>Old Value</TableHead>
              <TableHead className="w-10"></TableHead>
              <TableHead>New Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldKeys.map((key) => {
              const { OldValue, NewValue } = changes[key]

              return (
                <TableRow key={key} className="group transition-colors">
                  <TableCell className="font-medium text-zinc-700 dark:text-zinc-300">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </TableCell>

                  <TableCell>
                    {OldValue === null ? (
                      <span className="flex items-center gap-1 text-muted-foreground italic text-xs">
                        <MinusCircle className="h-3 w-3" /> null
                      </span>
                    ) : (
                      <span className="text-red-500/80 line-through decoration-red-200">
                        {String(OldValue)}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </TableCell>

                  <TableCell>
                    {NewValue === null ? (
                      <span className="text-muted-foreground italic text-xs">
                        null
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <PlusCircle className="h-3.5 w-3.5" />
                        {String(NewValue)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
