import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { EDIT_AUTHOR } from '../queries'

function AuthorBornForm({ authors }) {
  const [editAuthor, { loading, error }] = useMutation(EDIT_AUTHOR, {
    onError: e => console.error(e),
  })
  const [prevAuthor, setPrevAuthors] = useState(authors)
  const [selectedName, setSelectedName] = useState(authors[0]?.name ?? '')
  const [born, setBorn] = useState(
    () => authors.find(a => a.name === selectedName)?.born ?? ''
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

    if (!(selectedName && born)) {
      // eslint-disable-next-line no-alert
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

export default AuthorBornForm
