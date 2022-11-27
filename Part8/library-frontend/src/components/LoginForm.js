import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { LOGIN } from '../queries'

function LoginForm({ show, onAuthentication }) {
  const [username, setUsername] = useState('ahmad')
  const [password, setPassword] = useState('secret123')

  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: data => {
      const token = data.login.value
      onAuthentication(token)
    },
    onError: e => console.error(e),
  })

  if (!show) return null

  const handleSubmit = e => {
    e.preventDefault()
    if (loading) return

    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <h3> {error.message} </h3>}
      <div>
        username
        <input
          type='text'
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

      <button type='submit' disabled={loading}>
        login
      </button>
    </form>
  )
}

export default LoginForm
