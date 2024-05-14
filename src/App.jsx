import {useEffect, useState} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const user = window.localStorage.getItem('blogListsLoggedUser')
    if (user) {
      setUser(JSON.parse(user))
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
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="username">username:</label>
          <input type="text" name="username" id="username" onChange={({target}) => setUsername(target.value)} />
          <br/>
          <label htmlFor="password">password:</label>
          <input type="password" name="password" id="password" onChange={({target}) => setPassword(target.value)} />
          <br/>
          <button>login</button>
        </form>
      </div>
    )
  }

  async function handleCreate(e) {
    e.preventDefault()
    console.log('creating blog list')
  }

  return (
    <div>
        <h2>blogs</h2>
      { user &&
      <p>{user.username} logged in <button>logout</button></p>
      }
      <div>
        <h2>create new</h2>
        <form onSubmit={handleCreate}>
          <p>title:<input type="text" /></p>
          <p>author: <input type="text"/></p>
          <p>url: <input type="text"/></p>
          <button>create</button>
        </form>
      </div>
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog}/>
        )}
    </div>
  )
}

export default App