import { Resolver, Query, ObjectType, Field, Float, Int } from 'type-graphql'
import { GAMES } from '../entities/GAMES'
import { pool } from '../utils/pool'
import { sql } from 'slonik'

@ObjectType()
class CombinedSales {
  @Field(() => Float)
  global_sales: number
  @Field(() => Float)
  na_sales: number
  @Field(() => Float)
  eu_sales: number
  @Field(() => Float)
  jp_sales: number
  @Field(() => Float)
  other_sales: number
}

@ObjectType()
class CrossPlatformSales extends CombinedSales {
  @Field()
  title: string
}

@ObjectType()
class YearSales extends CombinedSales {
  @Field(() => Int)
  year: number
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
  async salesByTitles() {
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
        SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    title
FROM games
GROUP BY title
ORDER BY global_sales DESC
LIMIT 10;
      `)

    return res.rows
  }

  // genre

  @Query(() => [YearSales])
  async salesByYear() {
    const res = await pool.query(sql`
        SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    year_of_release AS year
FROM games
GROUP BY year
ORDER BY global_sales DESC
LIMIT 10;
      `)

    return res.rows
  }
}
