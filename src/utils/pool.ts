import { createPool } from 'slonik'
import dotenv from 'dotenv'

dotenv.config()

export const pool = createPool(process.env.DATABASE_URL as string)
