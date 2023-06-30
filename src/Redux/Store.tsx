import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import UserSlice from './Reducers/UserSlice'

const rootReducer = combineReducers({
  user: UserSlice
})

const middlewares = [thunk]

if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware: any = createLogger()
  middlewares.push(loggerMiddleware)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares
})

export default store
