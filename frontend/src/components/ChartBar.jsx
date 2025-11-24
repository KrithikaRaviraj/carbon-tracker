import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ChartBar({ data = [] }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'kg CO₂',
      data: data.map(d => d.total),
      backgroundColor: isDark ? '#60a5fa' : '#1e293b',
      borderRadius: 6,
      borderSkipped: false
    }]
  }

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { 
      y: { 
        beginAtZero: true,
        ticks: { color: isDark ? '#cbd5e1' : '#64748b' },
        grid: { color: isDark ? '#334155' : '#e2e8f0' }
      },
      x: {
        ticks: { color: isDark ? '#cbd5e1' : '#64748b' },
        grid: { color: isDark ? '#334155' : '#e2e8f0' }
      }
    }
  }

  return <Bar data={chartData} options={options} />
}