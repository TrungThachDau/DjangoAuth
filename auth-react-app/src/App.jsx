
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignIn from './pages/authentication/sign_in/sign_in';
import SignUp from './pages/authentication/sign_up/sign_up';
import './App.css'
import '@ant-design/v5-patch-for-react-19';
import Customer from "./pages/customer/customer.jsx";
import ResetPassword from "./pages/authentication/reset_password/reset_password.jsx";
import ConfirmPassword from "./pages/authentication/confirm-password/confirm_password.jsx";
import SignOut from "./pages/authentication/sign_out/sign_out.jsx";
import NotFound from "./pages/not_found/not_found.jsx";
import ChangePassword from "./pages/authentication/change_password/change_password.jsx";
import Detail from "./pages/customer/detail/detail.jsx";
import AddCustomer from "./pages/customer/add/add.jsx";
import UpdateCustomer from "./pages/customer/update/update.jsx";
function App() {

  return (
    <>
     <BrowserRouter>
        <Routes>
            <Route path="/"  element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<SignIn />}></Route>
            <Route path="/sign-up" element={<SignUp />}></Route>
            <Route path="/customer" element={<Customer />}></Route>
            <Route path="/reset-password" element={<ResetPassword />}></Route>
            <Route path="/confirm-password" element={<ConfirmPassword />}></Route>
            <Route path="/sign-out" element={<SignOut />}></Route>
            <Route path="/change-password" element={<ChangePassword />}></Route>
            <Route path="/customer/add" element={<AddCustomer />}></Route>
            <Route path="/customer/:customerId" element={<Detail />}></Route>
            <Route path="/customer/update/:customerId" element={<UpdateCustomer />}></Route>
            <Route path="*" element={<NotFound />} />
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
