import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import expenseReducer from '../features/expenses/expenseSlice'
import budgetReducer from '../features/budgets/budgetSlice'
import reportReducer from '../features/reports/reportSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
    budget: budgetReducer,
    report: reportReducer
  }
})