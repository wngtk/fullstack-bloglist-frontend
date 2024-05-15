import React from "react";

const Blog = ({ blog }) => {
  const [show, setShow] = React.useState(false);

  const toggle = () => {
    setShow(!show);
  }

  const handleLike = () => {
    console.log("like");
  }

  return (
    <div className="blog-container">
      {blog.title} <button onClick={toggle}>view</button>
      {
        show &&
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.like} <button onClick={handleLike}>like</button></p>
          <p>{blog.author}</p>
        </div>
      }
    </div>
  )
}

export default Blog