import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { saveBudget } from '../../features/budgets/budgetSlice'
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

function BudgetForm({ budget, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  })

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        limit: budget.limit
      })
    }
  }, [budget])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(saveBudget(formData)).unwrap()
      onSuccess()
    } catch (error) {
      console.error('Failed to save budget:', error)
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">{budget ? 'Edit Budget' : 'Add New Budget'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
          required
          disabled={!!budget}
        />
        <Input
          label="Monthly Limit (₹)"
          name="limit"
          type="number"
          value={formData.limit}
          onChange={handleChange}
          required
          step="0.01"
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
          <Button type="submit">
            {budget ? 'Update Budget' : 'Add Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
BudgetForm.propTypes = {
  budget: PropTypes.shape({
    category: PropTypes.string,
    limit: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

export default BudgetForm
// This component allows users to add or edit a budget category with a monthly limit.
// It uses a modal for input and dispatches actions to save the budget to the Redux store