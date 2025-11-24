import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ChartPie({ data = {} }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      data: Object.values(data),
      backgroundColor: ['#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }

  return <Pie data={chartData} options={options} />
}