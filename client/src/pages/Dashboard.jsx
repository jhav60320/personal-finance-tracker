import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDashboardData, getSmartSuggestions } from '../features/reports/reportSlice'
import SummaryCards from '../components/dashboard/SummaryCards'
import SpendingChart from '../components/dashboard/SpendingChart'
import RecentExpenses from '../components/expenses/RecentExpenses'
import BudgetAlerts from '../components/budgets/BudgetAlerts'
import SmartSuggestions from '../components/dashboard/SmartSuggestions'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { dashboardData, suggestions, loading } = useSelector((state) => state.report)

  useEffect(() => {
    dispatch(getDashboardData())
    dispatch(getSmartSuggestions())
  }, [dispatch])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <SummaryCards data={dashboardData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart data={dashboardData} />
        </div>
        <div className="space-y-6">
          <BudgetAlerts />
          <SmartSuggestions suggestions={suggestions} />
        </div>
      </div>
      <RecentExpenses />
    </div>
  )
}