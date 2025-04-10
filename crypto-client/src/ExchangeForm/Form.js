import { FormContainer, FormError } from "./styles"
import { Form, Button } from "react-bootstrap"
import { EXCHANGE_FEE_PERCENT, NETWORK_FEE, RATE_ACCURACY } from '../constants'

const FormGroup = ({ exchangeRate, formData, setFormData, onSubmit, errors }) => {
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
      <Form onSubmit={onSubmit}>
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