import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import UserContext from '../UserContext'
import blogService from '../services/blogs'

const Blog = ({ blog, blogComments, commentsDispatch }) => {
  const [show, setShow] = useState(false)
  const [user] = useContext(UserContext)
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const toggle = () => {
    setShow(!show)
  }

  const likeBlogMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (data) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (b.id === data.id ? { ...b, likes: data.likes } : b))
      )
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, removedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== removedBlog.id)
      )
    },
  })

  const handleLike = async () => {
    likeBlogMutation.mutate(blog)
  }

  const removeBlog = async () => {
    if (blog.user.username !== user.username) {
      return
    }
    deleteBlogMutation.mutate(blog)
  }

  const handleAddComment = () => {
    commentsDispatch({ type: 'ADD_COMMENT', payload: { id: blog.id, comment } })
    setComment('')
  }

  return (
    <div className="blog-container">
      <h1>{blog.title}</h1>
      <div>
        <a className="url" href={blog.url}>
          {blog.url}
        </a>
        <p className="likes">
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p className="author">{blog.author}</p>
        {blog.user.username === user.username && (
          <button onClick={removeBlog}>remove</button>
        )}
      </div>
      <h4>comments</h4>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleAddComment}>add comment</button>
      <ul>
        {blogComments &&
          blogComments.map((comment, index) => <li key={index}>{comment}</li>)}
      </ul>
    </div>
  )
}

export default Blog
