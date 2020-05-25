import API, { TOKEN_KEY, getUserFromAccessToken, setToken } from './APIUtils'
import { IUser } from '../types'
import { setLocalStorage, getLocalStorageValue } from '../utils'

type User = {
  user: IUser & { accessToken: string }
}

type AuthResponseDto = { accessToken: string }

function handleUserResponse({ accessToken }: AuthResponseDto) {
  setLocalStorage(TOKEN_KEY, accessToken)
  setToken(accessToken)
  return getCurrentUser()
}

export const getCurrentUser = function(): IUser {
  return getUserFromAccessToken(getLocalStorageValue(TOKEN_KEY))
}

export function login(username: string, password: string) {
  return API.post<AuthResponseDto>('/auth/signin', {
    username,
    password,
  }).then(user => handleUserResponse(user.data))
}

export function register(username: string, password: string) {
  return API.post<AuthResponseDto>('/auth/signup', { username, password }).then(
    user => {
      return handleUserResponse(user.data)
    },
  )
}

export function updateUser(user: IUser & Partial<{ password: string }>) {
  return API.put<User>('/user', { user })
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  setToken(null)
}
