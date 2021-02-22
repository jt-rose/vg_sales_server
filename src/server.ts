import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { Games } from './resolvers/games'
import { Consoles } from './resolvers/Consoles'
import { ConsoleMakers } from './resolvers/ConsoleMakers'
import { buildSchema } from 'type-graphql'

const main = async () => {
  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [Games, Consoles, ConsoleMakers],
      validate: false,
      // automatically create `schema.gql` file with schema definition in project's working directory
      emitSchemaFile: true,
    }),
    // plugins: [apolloLogger],
    // context
  })

  apolloServer.applyMiddleware({ app })

  const port = 5000
  app.listen(port, () => console.log(`listening on port ${port}`))
}

main().catch((err) => {
  console.log(err)
})
