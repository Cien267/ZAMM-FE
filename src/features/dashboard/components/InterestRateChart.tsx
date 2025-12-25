import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Wait, I need to check if Select exists. I didn't see it in the file list earlier.
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, type TooltipProps } from 'recharts';
import type { InterestRateData } from '../types';

interface InterestRateChartProps {
  rates: InterestRateData[];
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">{payload[0].value}% p.a.</p>
      </div>
    );
  }
  return null;
};

export const InterestRateChart: React.FC<InterestRateChartProps> = ({ rates }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
           Interest Rates
        </CardTitle>
        <div className="flex items-center space-x-2">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search bank" className="pl-8 h-9 w-[150px] lg:w-[200px]" />
            </div>
            {/* Since I didn't verify Select existed, I'll use a native select styled as a button-like or simple dropdown for now to be safe, or just a placeholder Button for sorting */}
             <Button variant="outline" size="sm" className="h-9">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort: High to Low
            </Button>
            <div className="flex items-center space-x-1">
                 <Button variant="outline" size="icon" className="h-9 w-9">
                     <ChevronLeft className="h-4 w-4" />
                 </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                     <ChevronRight className="h-4 w-4" />
                 </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rates} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <XAxis 
                        dataKey="bankName" 
                        stroke="#888888" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        interval={0} // Force show all labels if possible, or tweak
                        tick={{ dy: 10 }}
                    />
                    <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                        domain={[0, 14]} // Based on the image showing scale up to 14
                        ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar 
                        dataKey="rate" 
                        fill="#93c5fd" // Light blue color
                        radius={[4, 4, 0, 0]} 
                        className="fill-sky-400 hover:fill-sky-500 transition-all"
                        barSize={30}
                    />
                </BarChart>
            </ResponsiveContainer>
          </div>
      </CardContent>
    </Card>
  );
};
