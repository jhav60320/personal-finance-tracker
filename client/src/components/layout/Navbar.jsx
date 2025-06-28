import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import logo from '../../assets/Untitleddesign.png'


function Navbar() {
  const dispatch = useDispatch()

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              <img
                src={logo}
                alt="Finance Tracker Logo"
                className="h-8 w-8 inline-block mr-2"/>
              <span>Finance Tracker</span>
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => dispatch(logout())}
              className="text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar