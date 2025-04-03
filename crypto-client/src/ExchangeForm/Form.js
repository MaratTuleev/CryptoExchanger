import React, { useEffect, useState } from 'react'
import { FormContainer } from "./styles"
import { Form, Button } from "react-bootstrap"

const FormGroup = () => {
  const NETWORK_FEE = 0.000006
  const RATE_ACCURACY = 12
  const EXCHANGE_FEE_PERCENT = 0.03
  const [usdtValue, setUsdtValue] = useState()
  const [bitcoinValue, setBitcoinValue] = useState()
  const [bitcoinToUsdtRate, setBitcoinToUsdtRate] = useState(null)
  const [exchangeFee, setExchangeFee] = useState(0)
  const [recepientWalletAddress, setRecepientWalletAddress] = useState()
  const [recepientEmailAddress, setRecepientEmailAddress] = useState()
  const [rulesChecked, setRulesChecked] = useState(false)

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
          setBitcoinToUsdtRate(btcToUsd / usdtToUsd)
        }
      } catch (error) {
        console.error("Ошибка загрузки курса:", error)
      }
    }

    fetchPrices()
  }, [])

  const calcExchangeFee = (bitcoin) => {
    setExchangeFee((bitcoin * EXCHANGE_FEE_PERCENT).toFixed(RATE_ACCURACY))
  }

  const handleSubmit = (event) => {
    event.preventDefault() // Отменяем стандартное поведение отправки формы
    console.log("Форма отправлена с значением:", bitcoinValue)
  }

  const handleCurrencyChange = ({target: {name, value}}) => {
    if (name === "usdt") {
      setUsdtValue(value)
      const bitcoins = value / bitcoinToUsdtRate
      setBitcoinValue(bitcoins)
      calcExchangeFee(bitcoins)
    } else if (name === "bitcoin") {
      setBitcoinValue(value)
      calcExchangeFee(value)
      setUsdtValue(value * bitcoinToUsdtRate)
    }
  }

  const handleWalletAddressChange = ({target: {value}}) => {
    setRecepientWalletAddress(value)
  }

  const handleEmailAddressChange = ({target: {value}}) => {
    setRecepientEmailAddress(value)
  }

  console.log('checked?', rulesChecked)
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
        </Form.Group>
        <Form.Label>1 USDT ~ {(1 / bitcoinToUsdtRate).toFixed(RATE_ACCURACY)} BTC</Form.Label><p/>
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
            placeholder="Enter your BTC recepient address"
            value={recepientWalletAddress}
            onChange={handleWalletAddressChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={recepientEmailAddress}
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
        <Button variant="primary" type="submit" disabled={!(rulesChecked && recepientWalletAddress?.length > 0)}>
          Exchange now
        </Button>
      </Form>
    </FormContainer>
  )
}

export default FormGroup