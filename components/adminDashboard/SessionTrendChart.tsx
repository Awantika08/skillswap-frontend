"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, TrendingUp, Activity } from "lucide-react";
import { SessionTrendData } from "@/types/adminDashboard";

interface SessionTrendsChartProps {
  data?: SessionTrendData[];
  isLoading: boolean;
}

export default function SessionTrendsChart({ data, isLoading }: SessionTrendsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[320px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Session Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[320px] text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for line chart (non-cumulative, showing daily trends)
  const chartData = data.map(item => ({
    date: item.date,
    "Total Sessions": parseInt(item.total_sessions),
    "Completed": parseInt(item.completed),
    "Cancelled": parseInt(item.cancelled),
    "Avg Duration (min)": parseInt(item.avg_duration),
  }));

  const totalSessions = chartData.reduce((sum, item) => sum + item["Total Sessions"], 0);
  const totalCompleted = chartData.reduce((sum, item) => sum + item["Completed"], 0);
  const totalCancelled = chartData.reduce((sum, item) => sum + item["Cancelled"], 0);
  const avgDuration = chartData.reduce((sum, item) => sum + item["Avg Duration (min)"], 0) / chartData.length;
  
  const completionRate = totalSessions > 0 ? (totalCompleted / totalSessions) * 100 : 0;

  // Find peak days
  const peakSessionDay = [...chartData].sort((a, b) => b["Total Sessions"] - a["Total Sessions"])[0];
  const peakCompletedDay = [...chartData].sort((a, b) => b["Completed"] - a["Completed"])[0];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary" />
              Session Performance Trends
            </CardTitle>
            <p className="text-xs text-gray-500">Daily session activity and completion rates</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-500 rounded-full" />
              <span className="font-medium">{totalSessions}</span>
              <span className="text-gray-500">Total</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-emerald-500 rounded-full" />
              <span className="font-medium">{totalCompleted}</span>
              <span className="text-gray-500">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500 rounded-full" />
              <span className="font-medium">{totalCancelled}</span>
              <span className="text-gray-500">Cancelled</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              interval={Math.floor(data.length / 8)}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="Total Sessions"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Total Sessions"
            />
            <Line
              type="monotone"
              dataKey="Completed"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Completed"
            />
            <Line
              type="monotone"
              dataKey="Cancelled"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
              name="Cancelled"
            />
            <ReferenceLine 
              y={totalSessions / chartData.length} 
              stroke="#94a3b8" 
              strokeDasharray="3 3"
              label={{ value: "Avg", position: "right", fontSize: 10 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-500">Completion Rate</p>
            <p className="text-sm font-semibold text-emerald-600">
              {completionRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Avg Duration</p>
            <p className="text-sm font-semibold text-blue-600">
              {avgDuration.toFixed(0)} min
            </p>
          </div>
          {peakSessionDay && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Peak Day</p>
              <p className="text-sm font-semibold text-purple-600">
                {new Date(peakSessionDay.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            </div>
          )}
          {peakCompletedDay && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Best Completion</p>
              <p className="text-sm font-semibold text-green-600">
                {peakCompletedDay.Completed} sessions
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}