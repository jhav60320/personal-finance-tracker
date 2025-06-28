import PropTypes from 'prop-types';

function SummaryCards({ data }) {
  const cards = [
    {
      title: 'Total Spent This Month',
      value: `₹${data?.totalSpent?.toFixed(2) || '0.00'}`,
      icon: 'account_balance_wallet'
    },
    {
      title: 'Top Category',
      value: data?.topCategory?._id || 'N/A',
      subValue: data?.topCategory ? `₹${data.topCategory.total.toFixed(2)}` : '',
      icon: 'category'
    },
    {
      title: 'Payment Methods',
      value: data?.topPaymentMethods?.[0]?._id || 'N/A',
      subValue: data?.topPaymentMethods?.[0] ? `₹${data.topPaymentMethods[0].total.toFixed(2)}` : '',
      icon: 'payment'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <span className="material-icons text-blue-500 mr-2">{card.icon}</span>
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{card.value}</p>
          {card.subValue && <p className="text-sm text-gray-500">{card.subValue}</p>}
        </div>
      ))}
    </div>
  )}


SummaryCards.propTypes = {
  data: PropTypes.shape({
    totalSpent: PropTypes.number,
    topCategory: PropTypes.shape({
      _id: PropTypes.string,
      total: PropTypes.number
    }),
    topPaymentMethods: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        total: PropTypes.number
      })
    )
  })
};



export default SummaryCards
// SummaryCards.jsx
// This component displays summary cards for total spent, top category, and top payment methods.