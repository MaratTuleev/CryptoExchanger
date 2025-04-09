import Form from "./Form"
import { useEffect, useState } from "react"
import { RATE_ACCURACY } from '../constants'

const Index = () => {
  const [usdtToBitcoinRate, setUsdtToBitcoinRate] = useState(null)

  useEffect(() => {
    const fetchRates = async () => {
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

    fetchRates()
  }, [])

  return (
    <Form exchangeRate={usdtToBitcoinRate}/>
  )
}

export default Index