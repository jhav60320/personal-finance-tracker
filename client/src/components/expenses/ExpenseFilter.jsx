import Input from '../ui/Input'
import Select from '../ui/Select'

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

import PropTypes from 'prop-types'

function ExpenseFilter({ filters, setFilters }) {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      category: '',
      paymentMethod: '',
      search: ''
    })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Input
          label="From Date"
          name="startDate"
          type="date"
          value={filters.startDate}
          onChange={handleChange}
        />
        <Input
          label="To Date"
          name="endDate"
          type="date"
          value={filters.endDate}
          onChange={handleChange}
        />
        <Select
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          options={categories}
        />
        <Select
          label="Payment Method"
          name="paymentMethod"
          value={filters.paymentMethod}
          onChange={handleChange}
          options={paymentMethods}
        />
        <Input
          label="Search"
          name="search"
          type="text"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search notes..."
        />
        <button
          type="button"
          onClick={clearFilters}
          className="self-end mb-1 text-sm text-blue-600 hover:text-blue-800"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )}
  
ExpenseFilter.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    category: PropTypes.string,
    paymentMethod: PropTypes.string,
    search: PropTypes.string
  }).isRequired,
  setFilters: PropTypes.func.isRequired
}

export default ExpenseFilter
