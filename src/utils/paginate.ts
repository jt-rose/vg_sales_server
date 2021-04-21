import { PaginatedQueryOptions, OrderByColumn } from '../fields/QUERY_OPTIONS'
import { GroupByColumn, OrderByColumnName, SortOrder } from '../fields/ENUMS'
import {
  querySalesBy,
  queryByCriticScore,
  queryByUserScore,
  queryEachTitleVersionBy,
  queryGamesListBy,
  QueryType,
} from './queries'
import { applyFilters } from './applyFilters'

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
const { ASC, DESC } = SortOrder

/* ----------------- format group by and order by arguments ----------------- */

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

const formatGroupByArgs = (initialGroupBy?: GroupByColumn) => (
  additionalGroupBy?: GroupByColumn[]
) => {
  const initial = initialGroupBy ? [initialGroupBy] : []
  const additional = additionalGroupBy ? additionalGroupBy : []
  return [...initial, ...additional]
}

/* ------------- apply pagination to queries with where options ------------- */

// confirm order by arguments are matched by groupby arguments
// enums are converted to strings for value comparison
const orderAndGroupArgsAligned = (
  groupBy: GroupByColumn[],
  orderBy: OrderByColumn[]
) => {
  if (!groupBy.length || !orderBy.length) return true
  const formattedOrderBy = orderBy
    .filter((orderByInfo) => !orderByInfo.column.includes('sales'))
    .map((orderByInfo) => `${orderByInfo.column}`)
  const formattedGroupBy = groupBy.map((columnNameEnum) => `${columnNameEnum}`)
  return formattedOrderBy.every((col) => formattedGroupBy.includes(col))
}

const generatePaginatedQuery = (config: {
  /*searchBy: SearchByParam*/ query: QueryType
  initialGroupBy?: GroupByColumn
  initialOrderBy: OrderByColumn
}) => async (options: PaginatedQueryOptions) => {
  // format group by and order by args
  const groupedBy = formatGroupByArgs(config.initialGroupBy)(options.groupBy)
  const orderedBy = formatOrderByArgs(config.initialOrderBy)(options.orderBy)

  // throw error if order by arguments not matching group by arguments
  // when group by arguments provided
  if (!orderAndGroupArgsAligned(groupedBy, orderedBy)) {
    throw new Error(
      ' when using group by arguments and order by arguments together, the values used in order by must be present in group by'
    )
  }

  // get real limit from user-submitted limit
  const realLimit = Math.min(50, options.limit)
  const realLimitPlusOne = realLimit + 1

  const queryOptions = {
    where: options.where,
    groupBy: groupedBy, // one too many
    orderBy: orderedBy,
  }

  //const query = selectQueryType(config.searchBy)//(queryOptions)
  //const filteredQuery = withQueryOptions(query)(queryOptions)//withQueryFilters(query, options.where)
  // apply where filter
  const res = await applyFilters(config.query)(queryOptions)
    .limit(realLimitPlusOne)
    .offset(options.offset)

  // determine if additional items are left to query
  const hasMore = res.length === realLimitPlusOne

  // return expected amount of rows
  const rows = res
    .slice(0, realLimit)
    // and capture unique identifiers of group by combination
    .map((row: [] /* update later */) => ({
      ...row,
      grouping: groupedBy.map((groupByColumn) => row[groupByColumn as any]),
    }))

  // return paginated query object
  return {
    rows,
    groupedBy,
    orderedBy,
    hasMore,
  }
}

/* ---------------- export formatted queries with pagination ---------------- */

const orderByGlobalSales = { column: GLOBAL_SALES, order: DESC }

export const genreQuery = generatePaginatedQuery({
  query: querySalesBy,
  initialOrderBy: orderByGlobalSales,
  initialGroupBy: GENRE,
})

export const ratingQuery = generatePaginatedQuery({
  query: querySalesBy,
  initialGroupBy: RATING,
  initialOrderBy: orderByGlobalSales,
})
export const consoleQuery = generatePaginatedQuery({
  query: querySalesBy,
  initialGroupBy: CONSOLE,
  initialOrderBy: orderByGlobalSales,
})
export const crossPlatformTitleQuery = generatePaginatedQuery({
  query: querySalesBy,
  initialGroupBy: TITLE,
  initialOrderBy: orderByGlobalSales,
})
export const PublisherQuery = generatePaginatedQuery({
  query: querySalesBy,
  initialGroupBy: PUBLISHER,
  initialOrderBy: orderByGlobalSales,
})

export const yearOfReleaseQuery = generatePaginatedQuery({
  query: querySalesBy,
  initialGroupBy: YEAR_OF_RELEASE,
  initialOrderBy: orderByGlobalSales,
})
export const criticScoreQuery = generatePaginatedQuery({
  query: queryByCriticScore,
  initialOrderBy: { column: CRITIC_SCORE, order: DESC },
})
export const userScoreQuery = generatePaginatedQuery({
  query: queryByUserScore,
  initialOrderBy: { column: USER_SCORE, order: ASC },
})
export const eachTitleVersionQuery = generatePaginatedQuery({
  query: queryEachTitleVersionBy,
  initialOrderBy: orderByGlobalSales,
})
export const gamesListQuery = generatePaginatedQuery({
  query: queryGamesListBy,
  initialOrderBy: { column: OrderByColumnName.TITLE, order: ASC },
})

//https://www.kaggle.com/juttugarakesh/video-game-data

// note add conversion for roman numerals 2 === II
