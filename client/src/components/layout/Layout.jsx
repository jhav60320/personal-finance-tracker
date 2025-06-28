import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
  const { userInfo } = useSelector((state) => state.auth)

  if (!userInfo) return <Outlet />

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 p-4 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
