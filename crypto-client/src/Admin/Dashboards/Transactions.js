import { useEffect, useState } from "react";
import moment from "moment-timezone";
import { Table, Badge, Container } from 'react-bootstrap'
import { deepCamelCase } from "../../utils";
import TablePagination from "../../Components/TablePagination";

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [totalSize, setTotalSize] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchTransactions = async () => {
      fetch(`http://localhost:3000/admin/dashboards/transactions?page=${page}`, {method: 'GET', credentials: 'include'})
        .then(response => response.json())
        .then(data => deepCamelCase(data))
        .then(data => {
          setTransactions(data.transactions)
          setTotalSize(data.totalSize)
        })
        .catch(error => console.warn(error.message))
    }

    fetchTransactions()
  }, [page])

  const formatDate = (date) => {
    return moment(date).format('YYYY.MM.DD HH:mm:ss')
  }

  return (
    <Container className='mt-4'>
      <h3 className='mb-4'>Transactions</h3>
      <Table striped bordered hover>
        <thead>
        <tr>
          <th>id</th>
          <th>date/time</th>
          <th>e-mail</th>
          <th>txid</th>
          <th>from</th>
          <th>to</th>
          <th>exchange rate</th>
          <th>exchange fee</th>
          <th>status</th>
        </tr>
        </thead>
        <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{tx.id}</td>
            <td>{formatDate(tx.datetime)}</td>
            <td>{tx.email}</td>
            <td>{tx.transactionId}</td>
            <td>{tx.fromCurrency} USDT</td>
            <td>{tx.toCurrency} BTC</td>
            <td>{tx.exchangeRate} BTC</td>
            <td>{tx.exchangeFee} BTC</td>
            <td>
              <Badge bg={tx.status === 'Success' ? 'success' : 'danger'}>
                {tx.status}
              </Badge>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
      <TablePagination itemsLength={totalSize} onPageChange={setPage}/>
    </Container>
  )
}

export default Transactions