import React from 'react'
import './Header.scss'
import { Link, LinkGetProps, LinkProps, navigate } from '@reach/router'
import useAuth from '../context/auth'
import { IUser } from '../types'
import { logout } from '../api/AuthAPI'
import { APP_NAME } from '../utils'

export default function Header() {
  const {
    state: { user },
    dispatch,
  } = useAuth()

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          {APP_NAME}
        </Link>
        {user ? (
          <LoggedInView user={user} handleLogout={handleLogout} />
        ) : (
          <LoggedOutView />
        )}
      </div>
    </nav>
  )
}

const LoggedInView = ({
  user: { username },
  handleLogout,
}: {
  user: IUser
  handleLogout: any
}) => (
  <ul className="nav navbar-nav pull-xs-right">
    <li className="nav-item">
      <NavLink to="/">Home</NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/editor">
        <i className="ion-compose" />
        &nbsp;New Contact
      </NavLink>
    </li>

    <li className="nav-item no-link">{username}</li>

    <li className="nav-item no-link pointer" onClick={handleLogout}>
      Logout
    </li>
  </ul>
)

const LoggedOutView = () => (
  <ul className="nav navbar-nav pull-xs-right">
    <li className="nav-item">
      <NavLink to="/">Home</NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/login">Sign in</NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/register">Sign up</NavLink>
    </li>
  </ul>
)

const NavLink = (props: LinkProps<{}>) => (
  // @ts-ignore
  <Link getProps={isActive} {...props} />
)

const isActive = ({ isCurrent }: LinkGetProps) => {
  return isCurrent
    ? { className: 'nav-link active' }
    : { className: 'nav-link' }
}
