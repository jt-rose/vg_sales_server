import { Resolver, Query } from 'type-graphql'
import { CONSOLE_MAKERS } from '../fields/CONSOLE_MAKERS'
import { knex } from '../utils/queries'

@Resolver()
export class ConsoleMakers {
  @Query(() => [CONSOLE_MAKERS])
  async consoleMakers() {
    return knex('console_makers').select()
  }
}
