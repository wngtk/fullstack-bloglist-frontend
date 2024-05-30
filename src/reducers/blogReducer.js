import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    like(state, action) {
      return state.map((x) => (x.id === action.payload.id ? action.payload : x))
    },
  },
})

const { appendBlog, setBlogs, like } = blogSlice.actions

export const initialBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const likeBlog = (id) => {
  return async (dispatch, getState) => {
    const likedBlog = await blogService.like(
      getState().blogs.find((x) => x.id === id)
    )
    dispatch(like(likedBlog))
  }
}

export const deleteBlog = (blogToDelete) => {
  return async (dispatch, getState) => {
    await blogService.remove(blogToDelete)
    dispatch(setBlogs(getState().blogs.filter((x) => x.id !== blogToDelete.id)))
  }
}

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.create(newBlog)
    dispatch(appendBlog(returnedBlog))
  }
}

export default blogSlice.reducer
