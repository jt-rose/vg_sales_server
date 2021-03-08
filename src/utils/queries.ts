import dotenv from 'dotenv'
import Knex from 'knex'
import { WhereOptions, PaginatedWhereOptions } from '../fields/QUERY_OPTIONS'

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

const formatTextSearch = (searchType: string, searchConditions: string[]) => {
  switch (searchType) {
    case 'titleStartsWith':
      return searchConditions.map((text) => text + '%')
    case 'titleEndsWith':
      return searchConditions.map((text) => '%' + text)
    case 'titleContains':
      return searchConditions.map((text) => '%' + text + '%')
    default:
      return searchConditions
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
  const newQuery = query()
  const optionsArray = Object.entries(whereOptions)

  return optionsArray.reduce((prev, current) => {
    const [column, searchConditions] = current
    const range = hasSearchRange(searchConditions)

    if (hasNumericSearchType(column)) {
      if (range) {
        return prev.whereBetween(column, searchConditions)
      } else {
        return prev.where(column, searchConditions[0])
      }
    }
    const formattedTextSearch = formatTextSearch(column, searchConditions)
    if (range) {
      const sqlText = getLengthOfIlikeArgs(formattedTextSearch.length)
      return prev.whereRaw(sqlText, formattedTextSearch)
    } else {
      // convert 'titleContains' type queries to 'title'
      // and keep column name for other types
      const columnName = column.includes('title') ? 'title' : column
      return prev.where(columnName, 'ilike', formattedTextSearch[0])
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

//  query to investiagte game sales with custom grouping by and where options
const querySalesBy = (groupByColumn: ColumnGrouping) => () =>
  knex('games')
    .select(groupByColumn) // .select(groupByColumn, secondGrouping)
    .sum({
      global_sales: 'global_sales',
      na_sales: 'na_sales',
      eu_sales: 'eu_sales',
      jp_sales: 'jp_sales',
      other_sales: 'other_sales',
    })
    .groupBy(groupByColumn) //.groupBy(groupByColumn, secondGrouping)
    .orderBy('global_sales', 'desc') //.orderBy(... maybe leave as is)

type ScoreType = 'critic_score' | 'user_score'

// query to return games ordered by score
const queryByScore = (scoreType: ScoreType) => () =>
  knex('games').select().whereNotNull(scoreType).orderBy(scoreType, 'desc')

// query to return games ordered by global sales
const queryEachTitleVersionBy = () =>
  knex('games').select().orderBy('global_sales', 'desc')

// query to return raw list of games, not ordered by sales
const queryGamesListBy = () => knex('games').select()

/* ---------------- export formatted queries with pagination ---------------- */
export const genreQuery = withPaginatedWhereOptions(querySalesBy('genre'))
export const ratingQuery = withPaginatedWhereOptions(querySalesBy('rating'))
export const consoleQuery = withPaginatedWhereOptions(querySalesBy('console'))
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
