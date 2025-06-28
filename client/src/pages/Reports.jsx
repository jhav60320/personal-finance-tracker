import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getReportHistory, generateMonthlyReport } from '../features/reports/reportSlice'
import ReportHistory from '../components/reports/ReportHistory'
import Button from '../components/ui/Button'

export default function Reports() {
  const dispatch = useDispatch()
  const { reportHistory, loading } = useSelector((state) => state.report)

  useEffect(() => {
    dispatch(getReportHistory())
  }, [dispatch])

  const handleGenerateReport = () => {
    dispatch(generateMonthlyReport())
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Monthly Reports</h1>
        <Button onClick={handleGenerateReport}>Generate Current Month Report</Button>
      </div>

      <ReportHistory reports={reportHistory} loading={loading} />
    </div>
  )
}