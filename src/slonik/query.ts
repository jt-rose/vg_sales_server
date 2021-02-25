import { getRealLimit, knex } from '../utils/utils'

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
/* ---------------------------------- query --------------------------------- */

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

//type SQLTagCallback = (limit: number) => ReturnType<typeof sql>
type PaginatedQuery = Promise<{
  rows: unknown[] // update later
  hasMore: boolean
}>

type QueryWithLimitConfig =
  | { groupByColumn: string }
  | { scoreType: 'critic_score' | 'user_score' }
  | { gamesQuery: true }
  | { titlesQuery: true }
// wrap sql callback in pagination logic
export const queryWithLimit = (queryType: QueryWithLimitConfig) => async (
  limit: number
): PaginatedQuery => {
  const { realLimit, realLimitPlusOne } = getRealLimit(limit)
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

  //res = await querySalesBy(groupByColumn).limit(realLimitPlusOne)
  const hasMore = res.length === realLimitPlusOne

  return {
    rows: res.slice(0, realLimit),
    hasMore,
  }
}

const queryByScore = (scoreType: 'critic_score' | 'user_score') =>
  knex('games').select().whereNotNull(scoreType).orderBy(scoreType, 'desc')
