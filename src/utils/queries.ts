import { PaginatedQueryOptions, QueryOptions } from './../fields/QUERY_OPTIONS'
import dotenv from 'dotenv'
import Knex from 'knex'

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
      return '?? ilike any(array[?, ?])'
    case 3:
      return '?? ilike any(array[?, ?, ?])'
    case 4:
      return '?? ilike any(array[?, ?, ?, ?])'
    case 5:
      return '?? ilike any(array[?, ?, ?, ?, ?])'
    default:
      throw new Error('no more than 5 arguments may be provided')
  }
}

const withQueryOptions = (query: QueryType) => (options: QueryOptions) => {
  const newQuery = query(options.groupBy)
  const optionsArray = Object.entries(options.where)

  return optionsArray.reduce((prev, current) => {
    const [column, searchConditions] = current
    const range = hasSearchRange(searchConditions)

    // may adjust group by queries to use 'having' if perf issues
    if (hasNumericSearchType(column)) {
      if (range) {
        return prev.whereBetween(column, searchConditions)
      } else {
        return prev.where(column, searchConditions[0])
      }
    }
    // convert 'titleContains' type queries to 'title'
    // and keep column name for other types
    const columnName = column.includes('title') ? 'title' : column
    const formattedTextSearch = formatTextSearch(column, searchConditions)
    if (range) {
      const sqlText = getLengthOfIlikeArgs(formattedTextSearch.length)
      return prev.whereRaw(sqlText, [columnName, ...formattedTextSearch])
    } else {
      return prev.where(columnName, 'ilike', formattedTextSearch[0])
    }
  }, newQuery)
}

// apply pagination to queries with where options
const withPaginatedQueryOptions = (query: QueryType) => async (
  options: PaginatedQueryOptions
) => {
  const { where, groupBy, limit, offset } = options
  // get real limit from user-submitted limit
  const realLimit = Math.min(50, limit)

  // run query with limit and offset
  const res = await withQueryOptions(query)({ where, groupBy })
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
const querySalesBy = (groupByColumn: ColumnGrouping) => (
  groupBy: string[] = []
) => {
  const groupByColumns = [...groupBy, groupByColumn]
  return knex('games')
    .select(groupByColumns) // .select(groupByColumn, secondGrouping)
    .sum({
      global_sales: 'global_sales',
      na_sales: 'na_sales',
      eu_sales: 'eu_sales',
      jp_sales: 'jp_sales',
      other_sales: 'other_sales',
    })
    .groupBy(groupByColumns) //.groupBy(groupByColumn, secondGrouping)
    .orderBy([{ column: 'global_sales', order: 'desc' }, ...groupByColumns]) //.orderBy(... maybe leave as is)
  // allow custom ordering from ui? -- yes, important for pagination/ search flexibility
}

type ScoreType = 'critic_score' | 'user_score'
type OrderByArgs = (string | { column: string; order?: string })[] // add enums

// query to return games ordered by score
const queryByScore = (scoreType: ScoreType) => (orderBy: OrderByArgs = []) => {
  const orderByArgs = [...orderBy, { column: scoreType, order: 'desc' }]
  return knex('games')
    .select()
    .whereNotNull(scoreType)
    .orderBy(orderByArgs /*scoreType, 'desc'*/)
}

// query to return games ordered by global sales
const queryEachTitleVersionBy = (orderBy: OrderByArgs = []) => {
  const orderByArgs = [...orderBy, { column: 'global_sales', order: 'desc' }]
  return knex('games').select().orderBy(orderByArgs)
}

// query to return raw list of games, not ordered by sales
const queryGamesListBy = (orderBy: OrderByArgs = []) => {
  return orderBy
    ? knex('games').select().orderBy(orderBy)
    : knex('games').select()
}

/* ---------------- export formatted queries with pagination ---------------- */
export const genreQuery = withPaginatedQueryOptions(querySalesBy('genre'))
export const ratingQuery = withPaginatedQueryOptions(querySalesBy('rating'))
export const consoleQuery = withPaginatedQueryOptions(querySalesBy('console'))
export const crossPlatformTitleQuery = withPaginatedQueryOptions(
  querySalesBy('title')
)
export const PublisherQuery = withPaginatedQueryOptions(
  querySalesBy('publisher')
)
export const yearOfReleaseQuery = withPaginatedQueryOptions(
  querySalesBy('year_of_release')
)

export const criticScoreQuery = withPaginatedQueryOptions(
  queryByScore('critic_score')
)
export const userScoreQuery = withPaginatedQueryOptions(
  queryByScore('user_score')
)
export const eachTitleVersionQuery = withPaginatedQueryOptions(
  queryEachTitleVersionBy
)
export const gamesListQuery = withPaginatedQueryOptions(queryGamesListBy)

//https://www.kaggle.com/juttugarakesh/video-game-data
// victory urql

// note add conversion for roman numerals 2 === II
