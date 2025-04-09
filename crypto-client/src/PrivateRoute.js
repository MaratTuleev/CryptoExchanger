import { Navigate } from 'react-router-dom'
import Cookies from "js-cookie"

const PrivateRoute = ({element: Element}) => {
  const isAuthenticated = Cookies.get('admin-cookie') === 'true'

  return isAuthenticated ? Element : <Navigate to="/admin/login"/>
}

export default PrivateRoute