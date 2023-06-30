import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = { ...(state.userData ?? {}), ...action.payload }
      try {
        localStorage.setItem(
          'userData',
          JSON.stringify({ ...(state.userData ?? {}), ...action.payload })
        )
      } catch (error) {}
    },
    setToken: (state, action) => {
      const cloneUser: any = _.clone(state.userData)
      cloneUser.token = action.payload?.token
      cloneUser.refresh_token = action.payload?.refresh_token

      state.userData = cloneUser
      try {
        localStorage.setItem('userData', JSON.stringify(cloneUser))
      } catch (error) {}
    },
    logOut: (state) => {
      state.userData = null
      try {
        localStorage.removeItem('userData')
      } catch (error) {}
    },
    setPlanData: (state, action) => {
      const cloneUser: any = _.cloneDeep(state?.userData)
      cloneUser.plan_details = { ...(cloneUser?.plan_details ?? {}), ...action.payload }
      state.userData = cloneUser
      try {
        localStorage.setItem('userData', JSON.stringify(cloneUser))
      } catch (error) {}
    }
  }
})
export const { logOut, setUserData, setToken, setPlanData } = UserSlice.actions
export default UserSlice.reducer
