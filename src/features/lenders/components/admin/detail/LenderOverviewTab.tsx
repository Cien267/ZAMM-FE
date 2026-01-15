import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Lender } from '../../../types'
import { Landmark } from 'lucide-react'

interface LenderOverviewTabProps {
  lender: Lender
}

export const LenderOverviewTab = ({ lender }: LenderOverviewTabProps) => {
  return (
    <div className="flex justify-between gap-10">
      <div className="space-y-6 w-3/4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="h-5 w-5" />
                Lender Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-sm">{lender.name || '-'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Logo
                  </p>
                  <div className="flex items-center gap-2">
                    {lender.logoUrl ? (
                      <div className="h-20 w-32 flex items-center justify-center">
                        <img
                          src={lender.logoUrl}
                          alt={`${lender.name} logo`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
