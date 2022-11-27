import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = ({ show }) => {
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
          <AuthorBornForm authors={authors} />
        </>
      )}
    </div>
  )
}

function AuthorsTable({ authors }) {
  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>born</th>
          <th>books</th>
        </tr>
        {authors.map(a => (
          <tr key={a.name}>
            <td>{a.name}</td>
            <td>{a.born}</td>
            <td>{a.bookCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AuthorBornForm({ authors }) {
  const [editAuthor, { loading, error }] = useMutation(EDIT_AUTHOR, {
    onError: e => console.log(e),
  })
  const [prevAuthor, setPrevAuthors] = useState(authors)
  const [selectedName, setSelectedName] = useState(authors[0]?.name ?? '')
  const [born, setBorn] = useState(
    authors.find(a => a.name === selectedName)?.born ?? ''
  )

  if (prevAuthor !== authors) {
    setPrevAuthors(authors)

    const selectedExists = authors.some(a => a.name === selectedName)
    if (!selectedExists) {
      setSelectedName(authors[0]?.name ?? '')
      setBorn(authors[0]?.born ?? '')
      return
    }
  }

  function submit(e) {
    e.preventDefault()
    console.log(selectedName)
    console.log(born)

    if (!(selectedName && born)) {
      alert('fill selection and born')
      return
    }

    editAuthor({
      variables: { name: selectedName, setBornTo: Number(born) },
    })
  }

  function onSelect(e) {
    const val = e.target.value
    setSelectedName(val)
    setBorn(authors.find(a => a.name === val).born ?? '')
  }

  return (
    <div>
      <h2>set birth year</h2>
      {error && <p>{error.message}</p>}
      <form>
        <div>
          author
          <select value={selectedName} onChange={onSelect}>
            {authors.map(a => (
              <option key={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            type={'number'}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <div>
          <button type={'submit'} onClick={submit} disabled={loading}>
            submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default Authors
