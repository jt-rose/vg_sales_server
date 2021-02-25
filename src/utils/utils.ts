import { createPool } from 'slonik'
import dotenv from 'dotenv'
import Knex from 'knex'

dotenv.config()

/* ------------------------- create sql connections ------------------------- */

export const pool = createPool(process.env.DATABASE_URL as string)

export const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL as string,
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
