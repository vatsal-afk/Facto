//DO NOT MODIFY THIS AS THIS CONTAINS CODE FOR THE GRAPH ELEMENT

"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', misinformation: 4000, factualNews: 2400 },
  { name: 'Feb', misinformation: 3000, factualNews: 1398 },
  { name: 'Mar', misinformation: 2000, factualNews: 9800 },
  { name: 'Apr', misinformation: 2780, factualNews: 3908 },
  { name: 'May', misinformation: 1890, factualNews: 4800 },
  { name: 'Jun', misinformation: 2390, factualNews: 3800 },
]

export default function Graph() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Trend Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="misinformation" stroke="#8884d8" />
          <Line type="monotone" dataKey="factualNews" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}