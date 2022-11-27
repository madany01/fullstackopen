import { useQuery } from '@apollo/client'
import { CURRENT_USER } from '../queries'
import BookTable from './BookTable'

function RecommendedBooks({ show }) {
  const { data, loading, error } = useQuery(CURRENT_USER, {
    fetchPolicy: 'network-only',
  })

  if (!show) return null

  const user = data?.me

  return (
    <section>
      <h2>Recommendations</h2>
      {error && <h3> Error: {error?.message} </h3>}
      {loading && <p> Loading .. </p>}
      {data && (
        <div>
          <p>
            books in your favorite genre <strong> {user.favouriteGenre} </strong>{' '}
            are:
          </p>

          <BookTable books={user.recommendedBooks} genre={user.favouriteGenre} />
        </div>
      )}
    </section>
  )
}

export default RecommendedBooks
