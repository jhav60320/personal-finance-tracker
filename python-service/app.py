from flask import Flask, request, jsonify
import pandas as pd
from datetime import datetime, timedelta

app = Flask(__name__)

def analyze_spending(expenses):
    # Convert to DataFrame
    df = pd.DataFrame(expenses)
    
    # Convert amount to float and date to datetime
    df['amount'] = df['amount'].astype(float)
    df['date'] = pd.to_datetime(df['date'])
    
    # Calculate date ranges
    today = datetime.now()
    thirty_days_ago = today - timedelta(days=30)
    
    # Filter last 30 days
    recent_expenses = df[df['date'] >= thirty_days_ago]
    
    if recent_expenses.empty:
        return {"suggestions": ["No expenses in the last 30 days to analyze."]}
    
    # Calculate total spending by category
    category_spending = recent_expenses.groupby('category')['amount'].sum().sort_values(ascending=False)
    
    # Calculate average daily spending by category
    daily_spending = recent_expenses.groupby(['category', pd.Grouper(key='date', freq='D')])['amount'].sum()
    avg_daily_spending = daily_spending.groupby('category').mean()
    
    # Calculate percentage change in spending (last week vs previous week)
    last_week_start = today - timedelta(days=7)
    two_weeks_ago = today - timedelta(days=14)
    
    last_week = recent_expenses[recent_expenses['date'] >= last_week_start]
    prev_week = recent_expenses[
        (recent_expenses['date'] >= two_weeks_ago) & 
        (recent_expenses['date'] < last_week_start)
    ]
    
    last_week_totals = last_week.groupby('category')['amount'].sum()
    prev_week_totals = prev_week.groupby('category')['amount'].sum()
    
    # Generate suggestions
    suggestions = []
    
    # Suggestion for top spending category
    top_category = category_spending.index[0]
    top_amount = category_spending.iloc[0]
    suggestions.append(
        f"You're spending the most on {top_category} (₹{top_amount:.2f} in last 30 days). "
        f"Consider reviewing these expenses."
    )
    
    # Suggestion for significant increases in spending
    for category in last_week_totals.index:
        if category in prev_week_totals.index:
            last = last_week_totals[category]
            prev = prev_week_totals[category]
            if prev > 0:  # Avoid division by zero
                pct_change = (last - prev) / prev * 100
                if pct_change > 50:  # More than 50% increase
                    suggestions.append(
                        f"Your {category} expenses increased by {pct_change:.0f}% "
                        f"this week compared to last week."
                    )
    
    # Suggestion for high daily averages
    for category in avg_daily_spending.index:
        avg = avg_daily_spending[category]
        if avg > 500:  # If average daily spending is over ₹500
            monthly_estimate = avg * 30
            suggestions.append(
                f"Your average daily spending on {category} is ₹{avg:.2f}. "
                f"At this rate, you'll spend ₹{monthly_estimate:.2f} this month."
            )
    
    if not suggestions:
        suggestions.append("Your spending patterns look normal. Keep it up!")
    
    return {"suggestions": suggestions}

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    expenses = data.get('expenses', [])
    
    if not expenses:
        return jsonify({"error": "No expenses provided"}), 400
    
    # Convert MongoDB ObjectId to string for JSON serialization
    for expense in expenses:
        if '_id' in expense:
            expense['_id'] = str(expense['_id'])
        if 'user' in expense:
            expense['user'] = str(expense['user'])
    
    result = analyze_spending(expenses)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
