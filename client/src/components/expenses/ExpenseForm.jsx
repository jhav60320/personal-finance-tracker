import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addExpense, updateExpense } from '../../features/expenses/expenseSlice'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import PropTypes from 'prop-types'

const categories = [
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Health', label: 'Health' },
  { value: 'Education', label: 'Education' },
  { value: 'Other', label: 'Other' }
]

const paymentMethods = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Debit Card', label: 'Debit Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Bank Transfer', label: 'Bank Transfer' }
]

function ExpenseForm({ expense, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: ''
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        paymentMethod: expense.paymentMethod,
        notes: expense.notes || ''
      })
    }
  }, [expense])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (expense) {
        await dispatch(updateExpense({ id: expense._id, expenseData: formData })).unwrap()
      } else {
        await dispatch(addExpense(formData)).unwrap()
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save expense:', error)
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
          step="0.01"
        />
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
          required
        />
        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <Select
          label="Payment Method"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          options={paymentMethods}
          required
        />
        <Input
          label="Notes (Optional)"
          name="notes"
          type="text"
          value={formData.notes}
          onChange={handleChange}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
          <Button type="submit">
            {expense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
ExpenseForm.propTypes = {
  expense: PropTypes.shape({
    _id: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    paymentMethod: PropTypes.string,
    notes: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

export default ExpenseForm
