import { useSelector } from 'react-redux'

function BudgetAlerts() {
  const { expenses, budgets } = useSelector((state) => ({
    expenses: state.expense.expenses,
    budgets: state.budget.budgets
  }))

  // Calculate budget alerts
  const getBudgetAlerts = () => {
    if (!budgets.length || !expenses.length) return []

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const startOfMonth = new Date(currentYear, currentMonth, 1)
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0)

    return budgets.map((budget) => {
      const categoryExpenses = expenses.filter(
        (expense) =>
          expense.category === budget.category &&
          new Date(expense.date) >= startOfMonth &&
          new Date(expense.date) <= endOfMonth
      )

      const totalSpent = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      )

      const percentage = (totalSpent / budget.limit) * 100

      if (totalSpent > budget.limit) {
        return {
          category: budget.category,
          message: `Budget exceeded by ₹${(totalSpent - budget.limit).toFixed(2)}`,
          type: 'error'
        }
      } else if (percentage > 80) {
        return {
          category: budget.category,
          message: `Budget warning: ${percentage.toFixed(0)}% used`,
          type: 'warning'
        }
      }
      return null
    }).filter(alert => alert !== null)
  }

  const alerts = getBudgetAlerts()

  if (alerts.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Budget Alerts</h3>
        <p className="text-gray-500">No budget alerts</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Budget Alerts</h3>
      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li key={alert.category} className={`p-2 rounded ${alert.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <div className="flex items-center">
              <span className="material-icons mr-2">
                {alert.type === 'error' ? 'error' : 'warning'}
              </span>
              <span className="font-medium">{alert.category}:</span>
              <span className="ml-1">{alert.message}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BudgetAlerts