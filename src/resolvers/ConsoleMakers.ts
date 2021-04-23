import { Resolver, Query, UseMiddleware } from 'type-graphql'
import { CONSOLE_MAKERS } from '../fields/CONSOLE_MAKERS'
import { knex } from '../utils/queries'
import { rateLimit } from '../utils/rateLimit'

@Resolver()
export class ConsoleMakers {
  @Query(() => [CONSOLE_MAKERS])
  @UseMiddleware(rateLimit())
  async consoleMakers() {
    return knex('console_makers').select()
  }
}
