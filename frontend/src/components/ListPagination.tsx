import React from 'react'
import { ContactListAction } from '../reducers/contactList'

type ListPaginationProps = {
  page: number
  contactsCount: number
  dispatch: React.Dispatch<ContactListAction>
}

export default function ListPagination({
  page,
  contactsCount,
  dispatch,
}: ListPaginationProps) {
  const pageNumbers = []

  for (let i = 0; i < Math.ceil(contactsCount / 10); ++i) {
    pageNumbers.push(i)
  }

  if (contactsCount <= 10) {
    return null
  }

  return (
    <nav>
      <div className="pagination">
        {pageNumbers.map(number => {
          const isCurrent = number === page
          return (
            <li
              className={isCurrent ? 'page-item active' : 'page-item'}
              onClick={() => dispatch({ type: 'SET_PAGE', page: number })}
              key={number}
            >
              <button className="page-link">{number + 1}</button>
            </li>
          )
        })}
      </div>
    </nav>
  )
}
