const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')


const resolvers = {
  Query: {
    bookCount: async () => { return await Book.countDocuments() },
    authorCount: async () => { return await Author.countDocuments() },

    allBooks: async (root, args) => {
      var filter = {}

      if (args.author){
        const author = await Author.findOne({ name: args.author })
        filter.author = author._id
      }
      if (args.genre)
        filter = {...filter, genres: [args.genre]}

      return await Book.find(filter).populate({
        path: 'author',
        populate: {
          path: 'bookCount'
        }
      })
    },
    allAuthors: async () => {
      return await Author.find({}).populate('bookCount')
    }
  },

  Mutation: {
    addBook: async (root, {title, published, author, genres}) => {
      // verify
      if (await Book.exists({title}))
        throw new GraphQLError(`title must be unique: ${title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: title
          }
        })

      // register the author if not exists
      var authorModel = await Author.findOne({name: author})
      if (!authorModel) {
        authorModel = new Author({
          name: author
        })
        await authorModel.save()
      }

      const newBook = new Book({
        title,
        published,
        author: authorModel._id,
        genres
      })
      await newBook.save()
      return await newBook.populate({
        path: 'author',
        populate: {
          path: 'bookCount'
        }
      })
    },

    editAuthor: async (root, {name, setBornTo}) => {
      const author = await Author.findOne({name})

      if (!author)
        throw new GraphQLError(`author with name ${name} does not exists`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: name
          }
        })

      // modify fields
      if (setBornTo != null)
        author.born = setBornTo

      await author.save()
      return await author.populate('bookCount')
    }
  }
}

module.exports = resolvers
