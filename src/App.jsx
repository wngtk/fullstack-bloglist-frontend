import {useEffect, useRef, useState} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Toggleable from "./components/Toggleable.jsx";
import BlogForm from "./components/BlogForm.jsx";

function Notification({value}) {
  return <div className="notification">{value}</div>;
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(false)
  const [noteText, setNoteText] = useState('')
  const blogFormRef = useRef(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('blogListsLoggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('blogListsLoggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      console.log('Wrong credentials', e)
      setNotification(true)
      setNoteText('wrong username or password')
      setTimeout(() => { setNotification(false) }, 3000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Toggleable label={"login"}>
          <form onSubmit={handleLogin}>
            <label htmlFor="username">username:</label>
            <input type="text" name="username" id="username" onChange={({target}) => setUsername(target.value)} />
            <br/>
            <label htmlFor="password">password:</label>
            <input type="password" name="password" id="password" onChange={({target}) => setPassword(target.value)} />
            <br/>
            <button id="login-button">login</button>
          </form>
        </Toggleable>
      </div>
    )
  }

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVsible()
    blogService
      .create(newBlog)
      .then((returnedBlog) => {
        setBlogs([...blogs, returnedBlog])
      })
  }

  const handleLike = async (id) => {
    setBlogs(blogs.map(blog => {
      return blog.id === id ? {...blog, likes: blog.likes + 1} : blog
    }))
    const returnBlog = await blogService.like(blogs.find(blog => blog.id === id))
    console.log("like", returnBlog);
  }

  const removeBlog = async (blogToDelete) => {
    if (blogToDelete.user.username !== user.username) {
      return
    }
    const yes = window.confirm("Are you sure you want to delete this blog?")
    if (!yes) return
    await blogService.remove(blogToDelete)
    setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
  }

  const sortedBlogs = [...blogs].sort((a, b) => { return a.likes < b.likes ? 1 : -1; })

  return (
    <div>
      <h2>blogs</h2>
      {
        notification &&
        <Notification value={noteText}/>
      }
      {
        user &&
        <p>{user.username} logged in <button>logout</button></p>
      }
      <Toggleable label={"create new blog"} ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Toggleable>
      {
        sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog}
                onLikeClick={() => handleLike(blog.id)}
                onRemoveClick={() => removeBlog(blog)}/>
        )
      }
    </div>
  )
}

export default App