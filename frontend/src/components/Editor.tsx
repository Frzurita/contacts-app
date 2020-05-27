import React from 'react'
import 'react-phone-number-input/style.css'
import './Editor.scss'
import PhoneInput from 'react-phone-number-input'
import { editorReducer, initalState } from '../reducers/editor'
import useContacts from '../context/contacts'
import { RouteComponentProps, navigate } from '@reach/router'
import { updateContact, createContact } from '../api/ContactsAPI'
import ListErrors from './common/ListErrors'

export default function Editor({
  id = '',
}: RouteComponentProps<{ id: string }>) {
  const [state, dispatch] = React.useReducer(editorReducer, initalState)

  const {
    state: { contacts },
  } = useContacts()

  React.useEffect(() => {
    let ignore = false

    const fetchContact = () => {
      try {
        const contact = contacts.find(contact => contact.id === id)
        if (!ignore) {
          if (contact) {
            dispatch({
              type: 'SET_FORM',
              form: {
                name: contact.name,
                lastName: contact.lastName,
                email: contact.email,
                phoneNumber: contact.phoneNumber,
              },
            })
          } else {
            navigate(`/`)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (id) {
      fetchContact()
    }
    return () => {
      ignore = true
    }
  }, [contacts, id])

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // @ts-ignore
    dispatch({
      type: 'UPDATE_FORM',
      field: {
        key: event.currentTarget.name,
        value: event.currentTarget.value,
      },
    })
  }

  const handleChangePhone = (phoneNumber: string) => {
    // @ts-ignore
    console.log(phoneNumber)
    dispatch({
      type: 'UPDATE_FORM',
      field: {
        key: 'phoneNumber',
        value: phoneNumber,
      },
    })
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      const contact = state.form
      if (id) {
        await updateContact({ id, ...contact })
      } else {
        await createContact(contact)
      }
      navigate(`/`)
    } catch (error) {
      if (error.data.statusCode) {
        const messageType = typeof error.data.message
        const message = error.data.message

        dispatch({
          type: 'SET_ERRORS',
          errors: {
            [`${error.data.error}:`]:
              messageType === 'string' ? [message] : message,
          },
        })
      }
    }
  }
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={state.errors} />

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  name="name"
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Contact Name"
                  value={state.form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  name="lastName"
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Last Name"
                  value={state.form.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  name="email"
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  value={state.form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <PhoneInput
                  placeholder="Enter phone number"
                  value={state.form.phoneNumber}
                  onChange={handleChangePhone}
                />
              </div>

              <button
                className="btn btn-lg pull-xs-right btn-primary"
                type="submit"
              >
                Publish Contact
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
