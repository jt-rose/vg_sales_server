import { OrderByColumn } from '../fields/QUERY_OPTIONS'
import { GroupByColumn, OrderByColumnName } from '../fields/ENUMS'
import dotenv from 'dotenv'
import Knex from 'knex'

dotenv.config()

/* --------------------------- connect to database -------------------------- */

export const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
})

/* --------------------------------- queries -------------------------------- */

//  query to investigate game sales
// grouped by genre, console, publisher, etc.

// to find sales of games released across different versions,
// such as multiple consoles, we can simply group by title

interface GroupAndOrderSettings {
  groupBy: GroupByColumn[]
  orderBy: OrderByColumn[]
}

// return customized query focusing on game sales
export const querySalesBy = (options: GroupAndOrderSettings) => {
  const { groupBy, orderBy } = options

  return knex('games')
    .select(groupBy)
    .sum({
      global_sales: 'global_sales',
      na_sales: 'na_sales',
      eu_sales: 'eu_sales',
      jp_sales: 'jp_sales',
      other_sales: 'other_sales',
    })
    .groupBy(groupBy)
    .orderBy(orderBy)
}

type ScoreType = OrderByColumnName.CRITIC_SCORE | OrderByColumnName.USER_SCORE

// query to return games ordered by score
const queryByScore = (scoreType: ScoreType) => (
  options: GroupAndOrderSettings
) => {
  return knex('games').select().whereNotNull(scoreType).orderBy(options.orderBy)
}

export const queryByCriticScore = queryByScore(OrderByColumnName.CRITIC_SCORE)
export const queryByUserScore = queryByScore(OrderByColumnName.USER_SCORE)

// query to return games counting different console releases
// of same titles as unique items
export const queryEachTitleVersionBy = (options: GroupAndOrderSettings) => {
  return knex('games').select().orderBy(options.orderBy)
}

// query to return raw list of games, not ordered by sales
export const queryGamesListBy = (options: GroupAndOrderSettings) => {
  return options.orderBy.length
    ? knex('games').select().orderBy(options.orderBy)
    : knex('games').select()
}

export type QueryType =
  | typeof querySalesBy
  | typeof queryByCriticScore
  | typeof queryByUserScore
  | typeof queryEachTitleVersionBy
  | typeof queryGamesListBy
