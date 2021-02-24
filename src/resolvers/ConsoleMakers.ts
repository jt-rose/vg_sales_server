import { Resolver, Query } from 'type-graphql'
import { CONSOLE_MAKERS } from '../fields/CONSOLE_MAKERS'
import { pool } from '../utils/utils'
import { sql } from 'slonik'

@Resolver()
export class ConsoleMakers {
  @Query(() => [CONSOLE_MAKERS])
  async consoleMakers() {
    const res = await pool.query(sql`
        SELECT maker FROM console_makers;
        `)
    return res.rows
  }
}
