import { useState } from 'react'
import { LOGIN } from '../services/queries'
import { useMutation } from '@apollo/client/react'


function LoginForm(props) {
  const { setToken, setPage } = props
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login ] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)

      setPage('authors')
      console.log(`success login of ${username}!`)
    },
    onError: (error) => {
      alert(error.message)
    }
  })

  async function handleLogin(event) {
    event.preventDefault()
    login({ variables: {username, password}})
  }

  if (!props.show) {
    return null
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        username 
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password 
        <input
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <button type='submit'>Login</button>
    </form>
  )
}

export default LoginForm
