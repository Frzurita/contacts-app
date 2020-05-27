import React from 'react'
import { ContactListAction } from '../reducers/contactList'

type ListSearchProp = {
  contactSearch: string
  dispatch: React.Dispatch<ContactListAction>
}

export default function ListPagination({
  dispatch,
  contactSearch,
}: ListSearchProp) {
  return (
    <form>
      <fieldset className="form-group">
        <input
          name="search"
          className="form-control form-control-lg"
          type="text"
          value={contactSearch}
          placeholder="Search contact"
          onChange={event =>
            dispatch({
              type: 'SET_CONTACT_SEARCH',
              contactSearch: event.target.value,
            })
          }
        />
      </fieldset>
    </form>
  )
}
