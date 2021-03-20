import {
  PaginatedQueryOptions,
  QueryOptions,
  GroupAndOrderSettings,
  OrderByColumn,
} from './../fields/QUERY_OPTIONS'
import { GroupByColumn, OrderByColumnName, SortOrder } from './../fields/ENUMS'
import dotenv from 'dotenv'
import Knex from 'knex'

dotenv.config()

/* ---------------------------- destructure enums --------------------------- */

const {
  GENRE,
  RATING,
  CONSOLE,
  TITLE,
  PUBLISHER,
  YEAR_OF_RELEASE,
} = GroupByColumn
const { CRITIC_SCORE, USER_SCORE, GLOBAL_SALES } = OrderByColumnName
const { DESC } = SortOrder

/* --------------------------- connect to database -------------------------- */

export const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})

/* --------------------------- SQL query templates -------------------------- */

// the following are sql queries that allow the user to define
// what columns to group and order by, as well as any 'where'
// conditions to limit the query by

// format user-defined order by sorting
const formatOrderByArgs = (defaultOrderBy: OrderByColumn) => (
  orderBy: OrderByColumn[] = []
) => {
  // inject default column name if not included in 'orderBy' column names
  const overrideDefault = orderBy.find(
    (x) => x.column === defaultOrderBy.column
  )
  if (overrideDefault) {
    return orderBy
  } else {
    return [...orderBy, defaultOrderBy]
  }
}

//  query to investigate game sales
// the first group by setting is curried
// to allow some basic templates be provided to the user
// ex: query sales by genre, console, publisher, etc.

// the user can then provide further group by options
// ex: group sales by genre across consoles, etc.

// lastly, to find sales of games released across different
// versions, such as multiple consoles, we can simply group by title

const querySalesBy = (groupByColumn: GroupByColumn) => (
  options: GroupAndOrderSettings
) => {
  const { groupBy, orderBy } = options
  // set up list of columns to group and order by
  const groupByColumns = groupBy ? [...groupBy, groupByColumn] : [groupByColumn]
  const orderByColumns = formatOrderByArgs({
    column: GLOBAL_SALES,
    order: DESC,
  })(orderBy)

  // return customized query focusing on game sales
  return knex('games')
    .select(groupByColumns)
    .sum({
      global_sales: 'global_sales',
      na_sales: 'na_sales',
      eu_sales: 'eu_sales',
      jp_sales: 'jp_sales',
      other_sales: 'other_sales',
    })
    .groupBy(groupByColumns)
    .orderBy(orderByColumns)
}

type ScoreType = OrderByColumnName.CRITIC_SCORE | OrderByColumnName.USER_SCORE
// query to return games ordered by score
const queryByScore = (scoreType: ScoreType) => (
  options: GroupAndOrderSettings
) => {
  const orderByColumns = formatOrderByArgs({
    column: scoreType,
    order: DESC,
  })(options.orderBy)
  // note: may allow for score type ordering to be specified exactly
  // rather than defaulting to last place
  return knex('games').select().whereNotNull(scoreType).orderBy(orderByColumns)
}

// query to return games ordered directly by global sales
// counting different console releases of same titles as unique items
const queryEachTitleVersionBy = (options: GroupAndOrderSettings) => {
  const orderByColumns = formatOrderByArgs({
    column: GLOBAL_SALES,
    order: DESC,
  })(options.orderBy)
  return knex('games').select().orderBy(orderByColumns)
}

// query to return raw list of games, not ordered by sales
const queryGamesListBy = (options: GroupAndOrderSettings) => {
  return options.orderBy
    ? knex('games').select().orderBy(options.orderBy)
    : knex('games').select()
}

/* ------------------- where filters and pagination logic ------------------- */

type QueryType =
  | ReturnType<typeof querySalesBy>
  | ReturnType<typeof queryByScore>
  | typeof queryEachTitleVersionBy
  | typeof queryGamesListBy

// utility functions to differentiate different types of 'where' options
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

// HOF to apply 'where'  options to knex queries
const withQueryOptions = (query: QueryType) => (options: QueryOptions) => {
  // format query with group and order by options
  const newQuery = query(options)

  // apply 'where' options to formatted query
  const optionsArray = Object.entries(options.where)

  return optionsArray.reduce((prev, current) => {
    const [column, searchConditions] = current
    const range = hasSearchRange(searchConditions)

    // note: may adjust group by queries to use 'having' if perf issues
    if (hasNumericSearchType(column)) {
      if (range) {
        return prev.whereBetween(column, searchConditions)
      } else {
        return prev.where(column, searchConditions[0])
      }
    }

    // use whereIn for columns with enums
    const hasEnums = column === 'rating' || column === 'genre'
    if (hasEnums && range) {
      return prev.whereIn(column, searchConditions)
    }
    if (hasEnums) {
      return prev.where(column, searchConditions[0])
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

/* ------------- apply pagination to queries with where options ------------- */

const withPaginatedQueryOptions = (query: QueryType) => async (
  options: PaginatedQueryOptions
) => {
  const { where, groupBy, orderBy, limit, offset } = options
  // get real limit from user-submitted limit
  const realLimit = Math.min(50, limit)

  // run query with limit and offset
  const res = await withQueryOptions(query)({ where, groupBy, orderBy })
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

/* ---------------- export formatted queries with pagination ---------------- */

export const genreQuery = withPaginatedQueryOptions(querySalesBy(GENRE))
export const ratingQuery = withPaginatedQueryOptions(querySalesBy(RATING))
export const consoleQuery = withPaginatedQueryOptions(querySalesBy(CONSOLE))
export const crossPlatformTitleQuery = withPaginatedQueryOptions(
  querySalesBy(TITLE)
)
export const PublisherQuery = withPaginatedQueryOptions(querySalesBy(PUBLISHER))

export const yearOfReleaseQuery = withPaginatedQueryOptions(
  querySalesBy(YEAR_OF_RELEASE)
)
export const criticScoreQuery = withPaginatedQueryOptions(
  queryByScore(CRITIC_SCORE)
)
export const userScoreQuery = withPaginatedQueryOptions(
  queryByScore(USER_SCORE)
)
export const eachTitleVersionQuery = withPaginatedQueryOptions(
  queryEachTitleVersionBy
)
export const gamesListQuery = withPaginatedQueryOptions(queryGamesListBy)

//https://www.kaggle.com/juttugarakesh/video-game-data
// victory urql

// note add conversion for roman numerals 2 === II
