import { useState } from "react";

const Blog = ({ blog, onLikeClick, onRemoveClick, removable }) => {
  const [show, setShow] = useState(false);

  const toggle = () => {
    setShow(!show);
  }

  return (
    <div className="blog-container">
      <span>{blog.title}</span> <button onClick={toggle}>{ !show ? "view" : "hide" }</button>
      {
        show &&
        <div>
          <p className="url">{blog.url}</p>
          <p className="likes">likes {blog.likes} <button onClick={onLikeClick}>like</button></p>
          <p className="author">{blog.author}</p>
          {
            removable &&
            <button onClick={onRemoveClick}>remove</button>
          }
        </div>
      }
    </div>
  )
}

export default Blog