import {useEffect, useRef, useState} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Toggleable from "./components/Toggleable.jsx";
import * as PropTypes from "prop-types";

function Notification({value}) {
  return <div className="notification">{value}</div>;
}

function BlogForm({createBlog}) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = ({target}) => { setTitle(target.value) }
  const handleAuthorChange = ({target}) => { setAuthor(target.value) }
  const handleUrlChange = ({target}) => { setUrl(target.value) }

  const handleCreate = (event) => {
    event.preventDefault()
    createBlog({
      title, author, url,
    })
    console.log("creating blog")
  }

  return <div>
    <h2>create new</h2>
    <form onSubmit={handleCreate}>
      <p>title:<input type="text" value={title} onChange={handleTitleChange}/></p>
      <p>author: <input type="text" value={author} onChange={handleAuthorChange}/></p>
      <p>url: <input type="text" value={url} onChange={handleUrlChange}/></p>
      <button>create</button>
    </form>
  </div>;
}

BlogForm.propTypes = {
  onSubmit: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  value1: PropTypes.string,
  onChange1: PropTypes.func,
  value2: PropTypes.string,
  onChange2: PropTypes.func
};
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
            <button>login</button>
          </form>
        </Toggleable>
      </div>
    )
  }

  // async function handleCreate(e) {
  //   e.preventDefault()
  //   console.log('creating blog list', title, author, url)
  //   try {
  //     await blogService.create({
  //       title: title,
  //       author: author,
  //       url: url
  //     })
  //     blogFormRef.current.toggleVsible()
  //     setNotification(true)
  //     setNoteText(`a new blog ${title} by ${author} added`)
  //     setTitle('')
  //     setAuthor('')
  //     setUrl('')
  //     setTimeout(() => { setNotification(false) }, 3000)
  //   } catch (e) {
  //     console.log('creation fails', e)
  //   }
  // }

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVsible()
    blogService
      .create(newBlog)
      .then((returnedBlog) => {
        setBlogs([...blogs, returnedBlog])
      })
  }

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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog}/>
      )}
    </div>
  )
}

export default App