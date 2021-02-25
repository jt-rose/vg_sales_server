import dotenv from 'dotenv'
import Knex from 'knex'

dotenv.config()

/* --------------------------- connect to database -------------------------- */

export const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})

/* ---------------------- get real limit for pagination --------------------- */

export const getRealLimit = (limit: number) => {
  const realLimit = Math.min(50, limit)
  const realLimitPlusOne = realLimit + 1
  return {
    realLimit,
    realLimitPlusOne,
  }
}

/* ------------------------ filter object for queries ----------------------- */

/*
interface QueryParamsFilter {
  titles?: string[] // add form val/ autocomplete on frontend?
  // title ilike
  year?: number // add for range
  yearRange?: [number, number]
  publishers?: string[]
  consoles?: string[]
  genres?: string[]
  ratings?: string[] // use enums from before
  criticScoreAbove?: number // add for range or below?
  userScoreAbove?: number
  developers?: string[]
  globalSalesAbove?: number // add for range or below
  naSalesAbove?: number // add for range or below
  euSalesAbove?: number // add for range or below
  jpSalesAbove?: number // add for range or below
  otherSalesAbove?: number // add for range or below
  // series?
}
*/

/* ----------------- query sales based on specific parameter ---------------- */

export const querySalesBy = (groupByColumn: string) =>
  knex('games')
    .select(groupByColumn)
    .sum({
      global_sales: 'global_sales',
      na_sales: 'na_sales',
      eu_sales: 'eu_sales',
      jp_sales: 'jp_sales',
      other_sales: 'other_sales',
    })
    .groupBy(groupByColumn)
    .orderBy('global_sales', 'desc')

/* --------------------- query with limit for pagination -------------------- */

// result type of queryWithLimit function
type PaginatedQuery = Promise<{
  rows: unknown[] // update later
  hasMore: boolean
}>

// config object provided to queryWithLimit
// to determine which query function to use
type QueryWithLimitConfig =
  | { groupByColumn: string }
  | { scoreType: 'critic_score' | 'user_score' }
  | { gamesQuery: true }
  | { titlesQuery: true }

// query sales related to highest critic/ user scores
const queryByScore = (scoreType: 'critic_score' | 'user_score') =>
  knex('games').select().whereNotNull(scoreType).orderBy(scoreType, 'desc')

// wrap sql query in pagination logic
export const queryWithLimit = (queryType: QueryWithLimitConfig) => async (
  limit: number
): PaginatedQuery => {
  const { realLimit, realLimitPlusOne } = getRealLimit(limit)

  // determine which type of query to run with pagination
  let res
  if ('groupByColumn' in queryType) {
    res = await querySalesBy(queryType.groupByColumn).limit(realLimitPlusOne)
  } else if ('scoreType' in queryType) {
    res = await queryByScore(queryType.scoreType).limit(realLimitPlusOne)
  } else if ('titlesQuery' in queryType) {
    res = await knex('games')
      .select()
      .orderBy('global_sales', 'desc')
      .limit(realLimitPlusOne)
  } else {
    res = await knex('games').select().limit(realLimitPlusOne)
  }

  // determine if additional items are left to query
  const hasMore = res.length === realLimitPlusOne

  // return paginated query object
  return {
    rows: res.slice(0, realLimit),
    hasMore,
  }
}

// need to add cursor/ offset logic