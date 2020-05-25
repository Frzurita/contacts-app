import React from 'react'
import { Router } from '@reach/router'
import Header from './Header'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import Editor from './Editor'
import PrivateRoute from './PrivateRoute'
import { getCurrentUser } from '../api/AuthAPI'
import useAuth, { AuthProvider } from '../context/auth'
import { ContactsProvider } from '../context/contacts'

function App() {
  const {
    state: { user, isAuthenticated },
    dispatch,
  } = useAuth()

  React.useEffect(() => {
    let ignore = false

    async function fetchUser() {
      try {
        const user = await getCurrentUser()
        if (!ignore) {
          dispatch({ type: 'LOAD_USER', user })
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (!user && isAuthenticated) {
      fetchUser()
    }

    return () => {
      ignore = true
    }
  }, [dispatch, isAuthenticated, user])

  if (!user && isAuthenticated) {
    return null
  }

  return (
    <React.Fragment>
      <Header />
      <Router>
        <Register path="register" />
        <Login path="login" />
        <PrivateRoute as={Home} path="/" default />
        <PrivateRoute as={Editor} path="/editor" />
        <PrivateRoute as={Editor} path="/editor/:id" />
      </Router>
    </React.Fragment>
  )
}

export default () => (
  <ContactsProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ContactsProvider>
)
