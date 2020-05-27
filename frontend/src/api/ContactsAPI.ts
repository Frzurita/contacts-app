import API from './APIUtils'
import { IContact } from '../types'

type Contacts = Array<IContact>

type Contact = IContact

export function getContacts(page: number, contactSearch: String | undefined) {
  let url = `/contacts?page=${page}`
  if (contactSearch) {
    url = url + `&search=${contactSearch}`
  }
  return API.get<Contacts>(url)
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
