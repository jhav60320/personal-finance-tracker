import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getBudgets, reset } from '../features/budgets/budgetSlice'
import BudgetList from '../components/budgets/BudgetList'
import BudgetForm from '../components/budgets/BudgetForm'
import Button from '../components/ui/Button'

export default function Budgets() {
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch()
  const { budgets, loading } = useSelector((state) => state.budget)

  useEffect(() => {
    dispatch(getBudgets())

    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <Button onClick={() => setShowForm(true)}>Add Budget</Button>
      </div>

      {showForm && (
        <BudgetForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            dispatch(getBudgets())
          }}
        />
      )}

      <BudgetList budgets={budgets} loading={loading} />
    </div>
  )
}