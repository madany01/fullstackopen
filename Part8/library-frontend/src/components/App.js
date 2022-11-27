import { ApolloProvider } from '@apollo/client'
import { useState } from 'react'

import apolloClient from '../apolloClient'
import Authors from './Authors'
import Books from './Books'
import NewBook from './NewBook'
import LoginForm from './LoginForm'
import RecommendedBooks from './RecommendedBooks'

const PAGES = {
  AUTHORS: 'Authors',
  BOOKS: 'Books',
  ADD_BOOK: 'AddBook',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  RECOMMENDED_BOOK: 'RecommendedBooks',
}

function App() {
  const [page, setPage] = useState(PAGES.BOOKS)
  const [token, setToken] = useState(null)

  const loggedIn = Boolean(token)

  const onAuthentication = authToken => {
    setToken(authToken)
    localStorage.setItem('token', authToken)
    setPage(PAGES.AUTHORS)
  }

  const handleLogout = async () => {
    setToken(null)
    localStorage.removeItem('token')
    setPage(PAGES.AUTHORS)
    await apolloClient.resetStore()
  }

  const switchTo = page => () => setPage(page)

  return (
    <ApolloProvider client={apolloClient}>
      <div>
        <div>
          <button onClick={switchTo(PAGES.AUTHORS)}> authors </button>
          <button onClick={switchTo(PAGES.BOOKS)}> books </button>
          {!loggedIn && <button onClick={switchTo(PAGES.LOGIN)}> login </button>}

          {loggedIn && (
            <button onClick={switchTo(PAGES.ADD_BOOK)}> add book </button>
          )}
          {loggedIn && (
            <button onClick={switchTo(PAGES.RECOMMENDED_BOOK)}>recommended</button>
          )}
          {loggedIn && <button onClick={handleLogout}> logout </button>}
        </div>

        <hr />

        <Authors show={page === PAGES.AUTHORS} loggedIn={loggedIn} />
        <Books show={page === PAGES.BOOKS} />
        <NewBook show={page === PAGES.ADD_BOOK} />

        <RecommendedBooks
          key={token || 'anonymous'}
          show={page === PAGES.RECOMMENDED_BOOK}
        />

        <LoginForm
          onAuthentication={onAuthentication}
          show={page === PAGES.LOGIN}
        />
      </div>
    </ApolloProvider>
  )
}

export default App
