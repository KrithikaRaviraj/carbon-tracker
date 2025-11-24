import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function ChartLine({ data = [] }){
  // data expected: [{date: '2025-11-16', total: 12.5}, ...]
  const labels = data.map(d=>d.date)
  const values = data.map(d=>d.total)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'kg CO2',
        data: values,
        tension: 0.3,
        fill: false,
        borderColor: '#1e293b',
        backgroundColor: '#1e293b',
        pointBackgroundColor: '#1e293b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        borderWidth: 3
      }
    ]
  }

  const options = { responsive: true, plugins: { legend: { display: false } } }

  return <Line data={chartData} options={options} />
}