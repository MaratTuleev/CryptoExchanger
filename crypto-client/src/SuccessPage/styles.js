import styled from "styled-components";

export const SuccessContainer = styled.div`
    margin: 24px;
    border: black 1px solid;
    padding: 16px;
    width: fit-content;
    border-radius: 16px;
`

export const PageHeader = styled.div`
  font-size: 36px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
    justify-content: space-between;
`

export const InfoContainer = styled.div`
    display: grid;
    column-gap: 12px;
    grid-template-columns: repeat(2, max-content);
`

export const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    word-break: break-word;
    margin-bottom: 24px;
`

export const Header = styled.div`
  color: gray;
`

export const SubHeader = styled.div`
    font-size: 24px;
    font-weight: bold;
`