import React from 'react';
import ExchangeForm from "./ExchangeForm/Form";
import 'bootstrap/dist/css/bootstrap.min.css';
import Success from "./SuccessPage/Success";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<ExchangeForm/>} />
            <Route path="/exchange" element={<ExchangeForm/>} />
            <Route path="/success" element={<Success/>} />
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;