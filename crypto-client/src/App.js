import React, { useEffect, useState } from 'react';

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/transactions')  // Обратите внимание на порт (порт Rails по умолчанию - 3001)
        .then(response => response.json())
        .then(data => setTransactions(data));
  }, []);

  return (
      <div className="App">
        <h1>Transactions</h1>
        <ul>
          {transactions.map(transaction => (
              <li key={transaction.id}>
                {transaction.from_currency} to {transaction.to_currency} - {transaction.exchange_rate}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default App;