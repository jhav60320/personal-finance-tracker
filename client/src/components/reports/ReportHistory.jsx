import PropTypes from 'prop-types'

function ReportHistory({ reports, loading }) {
  if (loading) return <div>Loading reports...</div>
  if (reports.length === 0) return <div>No reports available</div>

  const formatMonthYear = (month, year) => {
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overbudget</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={`${report.month}-${report.year}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatMonthYear(report.month, report.year)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{report.total_spent.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.top_category || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.overbudget_categories?.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {report.overbudget_categories.map((cat) => (
                        <li key={cat.category}>
                          {cat.category} (₹{cat.spent.toFixed(2)} / ₹{cat.limit.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'None'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}

ReportHistory.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      total_spent: PropTypes.number.isRequired,
      top_category: PropTypes.string,
      overbudget_categories: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string.isRequired,
          spent: PropTypes.number.isRequired,
          limit: PropTypes.number.isRequired,
        })
      ),
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
}

export default ReportHistory

// This file is part of a personal finance tracker application.
// It displays a history of financial reports, showing total spending, top categories, and overbudget