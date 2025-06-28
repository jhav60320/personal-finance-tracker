import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteBudget } from '../../features/budgets/budgetSlice.js'
import BudgetForm from './BudgetForm'
import Button from '../ui/Button'
import PropTypes from 'prop-types'

function BudgetList({ budgets, loading }) {
  const dispatch = useDispatch()
  const [editingBudget, setEditingBudget] = useState(null)

  if (loading) return <div>Loading budgets...</div>
  if (budgets.length === 0) return <div>No budgets set</div>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Limit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {budgets.map((budget) => (
              <tr key={budget._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {budget.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{budget.limit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setEditingBudget(budget)}
                      className="text-xs py-1 px-2"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => dispatch(deleteBudget(budget._id))}
                      className="text-xs py-1 px-2 bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingBudget && (
        <BudgetForm
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSuccess={() => {
            setEditingBudget(null)
          }}
        />
      )}
    </div>
  )
}
BudgetList.propTypes = {
  budgets: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default BudgetList
