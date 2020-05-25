import React from 'react'
import './ContactList.scss'
import ContactPreview from './ContactPreview'
import { getContacts } from '../api/ContactsAPI'
import useContacts from '../context/contacts'
import { IContact } from '../types'

const loadContacts = (page = 0) => {
  return getContacts(page)
}

export default function ContactList() {
  const {
    state: { contacts, loading, error, page },
    dispatch,
  } = useContacts()

  React.useEffect(() => {
    let ignore = false
    async function fetchContacts() {
      dispatch({ type: 'FETCH_CONTACTS_BEGIN' })
      try {
        const { data } = await loadContacts(page)
        if (!ignore) {
          dispatch({ type: 'FETCH_CONTACTS_SUCCESS', payload: data })
        }
      } catch (error) {
        if (!ignore) {
          dispatch({ type: 'FETCH_CONTACTS_ERROR', error })
        }
      }
    }
    fetchContacts()
    return () => {
      ignore = true
    }
  }, [dispatch, page])

  if (loading) {
    return <div className="contact-preview">Loading...</div>
  }

  if (contacts.length === 0) {
    return <div className="contact-preview">No contacts are here... yet.</div>
  }

  return (
    <React.Fragment>
      {contacts.map((contact: IContact) => (
        <ContactPreview
          key={contact.email}
          contact={contact}
          dispatch={dispatch}
        />
      ))}
    </React.Fragment>
  )
}
