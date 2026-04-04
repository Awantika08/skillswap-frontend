"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, Calendar } from "lucide-react";
import { UserGrowthData } from "@/types/adminDashboard";

interface UserGrowthChartProps {
  data?: UserGrowthData[];
  isLoading: boolean;
}

export default function UserGrowthChart({ data, isLoading }: UserGrowthChartProps) {
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
            <Users className="h-4 w-4 text-primary" />
            User Growth
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

  // Calculate cumulative totals for better visualization
  let cumulativeUsers = 0;
  let cumulativeMentors = 0;
  let cumulativeLearners = 0;
  
  const chartData = data.map(item => {
    cumulativeUsers += parseInt(item.new_users);
    cumulativeMentors += parseInt(item.new_mentors);
    cumulativeLearners += parseInt(item.new_learners);
    
    return {
      date: item.date,
      "Total Users": cumulativeUsers,
      "Mentors": cumulativeMentors,
      "Learners": cumulativeLearners,
      "New Users": parseInt(item.new_users),
    };
  });

  const totalUsers = chartData[chartData.length - 1]?.["Total Users"] || 0;
  const totalMentors = chartData[chartData.length - 1]?.["Mentors"] || 0;
  const totalLearners = chartData[chartData.length - 1]?.["Learners"] || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              User Growth Analytics
            </CardTitle>
            <p className="text-xs text-gray-500">Cumulative user registrations over time</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-medium">{totalUsers}</span>
              <span className="text-gray-500">Total Users</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="font-medium">{totalMentors}</span>
              <span className="text-gray-500">Mentors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="font-medium">{totalLearners}</span>
              <span className="text-gray-500">Learners</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotalUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMentors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLearners" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              interval={Math.floor(data.length / 10)}
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
              formatter={(value: any, name: string) => {
                if (name === "New Users") return [`${value}`, "New Registrations"];
                return [`${value}`, name];
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="Total Users"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorTotalUsers)"
              name="Total Users"
            />
            <Area
              type="monotone"
              dataKey="Mentors"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorMentors)"
              name="Mentors"
            />
            <Area
              type="monotone"
              dataKey="Learners"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorLearners)"
              name="Learners"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <p className="text-xs text-gray-500">Peak New Users</p>
            <p className="text-sm font-semibold text-blue-600">
              {Math.max(...data.map(d => parseInt(d.new_users)))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Avg Daily Growth</p>
            <p className="text-sm font-semibold text-purple-600">
              {(totalUsers / data.length).toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Growth Rate</p>
            <p className="text-sm font-semibold text-green-600">
              {totalUsers > 0 ? ((totalUsers / (totalUsers - totalMentors - totalLearners || 1)) * 100).toFixed(0) : 0}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}