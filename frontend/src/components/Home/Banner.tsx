import React from 'react'
import './Banner.scss'
import useAuth from '../../context/auth'

export default function Banner() {
  const {
    state: { user },
  } = useAuth()
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">{user?.username}</h1>
        <p>Your list of contact</p>
      </div>
    </div>
  )
}
