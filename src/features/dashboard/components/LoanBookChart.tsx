import { useAllLiabilities } from '@/hooks/useSharedData'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { CartesianGrid, XAxis, YAxis, Area, AreaChart } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { Liability } from '@/features/liabilities/types'
import { formatDate } from '@/lib/utils'

const processData = (rawItems: Liability[]) => {
  const validAmountItems = rawItems.filter(
    (item) => item.amount !== null && item.amount !== undefined
  )

  const sortedData = validAmountItems.sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0
    if (!a.startDate) return -1
    if (!b.startDate) return 1

    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })

  let runningTotal = 0

  return sortedData.map((item) => {
    runningTotal += item.amount ?? 0

    return {
      date: item.startDate
        ? formatDate(new Date(item.startDate))
        : 'Initial Balance',
      cumulativeAmount: runningTotal,
      currentAmount: item.amount,
      name: item.name,
    }
  })
}

const chartConfig = {
  cumulativeAmount: {
    label: 'Total Liability ',
    color: '#475569',
  },
} satisfies ChartConfig

export const LoanBookChart = () => {
  const {
    data: liabilitiesData,
    isLoading,
    error,
    refetch,
  } = useAllLiabilities()

  if (isLoading) {
    return <Skeleton className="h-94 w-full" />
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  const chartData = processData(liabilitiesData || [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Liability Over Time</CardTitle>
        <CardDescription>
          Summary of total debt starting from the earliest liability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-9/4 w-full max-h-100"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 10,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cumulativeAmount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cumulativeAmount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="cumulativeAmount"
              type="monotone"
              fill="url(#fillAmount)"
              fillOpacity={0.4}
              stroke="var(--color-cumulativeAmount)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
