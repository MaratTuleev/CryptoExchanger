import React, { useState } from 'react'
import { FormContainer, FormError } from "./styles"
import { Form, Button } from "react-bootstrap"
import { deepCamelCase, deepSnakeCase } from "../utils"
import { useNavigate } from 'react-router-dom'
import { EXCHANGE_FEE_PERCENT, NETWORK_FEE, RATE_ACCURACY } from '../constants'

const FormGroup = ({ exchangeRate }) => {
  const [formData, setFormData] = useState({
    usdtValue: '',
    bitcoinValue: '',
    exchangeFee: 0,
    recipientWalletAddress: '',
    recipientEmailAddress: '',
    rulesChecked: false
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const calcExchangeFee = (value) => (value * EXCHANGE_FEE_PERCENT).toFixed(RATE_ACCURACY)

  const handleChange = ({ target: { name, value, type, checked } }) => {
    const val = type === 'checkbox' ? checked : value

    setFormData((prev) => {
      let updated = { ...prev, [name]: val }
      if (['usdtValue', 'bitcoinValue'].includes(name) && Number(val) === 0) {
        return { ...updated, usdtValue: '', bitcoinValue: '', exchangeFee: 0 }
      }

      if (name === 'usdtValue') {
        const usdt = parseFloat(val)
        const bitcoins = usdt * exchangeRate
        const fee = calcExchangeFee(bitcoins)
        updated.bitcoinValue = (bitcoins - NETWORK_FEE - fee).toFixed(RATE_ACCURACY)
        updated.exchangeFee = fee
      }
      if (name === 'bitcoinValue') {
        const btc = parseFloat(val)
        const bitcoinsBeforeFee = btc / (1 - EXCHANGE_FEE_PERCENT)
        const fee = bitcoinsBeforeFee - btc
        updated.bitcoinValue = btc.toFixed(RATE_ACCURACY)
        updated.usdtValue = (bitcoinsBeforeFee / exchangeRate).toFixed(RATE_ACCURACY)
        updated.exchangeFee = fee
      }

      return updated
    })
  }

  const exchangeCurrency = async (event) => {
    event.preventDefault()

    const params = {
      email: formData.recipientEmailAddress,
      fromCurrency: formData.usdtValue,
      toCurrency: formData.bitcoinValue,
      recipientAddress: formData.recipientWalletAddress,
      exchangeRate,
      exchangeFee: formData.exchangeFee
    }

    fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deepSnakeCase(params)),
    })
      .then(response => {
        if (response.status === 422) {
          return response.json().then(errors => {
            setErrors(deepCamelCase(errors))
            throw new Error('Validation failed')
          })
        } else return response.json()
      })
      .then(data => navigate('/success', { state: params }))
      .catch(error => console.warn(error.message))
  }

  const {
    usdtValue,
    bitcoinValue,
    recipientWalletAddress,
    recipientEmailAddress,
    exchangeFee,
    rulesChecked
  } = formData

  return (
    <FormContainer>
      <Form onSubmit={exchangeCurrency}>
        <Form.Group className="mb-3" controlId="formUSDT">
          <Form.Label>You send (USDT)</Form.Label>
          <Form.Control
            type="number"
            name="usdtValue"
            placeholder="Amount of USDT"
            value={usdtValue}
            onChange={handleChange}
          />
          <FormError>{errors['fromCurrency']}</FormError>
        </Form.Group>
        <Form.Label>1 USDT ~ {exchangeRate} BTC</Form.Label><p />
        <Form.Label>Exchange fee <b>{exchangeFee} BTC</b></Form.Label><p />
        <Form.Label>Network fee {NETWORK_FEE} BTC</Form.Label>
        <Form.Group className="mb-3" controlId="formBitcoin">
          <Form.Label>You get (Bitcoin)</Form.Label>
          <Form.Control
            type="number"
            name="bitcoinValue"
            placeholder="Amount of Bitcoin"
            value={bitcoinValue}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formWallet">
          <Form.Label>Wallet address</Form.Label>
          <Form.Control
            type="text"
            name="recipientWalletAddress"
            placeholder="Enter your BTC recipient address"
            value={recipientWalletAddress}
            onChange={handleChange}
          />
          <FormError>{errors['recipientAddress']}</FormError>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="recipientEmailAddress"
            placeholder="name@example.com"
            value={recipientEmailAddress}
            onChange={handleChange}
          />
          <FormError>{errors['email']}</FormError>
        </Form.Group>
        <Form.Group key="agreeRulesCheck" className="mb-3">
          <Form.Check
            id="agreeRulesCheck"
            type="checkbox"
            name="rulesChecked"
            label="I agree with terms of use, Privacy Policy and AML/KYC"
            checked={rulesChecked}
            onChange={handleChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={!(rulesChecked && recipientWalletAddress?.length > 0)}
        >
          Exchange now
        </Button>
      </Form>
    </FormContainer>
  )
}

export default FormGroup