import React from 'react'
import {
  contactsReducer,
  initialState,
  ContactListAction,
  ContactListState,
} from '../reducers/contactList'

type ContactListContextProps = {
  state: ContactListState
  dispatch: React.Dispatch<ContactListAction>
}

const ContactsContext = React.createContext<ContactListContextProps>({
  state: initialState,
  dispatch: () => initialState,
})

export function ContactsProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer(contactsReducer, initialState)
  return <ContactsContext.Provider value={{ state, dispatch }} {...props} />
}

export default function useContacts() {
  const context = React.useContext(ContactsContext)
  if (!context) {
    throw new Error(`useContacts must be used within an ContactsProvider`)
  }
  return context
}
