import { createPool } from 'slonik'
import dotenv from 'dotenv'

dotenv.config()

/* ----------------------------- create sql pool ---------------------------- */

export const pool = createPool(process.env.DATABASE_URL as string)

/* ---------------------- get real limit for pagination --------------------- */

export const getRealLimit = (limit: number) => {
  const realLimit = Math.min(50, limit)
  const realLimitPlusOne = realLimit + 1
  return {
    realLimit,
    realLimitPlusOne,
  }
}
/*
type SlonikCallBack = QueryResultType<Record<string, PrimitiveValueExpressionType>>
export const withPagination = async(limit: number, callback: SlonikCallBack) => {
    const { realLimit, realLimitPlusOne } = getRealLimit(limit)
    const res = await callback()
}*/
