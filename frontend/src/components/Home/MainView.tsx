import React from 'react'
import './MainView.scss'
import ContactList from '../ContactList'

export default function MainView() {
  return (
    <div className="contact-list__container">
      <ContactList />
    </div>
  )
}
