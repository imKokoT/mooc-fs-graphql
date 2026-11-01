import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from '../services/queries'


const Authors = (props) => {
  const authorsQuery = useQuery(ALL_AUTHORS, {
    skip: !props.show
  })
  
  if (!props.show) {
    return null
  }
  
  if (authorsQuery.loading) {
    return 'fetching data...'
  }
  
  const authors = authorsQuery.data.allAuthors

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
    </div>
  )
}

export default Authors
