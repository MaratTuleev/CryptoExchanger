import React from 'react'
import ExchangeForm from "./ExchangeForm"
import 'bootstrap/dist/css/bootstrap.min.css'
import Success from "./SuccessPage/Success"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Admin/Login"
import Dashboards from "./Admin/Dashboards"
import PrivateRoute from "./PrivateRoute"


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<ExchangeForm/>}/>
          <Route path="/admin/login" element={<Login/>}/>
          <Route
            path="/admin/dashboard"
            element={<PrivateRoute element={<Dashboards/>}/>}
          />
          <Route path="/exchange" element={<ExchangeForm/>}/>
          <Route path="/success" element={<Success/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App