import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <nav className="mt-6">
          <NavItem to="/" text="Dashboard" icon="dashboard" />
          <NavItem to="/expenses" text="Expenses" icon="receipt" />
          <NavItem to="/budgets" text="Budgets" icon="account_balance_wallet" />
          <NavItem to="/reports" text="Reports" icon="analytics" />
        </nav>
      </div>
    </div>
  )
}



function NavItem({ to, text, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 mt-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`
      }
    >
      <span className="material-icons mr-3">{icon}</span>
      {text}
    </NavLink>
  )
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}

export default Sidebar