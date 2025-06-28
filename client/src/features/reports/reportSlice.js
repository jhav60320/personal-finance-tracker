import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reportService from './reportService'

const initialState = {
  dashboardData: null,
  suggestions: [],
  reportHistory: [],
  loading: false,
  error: null
}

export const getDashboardData = createAsyncThunk(
  'reports/dashboard',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await reportService.getDashboardData(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getSmartSuggestions = createAsyncThunk(
  'reports/suggestions',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await reportService.getSmartSuggestions(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const generateMonthlyReport = createAsyncThunk(
  'reports/generate',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await reportService.generateMonthlyReport(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getReportHistory = createAsyncThunk(
  'reports/history',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken
      return await reportService.getReportHistory(token)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false
        state.dashboardData = action.payload
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getSmartSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload
      })
      .addCase(generateMonthlyReport.fulfilled, () => {
        // Optionally update state if needed
      })
      .addCase(getReportHistory.pending, (state) => {
        state.loading = true
      })
      .addCase(getReportHistory.fulfilled, (state, action) => {
        state.loading = false
        state.reportHistory = action.payload
      })
      .addCase(getReportHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default reportSlice.reducer