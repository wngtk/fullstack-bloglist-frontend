import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(_, action) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export const login = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('blogListsLoggedUser', user)
    blogService.setToken(user.token)
    dispatch(setUser(user))
  }
}

export default userSlice.reducer
