import { Resolver, Query, UseMiddleware } from 'type-graphql'
import { CONSOLES } from '../fields/CONSOLES'
import { knex } from '../utils/queries'
import { rateLimit } from '../utils/rateLimit'

@Resolver()
export class Consoles {
  @Query(() => [CONSOLES])
  @UseMiddleware(rateLimit())
  async consoles() {
    return knex('consoles').select()
  }
}
