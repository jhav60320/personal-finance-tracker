import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { getUserProfile } from './features/auth/authSlice'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/layout/Layout'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      dispatch(getUserProfile())
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={userInfo ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="expenses" element={userInfo ? <Expenses /> : <Navigate to="/login" />} />
          <Route path="budgets" element={userInfo ? <Budgets /> : <Navigate to="/login" />} />
          <Route path="reports" element={userInfo ? <Reports /> : <Navigate to="/login" />} />
          <Route path="login" element={!userInfo ? <Login /> : <Navigate to="/" />} />
          <Route path="register" element={!userInfo ? <Register /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App