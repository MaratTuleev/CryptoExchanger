import { useEffect, useState } from 'react'
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { FormError } from "../ExchangeForm/styles"
import { encodeToBase64 } from "../utils"
import { LoginContainer } from "./styles"

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (Cookies.get('admin-cookie') === 'true') navigate('/admin/dashboard')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const credentials = encodeToBase64(`${username}:${password}`) // base64 кодирование
    const response = await fetch('http://localhost:3000/admin/login', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    })

    if (response.ok) {
      Cookies.set('admin-cookie', 'true', {expires: 7})
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <LoginContainer>
      <h2>Admin Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBitcoin">
          <Form.Label>Enter username</Form.Label>
          <Form.Control
            name="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBitcoin">
          <Form.Label>Enter password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {error && <FormError>{error}</FormError>}
        <Button type="submit">Login</Button>
      </Form>
    </LoginContainer>
  )
}

export default AdminLogin