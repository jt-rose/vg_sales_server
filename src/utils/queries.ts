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

interface SimpleOptions {
  title?: string
  console?: string
}

/* ----------------- query sales based on specific parameter ---------------- */

export const querySalesBy = (groupByColumn: string) => (where: SimpleOptions) =>
  knex('games')
    .select(groupByColumn)
    .sum({
      global_sales: 'global_sales',
      na_sales: 'na_sales',
      eu_sales: 'eu_sales',
      jp_sales: 'jp_sales',
      other_sales: 'other_sales',
    })
    .where(where)
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
const queryByScore = (scoreType: 'critic_score' | 'user_score') => (
  where: SimpleOptions
) =>
  knex('games')
    .select()
    .where(where)
    .whereNotNull(scoreType)
    .orderBy(scoreType, 'desc')

// wrap sql query in pagination logic
export const queryWithLimit = (queryType: QueryWithLimitConfig) => async (
  limit: number,
  where: { console?: string } = {}
): PaginatedQuery => {
  const { realLimit, realLimitPlusOne } = getRealLimit(limit)

  // determine which type of query to run with pagination
  let res
  if ('groupByColumn' in queryType) {
    res = await querySalesBy(queryType.groupByColumn)(where).limit(
      realLimitPlusOne
    )
  } else if ('scoreType' in queryType) {
    res = await queryByScore(queryType.scoreType)(where).limit(realLimitPlusOne)
  } else if ('titlesQuery' in queryType) {
    res = await knex('games')
      .select()
      .where(where)
      .orderBy('global_sales', 'desc')
      .limit(realLimitPlusOne)
  } else {
    res = await knex('games').select().where(where).limit(realLimitPlusOne)
  }

  // determine if additional items are left to query
  const hasMore = res.length === realLimitPlusOne

  // return paginated query object
  return {
    rows: res.slice(0, realLimit),
    hasMore,
  }
}

/* --------------- cursor-based pagination for dynamic queries -------------- */

// MUST CHECK VALUES ON BACKEND BEFORE EXECUTING!!!
// since user input from front end can shape column names,
// this MUST be validated before execution

// additionally, the cursor position stored on frontend
// will need to invalidated when the query changes
// since the row_number corresponds to a dynamic table

export const querySalesByDynamicFilter = (options: {
  cursorStart: number
  cursorEnd: number
  groupBy: string
  orderBy: string
}) =>
  console.log(
    knex
      .raw(
        `SELECT *
FROM (
        SELECT *,
            ROW_NUMBER() OVER (
                ORDER BY tempo.:orderBy: DESC
            ) as row_n
        FROM (
                SELECT sum(global_sales) AS global_sales,
                    sum(na_sales) AS na_sales,
                    sum(eu_sales) AS eu_sales,
                    sum(jp_sales) AS jp_sales,
                    sum(other_sales) AS other_sales,
                    :groupBy:
                FROM games
                GROUP BY :groupBy:
                ORDER BY :orderBy: DESC
            ) as tempo
    ) as with_row_n
where with_row_n.row_n between :cursorStart and :cursorEnd ;`,
        options
      )
      .toString()
  ) // need to add dynamic where clauses

// works, but need a cleaner refactor
// test for byScore and other two
// fit into pagination wrapper
knex
  .with(
    'with_row_n',
    knex
      .with('tempo', querySalesBy('title')({ console: 'Wii' }))
      .select(
        knex.raw(
          '*, ROW_NUMBER() OVER (ORDER BY tempo.?? DESC) AS row_n',
          'global_sales'
        )
      )
      .from('tempo')
  )
  .select()
  .whereRaw('with_row_n.row_n between 1 and 10')
  .from('with_row_n')
  .toString()

//const withCursorPagination = () =>

// 1. base search with where
// 2. add dynamic row_number cursor pagination => HOF
// 3. wrap in real limit plus one/ has more logic => HOF

export const querySalesBy2 = (groupByColumn: string) => (
  where: SimpleOptions
) =>
  knex('games')
    .select(groupByColumn)
    .sum({
      global_sales: 'global_sales',
      na_sales: 'na_sales',
      eu_sales: 'eu_sales',
      jp_sales: 'jp_sales',
      other_sales: 'other_sales',
    })
    .where(where)
    .groupBy(groupByColumn)
    .orderBy('global_sales', 'desc')

const queryByScore2 = (scoreType: 'critic_score' | 'user_score') => (
  where: SimpleOptions
) =>
  knex('games')
    .select()
    .where(where)
    .whereNotNull(scoreType)
    .orderBy(scoreType, 'desc')

const queryEachTitleVersionBy = (where: SimpleOptions) =>
  knex('games').select().where(where).orderBy('global_sales', 'desc')
//.limit(realLimitPlusOne)

const queryGamesListBy = (where: SimpleOptions) =>
  knex('games').select().where(where) //.limit(realLimitPlusOne)

/*type QueryType = { groupByColumn: string }
        | { scoreType: 'critic_score' | 'user_score' }
        | { gamesQuery: true }
        | { titlesQuery: true }*/
type QueryType =
  | {
      type: 'user_score' | 'critic_score' | 'gamesList' | 'eachTitleVersion'
    }
  | {
      type: 'groupBy'
      data: string
    }

const determineQueryType = (queryType: QueryType) => {
  switch (queryType.type) {
    case 'user_score': {
      return queryByScore2('user_score')
    }
    case 'critic_score': {
      return queryByScore2('critic_score')
    }
    case 'eachTitleVersion': {
      return queryEachTitleVersionBy
    }
    case 'gamesList': {
      return queryGamesListBy
    }
    case 'groupBy': {
      return querySalesBy2(queryType.data)
    }
    default: {
      throw new Error('wrong query type submitted to pagination HOF')
    }
  }
}

const withDynamicRowNumPagination = (queryType: QueryType) => async (options: {
  whereOptions: SimpleOptions
  limit: number
  cursor: number
}) => {
  const { whereOptions, limit, cursor } = options
  // get real limit from user-submitted limit
  const realLimit = Math.min(50, limit)
  /* NOTE: may change to accept last cursor and add +1 */

  // define cursor range for query
  // start from provided cursor and add realLimit for realLimit plus one
  const cursorRange = {
    start: cursor,
    end: cursor + realLimit,
  }

  // define type of query to apply pagination to
  const subQuery = determineQueryType(queryType)
  //refactor later, add support for regional sales
  const orderRowNumBy =
    queryType.type === 'critic_score' || queryType.type === 'user_score'
      ? queryType.type
      : queryType.type === 'gamesList'
      ? 'title'
      : 'global_sales'

  // run query
  const res = await knex
    .with(
      'with_row_n',
      knex
        .with('tempo', subQuery(whereOptions))
        .select(
          knex.raw(
            '*, ROW_NUMBER() OVER (ORDER BY tempo.?? DESC) AS row_n',
            orderRowNumBy /*refactor to allow abc order for gamesList query */
          )
        )
        .from('tempo')
    )
    .select()
    .whereRaw('with_row_n.row_n between :start and :end', cursorRange)
    .from('with_row_n')

  // determine if additional items are left to query
  const hasMore = res.length === realLimit + 1

  // return paginated query object
  return {
    rows: res.slice(0, realLimit),
    hasMore,
  }
}

// export formatted queries
export const crossPlatformTitleQuery = withDynamicRowNumPagination({
  type: 'groupBy',
  data: 'title',
})
export const PublisherQuery = withDynamicRowNumPagination({
  type: 'groupBy',
  data: 'publisher',
})
export const yearOfReleaseQuery = withDynamicRowNumPagination({
  type: 'groupBy',
  data: 'year_of_release',
})

export const criticScoreQuery = withDynamicRowNumPagination({
  type: 'critic_score',
})
export const userScoreQuery = withDynamicRowNumPagination({
  type: 'user_score',
})
export const eachTtitleVersionQuery = withDynamicRowNumPagination({
  type: 'eachTitleVersion',
})
export const gamesListQuery = withDynamicRowNumPagination({ type: 'gamesList' })

//genre
export const genreQuery = querySalesBy2('genre')
//rating
export const ratingQuery = querySalesBy2('rating')
//console
export const consoleQuery = querySalesBy2('console')
