import React from 'react'
import useAuth from '../context/auth'
import Login from './Login'
import { RouteComponentProps } from '@reach/router'

interface PrivateRouteProps extends RouteComponentProps {
  as: React.ElementType<any>
}

export default function PrivateRoute({
  as: Comp,
  ...props
}: PrivateRouteProps) {
  const {
    state: { user },
  } = useAuth()
  return user ? <Comp {...props} /> : <Login />
}
