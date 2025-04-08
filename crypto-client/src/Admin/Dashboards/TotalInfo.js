import { useEffect, useState } from "react";
import { deepCamelCase } from "../../utils";
import { Container, Table } from "react-bootstrap";

const TotalInfo = () => {
  const [totalExchangeFee, setTotalExchangeFee] = useState()
  const [transactionsCount, setTransactionsCount] = useState()
  const [totalSuccessTransactions, setTotalSuccessTransactions] = useState()

  useEffect(() => {
    const fetchTotalInfo = async () => {
      fetch(`http://localhost:3000/admin/dashboards/total_info`, {method: 'GET', credentials: 'include'})
        .then(response => response.json())
        .then(data => deepCamelCase(data))
        .then(data => {
          setTotalExchangeFee(data.totalExchangeFee)
          setTransactionsCount(data.transactionsCount)
          setTotalSuccessTransactions(data.totalSuccessTransactions)
        })
        .catch(error => console.warn(error.message))
    }

    fetchTotalInfo()
  }, [])

  return (
    <Container className='mt-4'>
      <h2 className='mb-4'>Total Info</h2>
      <Table striped bordered hover>
        <thead>
        <tr>
          <th>Total exchange fee</th>
          <th>Total transactions</th>
          <th>Total success transactions</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{totalExchangeFee}</td>
          <td>{transactionsCount}</td>
          <td>{totalSuccessTransactions}</td>
        </tr>
        </tbody>
      </Table>
    </Container>
  )
}

export default TotalInfo