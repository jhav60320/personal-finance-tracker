import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses } from '../../features/expenses/expenseSlice';
import { format } from 'date-fns';

export default function RecentExpenses() {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expense);

  useEffect(() => {
    // Get last 7 days of expenses
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    dispatch(getExpenses({
      startDate: sevenDaysAgo.toISOString().split('T')[0]
    }));
  }, [dispatch]);

  if (loading) return <div>Loading expenses...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Recent Expenses (Last 7 Days)</h3>
      
      {expenses.length === 0 ? (
        <p className="text-gray-500">No recent expenses found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.slice(0, 5).map((expense) => (
                <tr key={expense._id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.category}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    ₹{expense.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {expense.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}