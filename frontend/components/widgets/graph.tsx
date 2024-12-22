"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', factChecks: 4000, fakeNews: 2400 },
  { name: 'Feb', factChecks: 3000, fakeNews: 1398 },
  { name: 'Mar', factChecks: 2000, fakeNews: 9800 },
  { name: 'Apr', factChecks: 2780, fakeNews: 3908 },
  { name: 'May', factChecks: 1890, fakeNews: 4800 },
  { name: 'Jun', factChecks: 2390, fakeNews: 3800 },
]

export default function Graph() {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-teal-500 text-white">
        <CardTitle className="text-lg font-semibold">Fact Checks vs. Fake News Trends</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="factChecks" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="fakeNews" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

