import React from 'react'
import './ContactPreview.scss'
import { navigate } from '@reach/router'
import { formatPhoneNumberIntl } from 'react-phone-number-input'
import { IContact } from '../types'
import { ContactListAction } from '../reducers/contactList'
import { deleteContact } from '../api/ContactsAPI'
import useContacts from '../context/contacts'

type ContactPreviewProps = {
  contact: IContact
  dispatch: React.Dispatch<ContactListAction>
}

export default function ContactPreview({
  contact,
  dispatch,
}: ContactPreviewProps) {
  const {
    state: { contacts },
  } = useContacts()

  const onDeleteContactClicked = async (event: React.SyntheticEvent) => {
    event.stopPropagation()
    if (contact.id) {
      try {
        await deleteContact(contact.id)
        dispatch({
          type: 'FETCH_CONTACTS_SUCCESS',
          payload: contacts.filter(
            listContact => listContact.id !== contact.id,
          ),
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
  const goToContactForm = () => {
    navigate(`/editor/${contact.id}`)
  }
  const handleStopClick = (event: React.SyntheticEvent) => {
    event.stopPropagation()
  }

  return (
    <div onClick={goToContactForm}>
      <div className="contact">
        <div className="contact__name">
          <span>{`${contact.name.split('')[0]}${
            contact.lastName.split('')[0]
          }`}</span>
        </div>
        <div className="contact__info">
          <h2>{contact.lastName}</h2>
          <h3>{contact.name}</h3>
          <div>
            <a href={`mailto:${contact.email}`} onClick={handleStopClick}>
              <i className="ion-email" />
              &nbsp;{contact.email}
            </a>
          </div>
          <div>
            <a href={`tel:${contact.phoneNumber}`} onClick={handleStopClick}>
              <i className="ion-android-call" />
              &nbsp;{formatPhoneNumberIntl(contact.phoneNumber)}
            </a>
          </div>
        </div>
        <div className="contact__actions">
          <button
            className="btn btn-lg btn-danger pull-xs-right"
            type="submit"
            onClick={onDeleteContactClicked}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
