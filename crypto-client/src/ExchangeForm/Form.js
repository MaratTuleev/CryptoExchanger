import React, { useState } from 'react'
import { FormContainer, FormError } from "./styles"
import { Form, Button } from "react-bootstrap"
import { deepCamelCase, deepSnakeCase } from "../utils"
import { useNavigate } from 'react-router-dom'
import { EXCHANGE_FEE_PERCENT, NETWORK_FEE, RATE_ACCURACY } from '../constants'

const FormGroup = ({exchangeRate}) => {
  const [usdtValue, setUsdtValue] = useState()
  const [bitcoinValue, setBitcoinValue] = useState()
  const [exchangeFee, setExchangeFee] = useState(0)
  const [recipientWalletAddress, setRecipientWalletAddress] = useState()
  const [recipientEmailAddress, setRecipientEmailAddress] = useState()
  const [rulesChecked, setRulesChecked] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const exchangeCurrency = async (event) => {
    event.preventDefault()

    const params = {
      email: recipientEmailAddress,
      fromCurrency: usdtValue,
      toCurrency: bitcoinValue,
      recipientAddress: recipientWalletAddress,
      exchangeRate,
      exchangeFee
    }

    fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(deepSnakeCase(params)),
    })
      .then(response => {
          if (response.status === 422) {
            return response.json().then(errors => {
              setErrors(deepCamelCase(errors))
              throw new Error('Validation failed')
            })
          } else return response.json()
        }
      )
      .then(data => navigate('/success', {state: params}))
      .catch(error => console.warn(error.message))
  }

  const calcExchangeFee = (value) => {
    return (value * EXCHANGE_FEE_PERCENT).toFixed(RATE_ACCURACY)
  }

  const handleCurrencyChange = ({target: {name, value}}) => {
    if (Number(value) === 0) {
      setBitcoinValue('')
      setUsdtValue('')
      setExchangeFee(0)
    } else if (name === "usdt") {
      setUsdtValue(value)
      const bitcoins = value * exchangeRate
      const fee = calcExchangeFee(bitcoins)
      setBitcoinValue((bitcoins - NETWORK_FEE - fee).toFixed(RATE_ACCURACY))
      setExchangeFee(fee)
    } else if (name === "bitcoin") {
      const bitcoinsBeforeFee = value / (1 - EXCHANGE_FEE_PERCENT)
      const fee = bitcoinsBeforeFee - value
      setBitcoinValue(value.toFixed(RATE_ACCURACY))
      setUsdtValue(bitcoinsBeforeFee / exchangeRate)
      setExchangeFee(fee)
    }
  }

  const handleWalletAddressChange = ({target: {value}}) => {
    setRecipientWalletAddress(value)
  }

  const handleEmailAddressChange = ({target: {value}}) => {
    setRecipientEmailAddress(value)
  }

  console.log('RENDER')

  return (
    <FormContainer>
      <Form onSubmit={exchangeCurrency}>
        <Form.Group className="mb-3" controlId="formUSDT">
          <Form.Label>You send (USDT)</Form.Label>
          <Form.Control
            type="number"
            name="usdt"
            placeholder="Amount of USDT"
            value={usdtValue}
            onChange={handleCurrencyChange}
          />
          <FormError>{errors['fromCurrency']}</FormError>
        </Form.Group>
        <Form.Label>1 USDT ~ {exchangeRate} BTC</Form.Label><p/>
        <Form.Label>Exchange fee <b>{exchangeFee} BTC</b></Form.Label><p/>
        <Form.Label>Network fee {NETWORK_FEE} BTC</Form.Label>
        <Form.Group className="mb-3" controlId="formBitcoin">
          <Form.Label>You get (Bitcoin)</Form.Label>
          <Form.Control
            type="number"
            name="bitcoin"
            placeholder="Amount of Bitcoin"
            value={bitcoinValue}
            onChange={handleCurrencyChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formWallet">
          <Form.Label>Wallet address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your BTC recipient address"
            value={recipientWalletAddress}
            onChange={handleWalletAddressChange}
          />
          <FormError>{errors['recipientAddress']}</FormError>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={recipientEmailAddress}
            onChange={handleEmailAddressChange}
          />
          <FormError>{errors['email']}</FormError>
        </Form.Group>
        <Form.Group key="agreeRulesCheck" className="mb-3">
          <Form.Check
            id="agreeRulesCheck"
            type="checkbox"
            label="I agree with terms of use, Privacy Policy and AML/KYC"
            value={rulesChecked}
            onChange={(e) => setRulesChecked(e.target.checked)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={!(rulesChecked && recipientWalletAddress?.length > 0)}>
          Exchange now
        </Button>
      </Form>
    </FormContainer>
  )
}

export default FormGroup