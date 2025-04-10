import Form from "./Form"
import { useEffect, useState } from "react"
import { defaultFormValues, EXCHANGE_RATE_URL, RATE_ACCURACY } from '../constants'
import SuccessPage from '../SuccessPage'
import { deepCamelCase, deepSnakeCase } from '../utils'

const Index = () => {
  const [usdtToBitcoinRate, setUsdtToBitcoinRate] = useState(null)
  const [formData, setFormData] = useState(defaultFormValues)
  const [errors, setErrors] = useState({})
  const [isSuccessful, setIsSuccessful] = useState(false)

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const btcResponse = await fetch(EXCHANGE_RATE_URL)
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

    fetchRates()
  }, [])

  const params = {
    email: formData.recipientEmailAddress,
    fromCurrency: formData.usdtValue,
    toCurrency: formData.bitcoinValue,
    recipientAddress: formData.recipientWalletAddress,
    exchangeRate: usdtToBitcoinRate,
    exchangeFee: formData.exchangeFee
  }

  const exchangeCurrency = async (event) => {
    event.preventDefault()

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
      })
      .then(data => setIsSuccessful(true))
      .catch(error => console.warn(error.message))
  }

  const handleGoBack = () => {
    setIsSuccessful(false)
    setFormData(defaultFormValues)
    setErrors({})
  }

  if (!usdtToBitcoinRate) return null

  return (
    <>
      {isSuccessful
        ? <SuccessPage params={params} onGoBack={handleGoBack}/>
        : <Form
          exchangeRate={usdtToBitcoinRate}
          formData={formData}
          setFormData={setFormData}
          onSubmit={exchangeCurrency}
          errors={errors}
        />
      }
    </>
  )
}

export default Index