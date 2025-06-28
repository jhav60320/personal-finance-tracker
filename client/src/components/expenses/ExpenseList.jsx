import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteExpense, updateExpense } from '../../features/expenses/expenseSlice'
import ExpenseForm from './ExpenseForm'
import Button from '../ui/Button'
import PropTypes from 'prop-types'

function ExpenseList({ expenses, loading }) {
  const dispatch = useDispatch()
  const [editingExpense, setEditingExpense] = useState(null)

  if (loading) return <div>Loading expenses...</div>
  if (expenses.length === 0) return <div>No expenses found</div>

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => {
              let rowClass = '';
              if (expense.budgetAlert === 'exceeded') {
                rowClass = 'bg-red-50';
              } else if (expense.budgetAlert === 'warning') {
                rowClass = 'bg-yellow-50';
              }
  return (
    <tr key={expense._id} className={rowClass}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(expense.date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {expense.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ₹{expense.amount.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {expense.paymentMethod}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {expense.notes}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <Button
            onClick={() => setEditingExpense(expense)}
            className="text-xs py-1 px-2"
          >
            Edit
          </Button>
          <Button
            onClick={() => dispatch(deleteExpense(expense._id))}
            className="text-xs py-1 px-2 bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
})}
          </tbody>
        </table>
      </div>

      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={() => {
            setEditingExpense(null)
            dispatch(updateExpense(editingExpense))
          }}
        />
      )}
    </div>
  )
}
ExpenseList.propTypes = {
  expenses: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default ExpenseList
// ExpenseList.jsx
// This component displays a list of expenses in a table format with options to edit and delete each