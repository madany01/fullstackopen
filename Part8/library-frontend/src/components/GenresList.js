function GenresList({ genres, onSelect }) {
  return (
    <div>
      {genres.map(g => (
        <button key={g} onClick={() => onSelect(g)}>
          {g}
        </button>
      ))}
    </div>
  )
}

export default GenresList
