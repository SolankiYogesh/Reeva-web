import './App.scss'
import 'react-toastify/dist/ReactToastify.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import store from './Redux/Store'
import AppRouter from './Routers/AppRouter'

const App = () => {
  return (
    <GoogleOAuthProvider clientId="1015544764254-lpc0k2tj2v057ji4812lbo4j9l5dlh4t.apps.googleusercontent.com">
      <Provider store={store}>
        <AppRouter />

        <ToastContainer
          position="top-center"
          autoClose={2000}
          newestOnTop={false}
          closeOnClick
          hideProgressBar
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Provider>
    </GoogleOAuthProvider>
  )
}

export default App
