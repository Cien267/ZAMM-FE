import { useState, useMemo, useEffect } from 'react'
import { useAllLenders } from '@/hooks/useSharedData'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const InterestRateChart = () => {
  const {
    data: lenderData,
    isLoading: isLoadingLenders,
    error,
    refetch,
  } = useAllLenders()

  const lenders = useMemo(() => lenderData?.data || [], [lenderData])
  const [selectedLenders, setSelectedLenders] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('highest')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedLenders(lenders.map((l) => l.id))
  }, [lenders])

  const colors = useMemo(
    () => [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#00A36C',
      '#3498DB',
      '#F1C40F',
      '#1ABC9C',
      '#9B59B6',
      '#E67E22',
      '#27AE60',
      '#4D96FF',
      '#FFE066',
      '#63E6BE',
      '#B197FC',
      '#FFA94D',
      '#38D9A9',
      '#228BE6',
      '#FCC419',
    ],
    []
  )

  const chartData = useMemo(() => {
    const flattened = lenders
      .filter((lender) => selectedLenders.includes(lender.id))
      .flatMap((lender, lIndex) =>
        (lender.loans || []).flatMap((loan) =>
          (loan.interestRates || []).map((rate) => ({
            id: `${lender.id}-${loan.id}-${rate.rateType}`,
            lenderName: lender.name,
            loanName: loan.name,
            rate: rate.rate,
            rateType: rate.rateType,
            label: `${lender.name} - ${loan.name} (${rate.rateType})`,
            color: colors[lIndex % colors.length],
          }))
        )
      )

    return flattened.sort((a, b) => {
      if (sortBy === 'highest') {
        return b.rate - a.rate
      } else if (sortBy === 'lowest') {
        return a.rate - b.rate
      } else if (sortBy === 'alphabetical') {
        return a.lenderName.localeCompare(b.lenderName)
      }
      return 0
    })
  }, [lenders, selectedLenders, sortBy, colors])

  const chartHeight = Math.max(400, chartData.length * 35)

  if (isLoadingLenders) {
    return <Skeleton className="h-94 w-full" />
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interest Rates</CardTitle>
        <CardDescription>
          Comparative breakdown of current interest rates by lender and loan
          product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-45 mb-6">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="highest">Highest to lowest</SelectItem>
            <SelectItem value="lowest">Lowest to highest</SelectItem>
            <SelectItem value="alphabetical">Lender (A-Z)</SelectItem>
          </SelectContent>
        </Select>
        <div className="mb-5 flex gap-3 flex-wrap">
          {lenders.map((l) => (
            <Button
              key={l.id}
              variant="outline"
              size="sm"
              onClick={() =>
                setSelectedLenders((prev) =>
                  prev.includes(l.id)
                    ? prev.filter((id) => id !== l.id)
                    : [...prev, l.id]
                )
              }
              className={`h-9 rounded-full border px-4 transition-all ${
                selectedLenders.includes(l.id)
                  ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <img
                src={l.logoUrl}
                alt=""
                className="mr-2 h-4 w-4 rounded-full object-contain bg-white"
              />
              <span className="text-xs font-medium">{l.name}</span>
            </Button>
          ))}
        </div>

        <div
          style={{
            height: '600px',
            overflowY: 'auto',
            border: '1px solid #f3f4f6',
          }}
        >
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" domain={[0, 10]} hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={140}
                  fontSize={11}
                  tick={{ fill: '#374151' }}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      const d = payload[0].payload
                      return (
                        <div
                          style={{
                            background: '#1f2937',
                            color: '#fff',
                            padding: '12px',
                            borderRadius: '8px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#e6e6e6',
                              fontWeight: 'bold',
                            }}
                          >
                            {d.lenderName}
                          </div>
                          <div style={{ fontWeight: 'bold' }}>{d.loanName}</div>
                          <div
                            style={{
                              color: d.color,
                              fontSize: '18px',
                              fontWeight: 'bold',
                            }}
                          >
                            {d.rate}%
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
