import API from './APIUtils'
import { IContact } from '../types'

const encode = encodeURIComponent

type Contacts = Array<IContact>

type Contact = IContact

function limit(count: number, p: number) {
  return `limit=${count}&offset=${p ? p * count : 0}`
}

export function getContacts(page: number) {
  return API.get<Contacts>(`/contacts?${limit(10, page)}`)
}

export function deleteContact(id: string) {
  return API.delete<null>(`/contacts/${id}`)
}

export function updateContact(contact: IContact) {
  return API.put<Contact>(`/contacts/${contact.id}`, {
    name: contact.name,
    lastName: contact.lastName,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
  })
}

export function createContact(contact: IContact) {
  return API.post<Contact>('/contacts', contact)
}
