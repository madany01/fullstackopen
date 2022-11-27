import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

import AuthorsTable from './AuthorsTable'
import AuthorBornForm from './AuthorBornForm'

const Authors = ({ show, loggedIn }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS, { skip: !show })
  const authors = data?.allAuthors

  if (!show) return null

  return (
    <div>
      <h2>authors</h2>
      {loading && <p> Loading .. </p>}
      {error && <p>Error: {error.message}</p>}
      {authors && (
        <>
          <AuthorsTable authors={authors} />
          {loggedIn && <AuthorBornForm authors={authors} />}
        </>
      )}
    </div>
  )
}

export default Authors
