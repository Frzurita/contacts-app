import React from 'react'
import Banner from './Banner'
import MainView from './MainView'
import { RouteComponentProps } from '@reach/router'

export default function Home(_: RouteComponentProps) {
  return (
    <div className="home-page">
      <Banner />
      <div className="container page">
        <div className="row">
          <MainView />
        </div>
      </div>
    </div>
  )
}
