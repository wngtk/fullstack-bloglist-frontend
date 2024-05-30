import axios from 'axios'
import { useEffect, useState } from 'react'

const Users = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    axios.get('/api/users').then((res) => setUsers(res.data))
  }, [])

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th style={{fontWeight: "bold"}}>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.username}>
              <td>{u.username}</td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul></ul>
    </div>
  )
}

export default Users
