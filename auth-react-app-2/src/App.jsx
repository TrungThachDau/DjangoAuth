
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignIn from './pages/sign_in/sign_in';
import SignUp from './pages/sign_up/sign_up';
import './App.css'
import '@ant-design/v5-patch-for-react-19';
import Customer from "./pages/customer/customer.jsx";
import ResetPassword from "./pages/reset_password/reset_password.jsx";
import ConfirmPassword from "./pages/confirm-password/confirm_password.jsx";

function App2() {
  return (
    <>
     <BrowserRouter basename="/fe2/">
        <Routes>
            <Route path="/"  element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<SignIn />}></Route>
            <Route path="/sign-up" element={<SignUp />}></Route>
            <Route path="/customer" element={<Customer />}></Route>
            <Route path="/reset-password" element={<ResetPassword />}></Route>
            <Route path="/confirm-password" element={<ConfirmPassword />}></Route>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App2
