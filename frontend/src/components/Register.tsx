import React from 'react'
import { Link, navigate, RouteComponentProps, Redirect } from '@reach/router'
import { register } from '../api/AuthAPI'
import useAuth from '../context/auth'
import ListErrors from './common/ListErrors'
import { IErrors } from '../types'

export default function Register(_: RouteComponentProps) {
  const [form, setForm] = React.useState({
    username: '',
    password: '',
  })

  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<IErrors | null>(null)
  const {
    state: { user },
    dispatch,
  } = useAuth()

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    })
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setLoading(true)
    const { username, password } = form
    try {
      const user = await register(username, password)
      dispatch({ type: 'LOAD_USER', user })
      navigate('/')
    } catch (error) {
      setLoading(false)
      console.log(error)
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
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>
            {errors && <ListErrors errors={errors} />}
            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  name="username"
                  className="form-control form-control-lg"
                  type="text"
                  value={form.username}
                  placeholder="Your Name"
                  onChange={handleChange}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  value={form.password}
                  placeholder="Password"
                  onChange={handleChange}
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                disabled={loading}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
