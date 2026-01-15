import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import {
  PEOPLE_COLUMNS,
  COMPANY_COLUMNS,
  ASSET_COLUMNS,
  LIABILITY_COLUMNS,
} from '@/constants/export'
import type { ExportSettings } from '@/types'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (settings: ExportSettings) => Promise<void>
  defaultFileName?: string
}

export const ExportModal = ({
  open,
  onOpenChange,
  onExport,
  defaultFileName = 'report',
}: ExportModalProps) => {
  const [isExporting, setIsExporting] = useState(false)
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'excel',
    entities: {
      people: true,
      companies: true,
      assets: true,
      liabilities: true,
    },
    columns: {
      people: PEOPLE_COLUMNS.map((c) => c.key),
      companies: COMPANY_COLUMNS.map((c) => c.key),
      assets: ASSET_COLUMNS.map((c) => c.key),
      liabilities: LIABILITY_COLUMNS.map((c) => c.key),
    },
    includeHeaders: true,
    fileName: defaultFileName,
  })

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport(settings)
      onOpenChange(false)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const toggleEntity = (entity: keyof ExportSettings['entities']) => {
    setSettings((prev) => ({
      ...prev,
      entities: { ...prev.entities, [entity]: !prev.entities[entity] },
    }))
  }

  const toggleColumn = (
    entity: keyof ExportSettings['columns'],
    column: string
  ) => {
    setSettings((prev) => {
      const columns = prev.columns[entity]
      const newColumns = columns.includes(column)
        ? columns.filter((c) => c !== column)
        : [...columns, column]
      return {
        ...prev,
        columns: { ...prev.columns, [entity]: newColumns },
      }
    })
  }

  const selectAllColumns = (entity: keyof ExportSettings['columns']) => {
    const allColumns =
      entity === 'people'
        ? PEOPLE_COLUMNS.map((c) => c.key)
        : entity === 'companies'
          ? COMPANY_COLUMNS.map((c) => c.key)
          : entity === 'assets'
            ? ASSET_COLUMNS.map((c) => c.key)
            : LIABILITY_COLUMNS.map((c) => c.key)

    setSettings((prev) => ({
      ...prev,
      columns: { ...prev.columns, [entity]: allColumns },
    }))
  }

  const deselectAllColumns = (entity: keyof ExportSettings['columns']) => {
    setSettings((prev) => ({
      ...prev,
      columns: { ...prev.columns, [entity]: [] },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl! max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Report
          </DialogTitle>
          <DialogDescription>
            Customize your export settings and download the report
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-125 pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>File Name</Label>
              <Input
                value={settings.fileName}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, fileName: e.target.value }))
                }
                placeholder="Enter file name"
              />
            </div>

            <div className="space-y-3">
              <Label>Export Format</Label>
              <RadioGroup
                value={settings.format}
                onValueChange={(value: any) =>
                  setSettings((prev) => ({ ...prev, format: value }))
                }
                className="grid grid-cols-3 gap-4 w-2/3"
              >
                <RadioGroupItem
                  value="excel"
                  id="excel"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, format: 'excel' }))
                  }
                >
                  <Label htmlFor="excel" className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    Excel
                  </Label>
                </RadioGroupItem>

                <RadioGroupItem
                  value="csv"
                  id="csv"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, format: 'csv' }))
                  }
                >
                  <Label htmlFor="csv" className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                    CSV
                  </Label>
                </RadioGroupItem>

                <RadioGroupItem
                  value="pdf"
                  id="pdf"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, format: 'pdf' }))
                  }
                >
                  <Label htmlFor="pdf" className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 text-orange-600" />
                    PDF
                  </Label>
                </RadioGroupItem>
              </RadioGroup>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={settings.includeHeaders}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    includeHeaders: checked as boolean,
                  }))
                }
                id="headers"
              />
              <Label htmlFor="headers" className="cursor-pointer">
                Include column headers
              </Label>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base">Include Data</Label>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={settings.entities.people}
                      onCheckedChange={() => toggleEntity('people')}
                      id="people"
                    />
                    <Label
                      htmlFor="people"
                      className="cursor-pointer font-medium"
                    >
                      People ({PEOPLE_COLUMNS.length} columns)
                    </Label>
                  </div>
                  {settings.entities.people && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllColumns('people')}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deselectAllColumns('people')}
                      >
                        Deselect All
                      </Button>
                    </div>
                  )}
                </div>

                {settings.entities.people && (
                  <div className="ml-6 grid grid-cols-4 gap-2">
                    {PEOPLE_COLUMNS.map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={settings.columns.people.includes(col.key)}
                          onCheckedChange={() =>
                            toggleColumn('people', col.key)
                          }
                          id={`people-${col.key}`}
                        />
                        <Label
                          htmlFor={`people-${col.key}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {col.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={settings.entities.companies}
                      onCheckedChange={() => toggleEntity('companies')}
                      id="companies"
                    />
                    <Label
                      htmlFor="companies"
                      className="cursor-pointer font-medium"
                    >
                      Companies ({COMPANY_COLUMNS.length} columns)
                    </Label>
                  </div>
                  {settings.entities.companies && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllColumns('companies')}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deselectAllColumns('companies')}
                      >
                        Deselect All
                      </Button>
                    </div>
                  )}
                </div>

                {settings.entities.companies && (
                  <div className="ml-6 grid grid-cols-4 gap-2">
                    {COMPANY_COLUMNS.map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={settings.columns.companies.includes(col.key)}
                          onCheckedChange={() =>
                            toggleColumn('companies', col.key)
                          }
                          id={`companies-${col.key}`}
                        />
                        <Label
                          htmlFor={`companies-${col.key}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {col.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={settings.entities.assets}
                      onCheckedChange={() => toggleEntity('assets')}
                      id="assets"
                    />
                    <Label
                      htmlFor="assets"
                      className="cursor-pointer font-medium"
                    >
                      Assets ({ASSET_COLUMNS.length} columns)
                    </Label>
                  </div>
                  {settings.entities.assets && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllColumns('assets')}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deselectAllColumns('assets')}
                      >
                        Deselect All
                      </Button>
                    </div>
                  )}
                </div>

                {settings.entities.assets && (
                  <div className="ml-6 grid grid-cols-4 gap-2">
                    {ASSET_COLUMNS.map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={settings.columns.assets.includes(col.key)}
                          onCheckedChange={() =>
                            toggleColumn('assets', col.key)
                          }
                          id={`assets-${col.key}`}
                        />
                        <Label
                          htmlFor={`assets-${col.key}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {col.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={settings.entities.liabilities}
                      onCheckedChange={() => toggleEntity('liabilities')}
                      id="liabilities"
                    />
                    <Label
                      htmlFor="liabilities"
                      className="cursor-pointer font-medium"
                    >
                      Liabilities ({LIABILITY_COLUMNS.length} columns)
                    </Label>
                  </div>
                  {settings.entities.liabilities && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectAllColumns('liabilities')}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deselectAllColumns('liabilities')}
                      >
                        Deselect All
                      </Button>
                    </div>
                  )}
                </div>

                {settings.entities.liabilities && (
                  <div className="ml-6 grid grid-cols-4 gap-2">
                    {LIABILITY_COLUMNS.map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={settings.columns.liabilities.includes(
                            col.key
                          )}
                          onCheckedChange={() =>
                            toggleColumn('liabilities', col.key)
                          }
                          id={`liabilities-${col.key}`}
                        />
                        <Label
                          htmlFor={`liabilities-${col.key}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {col.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting} variant={'sky'}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
