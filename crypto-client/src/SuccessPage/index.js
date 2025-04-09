import { useLocation, useNavigate } from 'react-router-dom'
import { Header, InfoBlock, InfoContainer, PageHeader, SubHeader, SuccessContainer } from "./styles"
import { Button } from "react-bootstrap"

const Index = () => {
  const NETWORK_FEE = 0.000006
  const location = useLocation()
  const navigate = useNavigate()

  const {
    fromCurrency,
    toCurrency,
    exchangeFee,
    recipientAddress,
    exchangeRate
  } = location.state || {}

  return (
    <SuccessContainer>
      <PageHeader>
        Success
        <Button onClick={() => navigate('/')}>Go back</Button>
      </PageHeader>
      <InfoContainer>
        <InfoBlock>
          <Header>You send</Header>
          <SubHeader>{fromCurrency} USDT</SubHeader>
        </InfoBlock>
        <InfoBlock>
          <Header>You get</Header>
          <SubHeader>{toCurrency} BTC</SubHeader>
        </InfoBlock>
        <InfoBlock>
          <Header>Exchange fee</Header>
          <SubHeader>{exchangeFee} BTC</SubHeader>
        </InfoBlock>
        <InfoBlock>
          <Header>Network fee</Header>
          <SubHeader>{NETWORK_FEE} BTC</SubHeader>
        </InfoBlock>
        <InfoBlock>
          <Header>Recipient address</Header>
          <SubHeader>{recipientAddress}</SubHeader>
        </InfoBlock>
        <InfoBlock>
          <Header>Exchange rate</Header>
          <SubHeader>1 USDT ~ {exchangeRate} BTC</SubHeader>
        </InfoBlock>
        <InfoBlock>
          <Header>Transaction ID</Header>
          <SubHeader>sadjsdvkljsdlkjweijf</SubHeader>
        </InfoBlock>
      </InfoContainer>
    </SuccessContainer>
  )
}

export default Index