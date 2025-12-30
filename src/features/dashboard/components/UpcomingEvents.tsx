import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { useDashboardData } from "../hooks/useDashboardData"
import { EVENT_STATUS } from "../../events/constants"

export const UpcomingEvents: React.FC = () => {
  const { upcomingEventQuery } = useDashboardData()
  const { data: events, error, isLoading } = upcomingEventQuery
  const [filterDays, setFilterDays] = useState<30 | 60 | 90>(30)
  const [showDismissed, setShowDismissed] = useState(false)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!events) return <div>No data</div>

  const filteredEvents = events.filter((event) => {
    if (!showDismissed && event.status === EVENT_STATUS.DISMISSED) return false
    return true
  })

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Upcoming Events
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted p-1 rounded-md">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => setFilterDays(days as any)}
                className={`text-xs px-3 py-1 rounded-sm transition-all ${
                  filterDays === days
                    ? "bg-background shadow text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>

          <Button
            variant={showDismissed ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowDismissed(!showDismissed)}
            className="h-8 text-xs"
          >
            {showDismissed ? "Hide Dismissed" : "Show Dismissed"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Calendar className="h-10 w-10 mb-3 opacity-20" />
            <p>No upcoming events for the selected period.</p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground uppercase text-xs">
                    Client
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground uppercase text-xs">
                    Details
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground uppercase text-xs">
                    Date
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground uppercase text-xs">
                    Broker
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground uppercase text-xs text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle font-medium text-blue-500">
                      {event.client?.name}
                    </td>
                    <td className="p-4 align-middle">{event.details}</td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {event.date}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {event.broker.name}
                    </td>
                    <td className="p-4 align-middle text-right">
                      {event.status === EVENT_STATUS.DISMISSED ? (
                        <Badge variant="secondary" className="text-xs">
                          Dismissed
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          Active
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
