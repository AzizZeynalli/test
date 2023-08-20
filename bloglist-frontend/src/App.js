import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog' 
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'   
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception){
      setMessage('wrong username or password')
      setSuccess(false)
      setTimeout(() => {
        setMessage(null)
        setSuccess(true)
      }, 3000)
    } 
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try{
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch(exception){
      console.log(exception)
    }
  }

  const handleLike = async (blogObject) => {
    try{
      const id = blogObject.id
      const blogUpdated = await blogService.update(id, blogObject)
      const blogsWithUpdated = blogs.map(blog => blog.id === id ? blogUpdated : blog)
      blogsWithUpdated.sort((a, b) => b.likes - a.likes)
      setBlogs(blogsWithUpdated)
    } catch(exception){
      console.log(exception)
    }
  }

  const removeBlog = async (blogObject) => {
    try{
      const id = blogObject.id  
      const blogsWithoutDeleted = blogs.filter(blog => blog.id !== id)
      setBlogs(blogsWithoutDeleted)
      await blogService.remove(id)
    } catch(exception){
      console.log(exception)
    }
  }

  if(user === null){
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} success={success}/>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input 
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              />
          </div>
          <div>
            password
              <input  
              type="password"
              value={password}
              name="Password"
              onChange={( { target }) => setPassword(target.value)}
              />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} success={success}/>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog}/>
      </Togglable>
      <p>{blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} removeBlog={removeBlog} user={user}/>
      )}</p>
    </div>
  )
}

export default App