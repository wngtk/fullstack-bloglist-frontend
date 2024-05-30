import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    addNotification(state, action) {
      return action.payload
    },
  },
})

const { addNotification } = notificationSlice.actions

export const setNotification = (content, ms = 5000) => {
  return async (dispatch) => {
    dispatch(addNotification(content))
    setTimeout(() => {
      dispatch(addNotification(''))
    }, ms)
  }
}

export default notificationSlice.reducer
