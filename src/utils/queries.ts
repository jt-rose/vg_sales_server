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
  @Field(() => String, { nullable: true })
  title?: string
  @Field(() => String, { nullable: true })
  console?: string
}

/* ------------------------- pre-paginated queries -------------------------- */

const querySalesBy = (groupByColumn: string) => (where: WhereOptions) =>
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

const queryByScore = (scoreType: 'critic_score' | 'user_score') => (
  where: WhereOptions
) =>
  knex('games')
    .select()
    .where(where)
    .whereNotNull(scoreType)
    .orderBy(scoreType, 'desc')

const queryEachTitleVersionBy = (where: WhereOptions) =>
  knex('games').select().where(where).orderBy('global_sales', 'desc')

const queryGamesListBy = (where: WhereOptions) =>
  knex('games').select().where(where)

/* -------------------------- determine query type -------------------------- */

type QueryType =
  | {
      type: 'user_score' | 'critic_score' | 'gamesList' | 'eachTitleVersion'
    }
  | {
      type: 'groupBy'
      data: string
    }

// select different queries to implement as subqueries
// within the dynamicPagination function below
const determineQueryType = (queryType: QueryType) => {
  switch (queryType.type) {
    case 'user_score': {
      return queryByScore('user_score')
    }
    case 'critic_score': {
      return queryByScore('critic_score')
    }
    case 'eachTitleVersion': {
      return queryEachTitleVersionBy
    }
    case 'gamesList': {
      return queryGamesListBy
    }
    case 'groupBy': {
      return querySalesBy(queryType.data)
    }
    default: {
      throw new Error('wrong query type submitted to pagination HOF')
    }
  }
}

/* --------------- cursor-based pagination for dynamic queries -------------- */

// MUST CHECK VALUES ON BACKEND BEFORE EXECUTING!!!
// since user input from front end can shape column names,
// this MUST be validated before execution

// additionally, the cursor position stored on frontend
// will need to be invalidated when the query changes
// since the row_number corresponds to a dynamic table
@InputType()
export class PaginatedWhereOptions {
  @Field(() => WhereOptions, { nullable: true })
  whereOptions: WhereOptions
  @Field(() => Int)
  limit: number
  @Field(() => Int)
  cursor: number
}

const withDynamicPagination = (queryType: QueryType) => async (
  options: PaginatedWhereOptions
) => {
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

/* --------------- export formatted queries without pagination -------------- */

export const genreQuery = querySalesBy('genre')
export const ratingQuery = querySalesBy('rating')
export const consoleQuery = querySalesBy('console')

/* ---------------- export formatted queries with pagination ---------------- */

export const crossPlatformTitleQuery = withDynamicPagination({
  type: 'groupBy',
  data: 'title',
})
export const PublisherQuery = withDynamicPagination({
  type: 'groupBy',
  data: 'publisher',
})
export const yearOfReleaseQuery = withDynamicPagination({
  type: 'groupBy',
  data: 'year_of_release',
})

export const criticScoreQuery = withDynamicPagination({
  type: 'critic_score',
})
export const userScoreQuery = withDynamicPagination({
  type: 'user_score',
})
export const eachTtitleVersionQuery = withDynamicPagination({
  type: 'eachTitleVersion',
})
export const gamesListQuery = withDynamicPagination({ type: 'gamesList' })
