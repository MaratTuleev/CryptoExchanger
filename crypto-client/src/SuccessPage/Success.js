import { useLocation, useNavigate } from 'react-router-dom'
import { Header, InfoBlock, InfoContainer, PageHeader, SubHeader, SuccessContainer } from "./styles";
import { Button } from "react-bootstrap";

const Success = () => {
  const NETWORK_FEE = 0.000006
  const location = useLocation()
  const navigate = useNavigate()

  // Доступ к переданным данным
  const {
    fromCurrency,
    toCurrency,
    exchangeFee,
    recipientAddress,
    exchangeRate
  } = location.state.stateData || {}

  console.log('fromCurrency', location.state)
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
      </InfoContainer>
    </SuccessContainer>
  )
}

export default Success