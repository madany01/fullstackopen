import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS, { skip: !show })
  const books = data?.allBooks

  if (!show) return null

  return (
    <div>
      <h2>books</h2>
      {loading && <p> Loading .. </p>}
      {error && <p>Error: {error.message}</p>}
      {books && <BooksTable books={books} />}
    </div>
  )
}

function BooksTable({ books }) {
  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {books.map(b => (
          <tr key={b.title}>
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>{b.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Books
