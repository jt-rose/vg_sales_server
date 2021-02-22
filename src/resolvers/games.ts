import { Resolver, Query } from 'type-graphql'
import { GAMES } from '../entities/GAMES'
import { pool } from '../utils/pool'
import { sql } from 'slonik'

@Resolver()
export class Games {
  @Query(() => [GAMES])
  async games() {
    const res = await pool.query(sql`
        SELECT * FROM games
        LIMIT 10;
        `)
    return res.rows
  }
}
