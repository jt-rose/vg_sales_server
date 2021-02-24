import { Resolver, Query } from 'type-graphql'
import { CONSOLES } from '../fields/CONSOLES'
import { pool } from '../utils/utils'
import { sql } from 'slonik'

@Resolver()
export class Consoles {
  @Query(() => [CONSOLES])
  async consoles() {
    const res = await pool.query(sql`
        SELECT * FROM consoles
        ORDER BY maker ASC;
        `)
    return res.rows
  }
}
