import { Resolver, Query, ObjectType, Field, Float } from 'type-graphql'
import { GAMES } from '../entities/GAMES'
import { pool } from '../utils/pool'
import { sql } from 'slonik'

@ObjectType()
class CrossPlatformSales {
  @Field(() => Float)
  global_sales_crossplatform: number
  @Field(() => Float)
  na_sales_crossplatform: number
  @Field(() => Float)
  eu_sales_crossplatform: number
  @Field(() => Float)
  jp_sales_crossplatform: number
  @Field(() => Float)
  other_sales_crossplatform: number
  @Field()
  title: string
}

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

  // update filter, cursor, and limit args later
  // not combining sales of a single title across consoles/ PC - add later
  // set pool.query to function to add strict types for return
  @Query(() => [GAMES])
  async salesByGames() {
    const res = await pool.query(sql`
        SELECT * FROM games
        ORDER BY global_sales DESC
        LIMIT 10;
    `)
    return res.rows
  }

  @Query(() => [CrossPlatformSales])
  async salesByCrossPlatformTitles() {
    const res = await pool.query(sql`
        SELECT sum(global_sales) AS global_sales_crossplatform,
    sum(na_sales) AS na_sales_crossplatform,
    sum(eu_sales) AS eu_sales_crossplatform,
    sum(jp_sales) AS jp_sales_crossplatform,
    sum(other_sales) AS other_sales_crossplatform,
    title
FROM games
GROUP BY title
ORDER BY global_sales_crossplatform DESC
LIMIT 10;
      `)

    return res.rows
  }
}
