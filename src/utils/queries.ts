import dotenv from 'dotenv'
import Knex from 'knex'
import { WhereOptions, PaginatedWhereOptions } from '../fields/WHERE_OPTIONS'

dotenv.config()

/* --------------------------- connect to database -------------------------- */

export const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})

/* ------------------- where filters and pagination logic ------------------- */

type QueryType =
  | ReturnType<typeof querySalesBy>
  | ReturnType<typeof queryByScore>
  | typeof queryEachTitleVersionBy
  | typeof queryGamesListBy

// HOF to apply 'where'  options to knex queries

// due to issues with a possible closure updating the knex sequence
// the query needs to be initialized through a function each time
// rather than just stored directly in a variable

const hasNumericSearchType = (whereColumn: string) =>
  [
    'year_of_release',
    'critic_score',
    'user_score',
    'global_sales',
    'na_sales',
    'eu_sales',
    'jp_sales',
    'other_sales',
  ].includes(whereColumn)

const hasSearchRange = (whereData: string[] | number[]) => whereData.length > 1

const hasTextSearch = (searchType: string) =>
  ['titleStartsWith', 'titleEndsWith', 'titleContains'].includes(searchType)

const formatTextSearch = (searchType: string, searchConditions: string[]) => {
  switch (searchType) {
    case 'title':
      return searchConditions
    case 'titleStartsWith':
      return searchConditions.map((text) => text + '%')
    case 'titleEndsWith':
      return searchConditions.map((text) => '%' + text)
    case 'titleContains':
      return searchConditions.map((text) => '%' + text + '%')
    default:
      throw new Error('incorrect search type provided')
  }
}

const getLengthOfIlikeArgs = (length: number) => {
  switch (length) {
    case 2:
      return 'title ilike any(array[?, ?])'
    case 3:
      return 'title ilike any(array[?, ?, ?])'
    case 4:
      return 'title ilike any(array[?, ?, ?, ?])'
    case 5:
      return 'title ilike any(array[?, ?, ?, ?, ?])'
    default:
      throw new Error('no more than 5 arguments may be provided')
  }
}

const withWhereOptions = (query: QueryType) => (whereOptions: WhereOptions) => {
  // add validation
  const newQuery = query()
  const optionsArray = Object.entries(whereOptions)

  return optionsArray.reduce((prev, current) => {
    const [column, searchConditions] = current
    const textSearch = hasTextSearch(column)
    const range = hasSearchRange(searchConditions)

    if (textSearch) {
      const formattedTextSearch = formatTextSearch(column, searchConditions)
      if (range) {
        const sqlText = getLengthOfIlikeArgs(formattedTextSearch.length)
        return prev.whereRaw(sqlText, formattedTextSearch)
      } else {
        return prev.where('title', 'ilike', formattedTextSearch[0])
      }
    }
    if (hasNumericSearchType(column)) {
      if (range) {
        return prev.whereBetween(column, searchConditions)
      } else {
        return prev.where(column, searchConditions[0])
      }
    }
    throw new Error('whoops!')
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
