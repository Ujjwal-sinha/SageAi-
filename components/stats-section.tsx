"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function StatsSection() {
  // API Usage Data
  const apiData = [
    { name: 'Jan', calls: 120000 },
    { name: 'Feb', calls: 145000 },
    { name: 'Mar', calls: 162000 },
    { name: 'Apr', calls: 189000 },
    { name: 'May', calls: 210000 },
    { name: 'Jun', calls: 232000 },
    { name: 'Jul', calls: 250000 },
  ];
  
  // Model Distribution Data
  const modelData = [
    { name: 'Smart Contracts', value: 35 },
    { name: 'Market Analysis', value: 25 },
    { name: 'NFT Generation', value: 15 },
    { name: 'DeFi Analytics', value: 25 },
  ];
  
  // TVL Growth Data
  const tvlData = [
    { name: 'Jan', tvl: 10 },
    { name: 'Feb', tvl: 14 },
    { name: 'Mar', tvl: 17 },
    { name: 'Apr', tvl: 21 },
    { name: 'May', tvl: 24 },
    { name: 'Jun', tvl: 28 },
    { name: 'Jul', tvl: 30 },
  ];
  
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
  
  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/30 text-blue-400 text-sm font-medium mb-4">
            Platform Metrics
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Growth & <span className="text-blue-400">Performance</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Sage AI is gaining traction with increasing adoption metrics and platform usage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API Usage Chart */}
          <Card className="bg-gray-900/50 border-gray-800 col-span-1 lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Daily API Calls</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={apiData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis 
                      tickFormatter={(tick) => `${tick/1000}k`}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="hsl(var(--chart-1))" 
                      fillOpacity={1} 
                      fill="url(#colorCalls)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Model Usage Distribution */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Model Usage Distribution</h3>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {modelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* TVL Growth */}
          <Card className="bg-gray-900/50 border-gray-800 col-span-1 lg:col-span-3">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Total Value Locked (Millions USD)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tvlData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis 
                      tickFormatter={(tick) => `$${tick}M`}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value) => [`$${value}M`, 'TVL']}
                    />
                    <Bar dataKey="tvl" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}