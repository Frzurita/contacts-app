import { navigate } from '@reach/router'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { IUser } from '../types'

export const TOKEN_KEY = 'token'
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    switch (error.response.status) {
      case 401:
        navigate('/login')
        break
      case 404:
      case 403:
        navigate('/')
        break
    }
    return Promise.reject(error.response)
  },
)

export function setToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

type JWTPayload = {
  id: string
  username: string
  exp: number
}

export function getUserFromAccessToken(token: string): IUser {
  const decodedJwt: JWTPayload = jwtDecode(token)
  return { username: decodedJwt.username }
}

export function isTokenValid(token: string) {
  try {
    const decodedJwt: JWTPayload = jwtDecode(token)
    const currentTime = Date.now().valueOf() / 1000
    return decodedJwt.exp > currentTime
  } catch (error) {
    return false
  }
}

export default axios
