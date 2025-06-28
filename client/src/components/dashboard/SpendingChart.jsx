import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import PropTypes from 'prop-types'

ChartJS.register(ArcElement, Tooltip, Legend)

function SpendingChart({ data }) {
  const chartData = {
    labels: data?.categorySpending?.map(item => item._id) || [],
    datasets: [
      {
        data: data?.categorySpending?.map(item => item.total) || [],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899'
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Category-wise Spending</h3>
      <div className="h-64">
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  )
}
SpendingChart.propTypes = {
  data: PropTypes.shape({
    categorySpending: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        total: PropTypes.number
      })
    )
  })
}

export default SpendingChart
// SpendingChart.jsx
// This component renders a pie chart showing spending by category.