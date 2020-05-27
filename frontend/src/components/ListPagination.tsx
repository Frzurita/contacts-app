import React from 'react'
import { ContactListAction } from '../reducers/contactList'
import { IContact } from '../types'

type ListPaginationProps = {
  page: number
  contacts: IContact[]
  isPaginationFinished: Boolean
  dispatch: React.Dispatch<ContactListAction>
}

export default function ListPagination({
  page,
  contacts,
  isPaginationFinished,
  dispatch,
}: ListPaginationProps) {
  const buttons: { label: string; number: number }[] = []
  if (page > 0) {
    buttons.push({ label: 'Previous', number: page - 1 })
  }
  if (!isPaginationFinished) {
    buttons.push({ label: 'Next', number: page + 1 })
  }
  return (
    <nav>
      <div className="pagination">
        {buttons.map(button => {
          return (
            <li
              className={'page-item'}
              onClick={() =>
                dispatch({ type: 'SET_PAGE', page: button.number })
              }
              key={button.number}
            >
              <button className="page-link">{button.label}</button>
            </li>
          )
        })}
      </div>
    </nav>
  )
}
