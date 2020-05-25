export interface IContact {
  id?: string
  name: string
  lastName: string
  email: string
  phoneNumber: string
}

export interface IUser {
  username: string
}

export interface IErrors {
  [key: string]: string[]
}
