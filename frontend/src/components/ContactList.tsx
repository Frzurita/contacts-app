import React from 'react'
import './ContactList.scss'
import ListSearch from './ListSearch'
import ContactPreview from './ContactPreview'
import ListPagination from './ListPagination'
import { getContacts } from '../api/ContactsAPI'
import useContacts from '../context/contacts'
import { IContact } from '../types'

const loadContacts = (
  page = 0,
  contactSearch: String | undefined = undefined,
) => {
  return getContacts(page, contactSearch)
}

export default function ContactList() {
  const {
    state: { contacts, loading, page, isPaginationFinished, contactSearch },
    dispatch,
  } = useContacts()

  React.useEffect(() => {
    let ignore = false
    async function fetchContacts() {
      dispatch({ type: 'FETCH_CONTACTS_BEGIN' })
      try {
        const { data } = await loadContacts(page, contactSearch)
        if (!ignore) {
          if (
            process.env.REACT_APP_PAGE_SIZE &&
            data.length > parseInt(process.env.REACT_APP_PAGE_SIZE)
          ) {
            data.pop()
            dispatch({
              type: 'SET_IS_PAGINATION_FINISHED',
              isPaginationFinished: false,
            })
          } else {
            dispatch({
              type: 'SET_IS_PAGINATION_FINISHED',
              isPaginationFinished: true,
            })
          }
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
  }, [dispatch, page, contactSearch])

  return (
    <React.Fragment>
      <ListSearch dispatch={dispatch} contactSearch={contactSearch} />
      {loading && <div className="contact-preview">Loading...</div>}
      {contacts.length === 0 && !contactSearch && (
        <div className="contact-preview">No contacts are here... yet.</div>
      )}
      {contacts.length === 0 && contactSearch && (
        <div className="contact-preview">No contacts founds...</div>
      )}
      {!loading &&
        contacts.length > 0 &&
        contacts.map((contact: IContact) => (
          <ContactPreview
            key={contact.email}
            contact={contact}
            dispatch={dispatch}
          />
        ))}
      <ListPagination
        page={page}
        isPaginationFinished={isPaginationFinished}
        contacts={contacts}
        dispatch={dispatch}
      />
    </React.Fragment>
  )
}
