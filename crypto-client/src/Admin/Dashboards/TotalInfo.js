import { useEffect, useState } from "react"
import { deepCamelCase } from "../../utils"
import { Container, Table } from "react-bootstrap"
import { DashboardHeader, LogoutButton } from "./styles"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

const TotalInfo = () => {
  const navigate = useNavigate()
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

  const handleLogout = () => {
    Cookies.remove('admin-cookie')
    navigate('/admin/login')
  }

  return (
    <Container className='mt-4'>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      <DashboardHeader>Total Info</DashboardHeader>
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