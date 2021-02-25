import { Resolver, Query } from 'type-graphql'
import { CONSOLES } from '../fields/CONSOLES'
import { knex } from '../utils/queries'

@Resolver()
export class Consoles {
  @Query(() => [CONSOLES])
  async consoles() {
    return knex('consoles').select()
  }
}
