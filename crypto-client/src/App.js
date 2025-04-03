import React, { useEffect, useState } from 'react';
import ExchangeForm from "./ExchangeForm/Form";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/transactions')  // Обратите внимание на порт (порт Rails по умолчанию - 3001)
        .then(response => response.json())
        .then(data => setTransactions(data));
  }, []);

  return (
      <>
        <ExchangeForm/>
      </>
  );
}

export default App;