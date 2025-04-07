import React, { useEffect, useState } from 'react'
import { FormContainer, FormError } from "./styles"
import { Form, Button } from "react-bootstrap"
import { deepCamelCase, deepSnakeCase } from "../utils";
import { useNavigate } from 'react-router-dom'

const FormGroup = () => {
  const NETWORK_FEE = 0.000006
  const RATE_ACCURACY = 12
  const EXCHANGE_FEE_PERCENT = 0.03
  const [usdtValue, setUsdtValue] = useState()
  const [bitcoinValue, setBitcoinValue] = useState()
  const [usdtToBitcoinRate, setUsdtToBitcoinRate] = useState(null)
  const [exchangeFee, setExchangeFee] = useState(0)
  const [recipientWalletAddress, setRecipientWalletAddress] = useState()
  const [recipientEmailAddress, setRecipientEmailAddress] = useState()
  const [rulesChecked, setRulesChecked] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const btcResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd"
        )
        const data = await btcResponse.json()

        if (data.bitcoin && data.tether) {
          const btcToUsd = data.bitcoin.usd
          const usdtToUsd = data.tether.usd
          setUsdtToBitcoinRate((1 / (btcToUsd / usdtToUsd)).toFixed(RATE_ACCURACY))
        }
      } catch (error) {
        console.error("Ошибка загрузки курса:", error)
      }
    }

    fetchPrices()
  }, [])

  const exchangeCurrency = async () => {
    fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(deepSnakeCase({
        email: recipientEmailAddress,
        fromCurrency: usdtValue,
        toCurrency: bitcoinValue,
        exchangeRate: usdtToBitcoinRate,
        exchangeFee: exchangeFee,
        recipientAddress: recipientWalletAddress
      })),
    })
      .then(response => {
          console.log('response', response)
          if (response.status === 422) {
            return response.json().then(errors => {
              setErrors(deepCamelCase(errors))
              throw new Error('Validation failed')
            })
          } else return response.json()
        }
      )
      .then(data => console.log('data', data))
      .catch(error => console.warn(error.message))
  }

  const calcExchangeFee = (value) => {
    return (value * EXCHANGE_FEE_PERCENT).toFixed(RATE_ACCURACY)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await exchangeCurrency()
    const stateData = {
      email: recipientEmailAddress,
      fromCurrency: usdtValue,
      toCurrency: bitcoinValue,
      exchangeRate: usdtToBitcoinRate,
      exchangeFee: exchangeFee,
      recipientAddress: recipientWalletAddress
    }
    navigate('/success', { state: {stateData} })
  }

  const handleCurrencyChange = ({target: {name, value}}) => {
    if (Number(value) === 0) {
      setBitcoinValue('')
      setUsdtValue('')
      setExchangeFee(0)
    } else if (name === "usdt") {
      setUsdtValue(value)
      const bitcoins = value * usdtToBitcoinRate
      const fee = calcExchangeFee(bitcoins)
      setBitcoinValue((bitcoins - NETWORK_FEE - fee).toFixed(RATE_ACCURACY))
      setExchangeFee(fee)
    } else if (name === "bitcoin") {
      const bitcoinsBeforeFee = value / (1 - EXCHANGE_FEE_PERCENT)
      const fee = bitcoinsBeforeFee - value
      setBitcoinValue(value.toFixed(RATE_ACCURACY))
      setUsdtValue(bitcoinsBeforeFee / usdtToBitcoinRate)
      setExchangeFee(fee)
    }
  }

  const handleWalletAddressChange = ({target: {value}}) => {
    setRecipientWalletAddress(value)
  }

  const handleEmailAddressChange = ({target: {value}}) => {
    setRecipientEmailAddress(value)
  }

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
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
        <Form.Label>1 USDT ~ {usdtToBitcoinRate} BTC</Form.Label><p/>
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
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={recipientEmailAddress}
            onChange={handleEmailAddressChange}
          />
        </Form.Group>
        <div key="agreeRulesCheck" className="mb-3">
          <Form.Check
            type="checkbox"
            value={rulesChecked}
            onChange={(e) => setRulesChecked(e.target.checked)}
          />
        </div>
        <Button variant="primary" type="submit" disabled={!(rulesChecked && recipientWalletAddress?.length > 0)}>
          Exchange now
        </Button>
      </Form>
    </FormContainer>
  )
}

export default FormGroup