import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { Games } from './resolvers/Games'
import { Consoles } from './resolvers/Consoles'
import { ConsoleMakers } from './resolvers/ConsoleMakers'
import { buildSchema } from 'type-graphql'
import {
  getComplexity,
  fieldExtensionsEstimator,
  simpleEstimator,
} from 'graphql-query-complexity'
import { redis } from './utils/redis'
import { MyContext } from './utils/types'

const main = async () => {
  const app = express()
  const schema = await buildSchema({
    resolvers: [Games, Consoles, ConsoleMakers],
    validate: false,
    // automatically create `schema.gql` file with schema definition in project's working directory
    emitSchemaFile: true,
  })
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
    }),
    // plugins: [apolloLogger],
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            // limit query complexity
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [
                // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
                fieldExtensionsEstimator(),
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            })
            if (complexity > 200) {
              console.log(
                `query rejected for having excess complexity of ${complexity}`
              )
              throw new Error(
                `The server has rejected this request for having too great a complexity. Please revise as a more limited number of queries.`
              )
            }
            // And here we can e.g. subtract the complexity point from hourly API calls limit.
          },
        }),
      },
    ],
    // context
  })

  apolloServer.applyMiddleware({ app })

  const port = 5000
  app.listen(port, () => console.log(`listening on port ${port}`))
}

main().catch((err) => {
  console.log(err)
})
