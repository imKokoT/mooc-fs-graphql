const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')


const resolvers = {
  Query: {
    me: (root, args, context) => context.createUser,

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

    // === library logic ============================================

    addBook: async (root, {title, published, author, genres}, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

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

        // save author with verification
        try {
          await authorModel.save()
        } catch (error) {
          throw new GraphQLError(`error while save an author: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
            }
          })
        }
      }

      const newBook = new Book({
        title,
        published,
        author: authorModel._id,
        genres
      })
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError(`error while save a book: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }

      return await newBook.populate({
        path: 'author',
        populate: {
          path: 'bookCount'
        }
      })
    },

    editAuthor: async (root, {name, setBornTo}, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

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

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(`error while save an author: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }
      return await author.populate('bookCount')
    },

    // === user management ============================================
  
    /* 
      after reviewing material and tests i found that
      it is not required to create real login/sing-up system.
      
      so i have to skip this for now, but how it is painful to look
      at this parody of the user management system...
    */
    createUser: async (root, {username, favoriteGenre}) => {
      const user = new User({ username, favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError(`Creating the user failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: username,
              error
            }
          })
        })
    },
    login: async (root, {username, password}) => {
      const user = await User.findOne({ username })
  
      if ( !user || password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

module.exports = resolvers
