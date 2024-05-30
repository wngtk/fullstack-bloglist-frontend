import { useContext, useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Toggleable from './components/Toggleable.jsx'
import BlogForm from './components/BlogForm.jsx'
import NotificationContext from './NotificationContext.jsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import UserContext from './UserContext.jsx'
import { Link, Route, Routes, useMatch } from 'react-router-dom'
import Users from './components/Users.jsx'
import User from './components/User.jsx'

function Notification() {
  const [notification] = useContext(NotificationContext)

  if (!notification) return null

  return <div className="notification">{notification}</div>
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef(null)

  const [, notificationDispatch] = useContext(NotificationContext)
  const [user, userDispatch] = useContext(UserContext)

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    },
  })

  const blogs = result.data

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('blogListsLoggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const match = useMatch('/blogs/:id')

  if (result.isLoading) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('blogListsLoggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
      setUsername('')
      setPassword('')
    } catch (e) {
      console.log('Wrong credentials', e)
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: 'wrong username or password',
      })
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification />

        <Toggleable label={'login'}>
          <form onSubmit={handleLogin}>
            <label htmlFor="username">username:</label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={({ target }) => setUsername(target.value)}
            />
            <br />
            <label htmlFor="password">password:</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
            />
            <br />
            <button id="login-button">login</button>
          </form>
        </Toggleable>
      </div>
    )
  }

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVsible()
    newBlogMutation.mutate({ ...newBlog })
  }

  const sortedBlogs = [...blogs].sort((a, b) => {
    return a.likes < b.likes ? 1 : -1
  })

  const Home = () => (
    <>
      <Toggleable label={'create new blog'} ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Toggleable>
      {sortedBlogs.map((blog) => (
        <div
          style={{ padding: '8px', border: 'solid 1px black', margin: '8px' }}
          key={blog.id}
        >
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      ))}
    </>
  )

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <h2>blogs</h2>
      <nav>
        <Link to={'/'} style={padding}>blogs</Link>
        <Link to={'/users'} style={padding}>users</Link>
        {user && (
            <span><span style={{fontWeight: "bold"}}>{user.username}</span> logged in <button>logout</button></span>
        )}
      </nav>
      <Notification />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<User />} />
        <Route path="blogs/:id" element={<Blog blog={blog} />} />
      </Routes>
    </div>
  )
}

export default App
