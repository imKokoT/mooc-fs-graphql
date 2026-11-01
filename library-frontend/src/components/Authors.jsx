import { useMutation, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../services/queries'
import { useState } from 'react'


const Authors = (props) => {
  const [selectedAuthorId, setSelectedAuthorId] = useState(null)
  const [newBirthYear, setNewBirthYear] = useState('1900')

  const authorsQuery = useQuery(ALL_AUTHORS, {
    skip: !props.show
  })
  const [editAuthorMutation] = useMutation(EDIT_AUTHOR, {
    onError: (error) => alert(error.message),
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  
  if (!props.show)
    return null
  
  if (authorsQuery.loading)
    return 'fetching data...'
  
  // ==================================================

  const authors = authorsQuery.data.allAuthors
  const selectedAuthor = authors.find(a => a.id === selectedAuthorId)?.name ?? authors[0].name
  
  const updateBirthYear = (event) => {
    event.preventDefault()
    
    if (authors.length === 0)
      return

    editAuthorMutation({ variables: {name: selectedAuthor, setBornTo: parseInt(newBirthYear)} })
    console.log(`updated author ${selectedAuthor}`)

    setNewBirthYear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
      {/* edit birth date */}
      
      <h3>Edit an author</h3>
      <form onSubmit={updateBirthYear}>
        
        <div>
          author
          <select value={selectedAuthorId} onChange={({ target }) => setSelectedAuthorId(target.value)}>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          birth year
          <input type="number" 
                value={newBirthYear} 
                onChange={({ target }) => setNewBirthYear(target.value)}
          />
        </div>
        
        <button type="submit">update info</button>

      </form>
    </div>
  )
}

export default Authors
