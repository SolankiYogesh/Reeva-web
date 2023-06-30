import React from 'react'
import { Route, Routes } from 'react-router-dom'

import ForgotPassword from '../Containers/Auth/ForgotPassword/ForgotPassword'
import Login from '../Containers/Auth/Login/Login'
import PasswordChanged from '../Containers/Auth/PasswordChanged/PasswordChanged'
import SetNewPassword from '../Containers/Auth/SetNewPassword/SetNewPassword'
import Signup from '../Containers/Auth/Signup/Signup'
import Verification from '../Containers/Auth/Verification/Verification'
import Init from '../Containers/Init'
import Paths from '../Helpers/Paths'

const AuthRouter = () => {
  return (
    <Routes>
      <Route Component={Init} path="*" />
      <Route Component={Login} path={Paths.Login} />
      <Route Component={Signup} path={Paths.Signup} />
      <Route Component={ForgotPassword} path={Paths.ForgotPassword} />
      <Route Component={Verification} path={Paths.Verification} />
      <Route Component={SetNewPassword} path={Paths.SetNewPassword} />
      <Route Component={PasswordChanged} path={Paths.PasswordChanged} />
    </Routes>
  )
}

export default AuthRouter
