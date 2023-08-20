import { useState } from 'react'

const Blog = ({blog, handleLike, removeBlog, user }) => {

  const blogStyle = {
    paddingTop: 12,
    paddingLeft: 3,
    border: 'solid',
    borderWidth: 2,
    borderColor: 'indigo',
    marginBottom: 6
  }

  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const likeMethod = async () => {
    const blogToUpdate = {...blog}
    blogToUpdate['likes'] = likes + 1
    await handleLike(blogToUpdate)
    setLikes(likes + 1)
  }

  const removeMethod = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      await removeBlog(blog)
    }
  }

  const deleteButton = () => {
    return <button onClick={removeMethod}>remove</button>
  }

  if (showDetails){
    return(
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(false)}>hide</button>
        <br/>
        {blog.url}
        <br/>
        likes {likes}
        <button onClick={likeMethod}>like</button>
        <br/>
        {blog.user.name}
        {blog.user.name === user.name && deleteButton()}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(true)}>view</button>
    </div>  
  )
}

export default Blog