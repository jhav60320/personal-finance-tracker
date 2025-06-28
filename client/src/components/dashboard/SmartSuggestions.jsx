import PropTypes from 'prop-types';

function SmartSuggestions({ suggestions = [] }) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Smart Suggestions</h3>
        <p className="text-gray-500">No suggestions available</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Smart Suggestions</h3>
      <ul className="space-y-2">
        {suggestions.map((suggestion) => (
          <li key={suggestion} className="flex items-start">
            <span className="material-icons text-yellow-500 mr-2">info</span>
            <span className="text-sm">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

SmartSuggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string)
};

export default SmartSuggestions