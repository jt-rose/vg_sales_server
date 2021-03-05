import dotenv from 'dotenv'
import Knex from 'knex'
import { InputType, Field, Int } from 'type-graphql'

dotenv.config()

/* --------------------------- connect to database -------------------------- */

export const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})

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

@InputType()
export class WhereOptions {
  @Field(() => [String], { nullable: true })
  title?: string[]
  // titleStartsWith
  // titleEndsWith
  // titleContains
  @Field(() => [String], { nullable: true })
  console?: string[]
  @Field(() => [Int], { nullable: true })
  year_of_release?: [number] | [number, number]
  @Field(() => [String], { nullable: true })
  publisher?: string[]
  @Field(() => [String], { nullable: true })
  genre?: string[]
  @Field(() => [String], { nullable: true })
  rating?: string[]
  // critic / user score above
  @Field(() => [String], { nullable: true })
  developer?: string[]
  // sales above
}

/* ------------------- where filters and pagination logic ------------------- */

type QueryType =
  | ReturnType<typeof querySalesBy>
  | ReturnType<typeof queryByScore>
  | typeof queryEachTitleVersionBy
  | typeof queryGamesListBy

// HOF to apply 'where' and 'whereIn' options to knex queries

// due to issues with a possible closure updating the knex sequence
// the query needs to be initialized through a function each time
// rather than just stored directly in a variable

const withWhereOptions = (query: QueryType) => (whereOptions: WhereOptions) => {
  // add validation
  const newQuery = query()
  const optionsArray = Object.entries(whereOptions)

  return optionsArray.reduce((prev, curr) => {
    if (curr[0] === 'year_of_release') {
      const hasYearRange = curr[1].length > 1
      if (hasYearRange) {
        return prev.whereBetween(curr[0], curr[1])
      } else {
        return prev.where(curr[0], curr[1][0])
      } // add for greater than?
    }
    if (curr[1].length > 1) {
      return prev.whereIn(curr[0], curr[1])
    } else {
      return prev.where(curr[0], 'ilike', curr[1][0])
    }
  }, newQuery)
}

// apply pagination to queries with where options
const withPaginatedWhereOptions = (query: QueryType) => async (
  options: PaginatedWhereOptions
) => {
  const { where, limit, offset } = options
  // get real limit from user-submitted limit
  const realLimit = Math.min(50, limit)

  // run query with limit and offset
  const res = await withWhereOptions(query)(where)
    .limit(realLimit + 1)
    .offset(offset)

  // determine if additional items are left to query
  const hasMore = res.length === realLimit + 1

  // return paginated query object
  return {
    rows: res.slice(0, realLimit),
    hasMore,
  }
}

/* --------------------------- SQL query templates -------------------------- */

type ColumnGrouping =
  | 'genre'
  | 'rating'
  | 'console'
  | 'title'
  | 'publisher'
  | 'year_of_release'

//  generate sql through function call each time to avoid closure state updates
const querySalesBy = (groupByColumn: ColumnGrouping) => () =>
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

type ScoreType = 'critic_score' | 'user_score'

const queryByScore = (scoreType: ScoreType) => () =>
  knex('games').select().whereNotNull(scoreType).orderBy(scoreType, 'desc')

const queryEachTitleVersionBy = () =>
  knex('games').select().orderBy('global_sales', 'desc')

const queryGamesListBy = () => knex('games').select()

// MUST CHECK VALUES ON BACKEND BEFORE EXECUTING!!!
// since user input from front end can shape column names,
// this MUST be validated before execution

// additionally, the cursor position stored on frontend
// will need to be invalidated when the query changes
// since the row_number corresponds to a dynamic table

@InputType()
export class PaginatedWhereOptions {
  @Field(() => WhereOptions, { nullable: true })
  where: WhereOptions
  @Field(() => Int)
  limit: number
  @Field(() => Int)
  offset: number
}

/* --------------- export formatted queries without pagination -------------- */

// update to remove pagination
export const genreQuery = withWhereOptions(querySalesBy('genre'))
export const ratingQuery = withWhereOptions(querySalesBy('rating'))
export const consoleQuery = withWhereOptions(querySalesBy('console'))

/* ---------------- export formatted queries with pagination ---------------- */

export const crossPlatformTitleQuery = withPaginatedWhereOptions(
  querySalesBy('title')
)
export const PublisherQuery = withPaginatedWhereOptions(
  querySalesBy('publisher')
)
export const yearOfReleaseQuery = withPaginatedWhereOptions(
  querySalesBy('year_of_release')
)

export const criticScoreQuery = withPaginatedWhereOptions(
  queryByScore('critic_score')
)
export const userScoreQuery = withPaginatedWhereOptions(
  queryByScore('user_score')
)
export const eachTitleVersionQuery = withPaginatedWhereOptions(
  queryEachTitleVersionBy
)
export const gamesListQuery = withPaginatedWhereOptions(queryGamesListBy)

//https://www.kaggle.com/juttugarakesh/video-game-data
// victory urql

// note add conversion for roman numerals 2 === II
