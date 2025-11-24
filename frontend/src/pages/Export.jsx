import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import api from '../api/api'
import '../Export.css'

export default function Export() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    loadActivities()
  }, [])

  async function loadActivities() {
    try {
      const res = await api.get('/activities')
      setActivities(res.data || [])
    } catch (err) {
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  function downloadCSV() {
    const headers = ['Date', 'Category', 'Description', 'Carbon Footprint (kg)']
    const csvContent = [
      headers.join(','),
      ...activities.map(a => [
        a.date,
        a.category,
        `"${a.description}"`,
        a.carbonFootprint
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'carbon-tracker-data.csv'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('CSV downloaded!')
  }

  async function downloadPDF() {
    const element = document.getElementById('pdf-content')
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF()
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save('carbon-tracker-summary.pdf')
    toast.success('PDF downloaded!')
  }

  function downloadMonthlyReport() {
    const monthActivities = activities.filter(a => a.date.startsWith(selectedMonth))
    const total = monthActivities.reduce((s, a) => s + a.carbonFootprint, 0)
    const categories = monthActivities.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + a.carbonFootprint
      return acc
    }, {})

    const reportContent = [
      `Monthly Carbon Footprint Report - ${selectedMonth}`,
      `Generated on: ${new Date().toLocaleDateString()}`,
      '',
      `Total Emissions: ${total.toFixed(2)} kg CO₂`,
      `Number of Activities: ${monthActivities.length}`,
      `Average per Day: ${(total / new Date(selectedMonth + '-01').getDate()).toFixed(2)} kg CO₂`,
      '',
      'Category Breakdown:',
      ...Object.entries(categories).map(([cat, amount]) => 
        `${cat}: ${amount.toFixed(2)} kg CO₂ (${((amount/total)*100).toFixed(1)}%)`
      ),
      '',
      'Activities:',
      'Date,Category,Description,Carbon Footprint (kg)',
      ...monthActivities.map(a => `${a.date},${a.category},"${a.description}",${a.carbonFootprint}`)
    ].join('\n')

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `carbon-report-${selectedMonth}.txt`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Monthly report downloaded!')
  }

  const total = activities.reduce((s, a) => s + a.carbonFootprint, 0)
  const categories = activities.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + a.carbonFootprint
    return acc
  }, {})

  if (loading) return <div className="export-container">Loading...</div>

  return (
    <div className="export-container">
      <div className="export-header">
        <h1>Export Data</h1>
        <p>Download your carbon footprint data in various formats</p>
      </div>

      <div className="export-grid">
        <div className="export-card">
          <div className="export-icon">📊</div>
          <h3>CSV Export</h3>
          <p>Download all your activities as a CSV file for analysis in Excel or other tools</p>
          <button onClick={downloadCSV} className="export-btn">
            Download CSV
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon">📄</div>
          <h3>PDF Summary</h3>
          <p>Generate a comprehensive PDF report with charts and statistics</p>
          <button onClick={downloadPDF} className="export-btn">
            Download PDF
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon">📅</div>
          <h3>Monthly Report</h3>
          <p>Get a detailed monthly breakdown with category analysis</p>
          <div className="month-selector">
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="month-input"
            />
          </div>
          <button onClick={downloadMonthlyReport} className="export-btn">
            Download Report
          </button>
        </div>
      </div>

      <div id="pdf-content" className="pdf-content">
        <div className="pdf-header">
          <h2>Carbon Footprint Summary</h2>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="pdf-stats">
          <div className="pdf-stat">
            <h3>Total Emissions</h3>
            <div className="stat-value">{total.toFixed(2)} kg CO₂</div>
          </div>
          <div className="pdf-stat">
            <h3>Total Activities</h3>
            <div className="stat-value">{activities.length}</div>
          </div>
          <div className="pdf-stat">
            <h3>Average per Activity</h3>
            <div className="stat-value">{activities.length ? (total/activities.length).toFixed(2) : 0} kg CO₂</div>
          </div>
        </div>

        <div className="pdf-categories">
          <h3>Category Breakdown</h3>
          {Object.entries(categories).map(([category, amount]) => (
            <div key={category} className="category-row">
              <span>{category}</span>
              <span>{amount.toFixed(2)} kg CO₂</span>
            </div>
          ))}
        </div>

        <div className="pdf-activities">
          <h3>Recent Activities</h3>
          {activities.slice(0, 10).map(activity => (
            <div key={activity.id} className="activity-row">
              <span>{activity.date}</span>
              <span>{activity.category}</span>
              <span>{activity.description}</span>
              <span>{activity.carbonFootprint.toFixed(2)} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}