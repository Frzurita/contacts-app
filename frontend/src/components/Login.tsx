import React from 'react'
import { login } from '../api/AuthAPI'
import ListErrors from './common/ListErrors'
import useAuth from '../context/auth'
import { navigate, Link, RouteComponentProps, Redirect } from '@reach/router'
import { IErrors } from '../types'

export default function Login(_: RouteComponentProps) {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<IErrors | null>()
  const {
    state: { user },
    dispatch,
  } = useAuth()

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const user = await login(username, password)
      dispatch({ type: 'LOAD_USER', user })
      navigate('/')
    } catch (error) {
      setLoading(false)
      if (error.data.statusCode) {
        const messageType = typeof error.data.message
        const message = error.data.message
        setErrors({
          [`${error.data.error}:`]:
            messageType === 'string' ? [message] : message,
        })
      }
    }
  }

  if (user) {
    return <Redirect to="/" noThrow />
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>
            {errors && <ListErrors errors={errors} />}
            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  name="username"
                  className="form-control form-control-lg"
                  type="text"
                  value={username}
                  placeholder="User name"
                  onChange={event => setUsername(event.target.value)}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={event => setPassword(event.target.value)}
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={loading}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
