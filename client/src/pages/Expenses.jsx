import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getExpenses, reset } from '../features/expenses/expenseSlice'
import ExpenseList from '../components/expenses/ExpenseList'
import ExpenseForm from '../components/expenses/ExpenseForm'
import ExpenseFilter from '../components/expenses/ExpenseFilter'
import Button from '../components/ui/Button'

export default function Expenses() {
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    paymentMethod: '',
    search: ''
  })

  const dispatch = useDispatch()
  const { expenses, loading } = useSelector((state) => state.expense)

  useEffect(() => {
    dispatch(getExpenses(filters))

    return () => {
      dispatch(reset())
    }
  }, [dispatch, filters])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Button onClick={() => setShowForm(true)}>Add Expense</Button>
      </div>

      <ExpenseFilter filters={filters} setFilters={setFilters} />

      {showForm && (
        <ExpenseForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            dispatch(getExpenses(filters))
          }}
        />
      )}

      <ExpenseList expenses={expenses} loading={loading} />
    </div>
  )
}