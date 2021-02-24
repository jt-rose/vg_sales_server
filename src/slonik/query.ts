import { getRealLimit, pool } from '../utils/utils'
import { sql } from 'slonik'

type SQLTag = ReturnType<typeof sql>
type SQLTagCallback = (limit: number) => ReturnType<typeof sql>
type PaginatedQuery = Promise<{
  rows: unknown[] // update later
  hasMore: boolean
}>

/* ---------------------------------- query --------------------------------- */

const query = (sql: SQLTag) => async () => {
  const res = await pool.query(sql)
  return res.rows
}

export const salesByGenreQuery = query(sql`
    SELECT sum(global_sales) as global_sales,
    sum(na_sales) as na_sales,
    sum(eu_sales) as eu_sales,
    sum(jp_sales) as jp_sales,
    sum(other_sales) as other_sales,
    genre
FROM games
GROUP BY genre
ORDER BY global_sales DESC;
`)

export const salesByConsoleQuery = query(sql`
    SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    console
FROM games
GROUP BY console
ORDER BY global_sales DESC;
`)

export const salesByRatingQuery = query(sql`
    SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    rating
FROM games
GROUP BY rating
ORDER BY global_sales DESC;
`)

/* ---------------------------- query with limit ---------------------------- */

const queryWithLimit = (callBack: SQLTagCallback) => async (
  limit: number
): PaginatedQuery => {
  const { realLimit, realLimitPlusOne } = getRealLimit(limit)
  const res = await pool.query(callBack(realLimitPlusOne))
  const hasMore = res.rows.length === realLimitPlusOne
  res.rows

  return {
    rows: res.rows.slice(0, realLimit),
    hasMore,
  }
}

export const gamesQuery = queryWithLimit(
  (rlpo) => sql`
    SELECT * FROM games
        LIMIT ${rlpo};
`
)

export const salesByTitlesQuery = queryWithLimit(
  (rlpo) => sql`
    SELECT * FROM games
        ORDER BY global_sales DESC
        LIMIT ${rlpo};
`
)

export const salesByCrossPlatformTitlesQuery = queryWithLimit(
  (rlpo) => sql`
    SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    title
FROM games
GROUP BY title
ORDER BY global_sales DESC
LIMIT ${rlpo};
`
)

export const salesByYearQuery = queryWithLimit(
  (rlpo) => sql`
    SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    year_of_release AS year
FROM games
GROUP BY year
ORDER BY global_sales DESC
LIMIT ${rlpo};
`
)

export const salesByPublisherQuery = queryWithLimit(
  (rlpo) => sql`
    SELECT sum(global_sales) AS global_sales,
    sum(na_sales) AS na_sales,
    sum(eu_sales) AS eu_sales,
    sum(jp_sales) AS jp_sales,
    sum(other_sales) AS other_sales,
    publisher
FROM games
GROUP BY publisher
ORDER BY global_sales DESC
LIMIT ${rlpo};
`
)

export const highestCriticScoresQuery = queryWithLimit(
  (rlpo) => sql`
    SELECT *
FROM games
WHERE critic_score IS NOT NULL
ORDER BY critic_score DESC
LIMIT ${rlpo};
`
)

export const highestUserScoresQuery = queryWithLimit(
  (rlpo) => sql`
    SELECT *
FROM games
WHERE user_score IS NOT NULL
ORDER BY user_score DESC
LIMIT ${rlpo};
`
)
