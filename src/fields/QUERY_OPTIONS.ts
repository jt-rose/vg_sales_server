import { InputType, Field, Int, Float } from 'type-graphql'
import {
  Genre,
  Console,
  Rating,
  GroupByColumn,
  OrderByColumnName,
  SortOrder,
} from './ENUMS'
/* ------------------- user options for generating queries ------------------ */

@InputType()
export class OrderByColumn {
  @Field(() => OrderByColumnName)
  column: OrderByColumnName
  @Field(() => SortOrder)
  order: SortOrder
}

export class GroupAndOrderSettings {
  groupBy?: GroupByColumn[]
  orderBy?: OrderByColumn[]
}

/* ------------------------ filter object for queries ----------------------- */

// input fields shape the sql query, defining optional 'where' clauses
// to narrow down what is searched for based on user interests

@InputType()
export class WhereOptions {
  @Field(() => [String], { nullable: true })
  title?: string[]
  @Field(() => [String], { nullable: true })
  titleStartsWith?: string[]
  @Field(() => [String], { nullable: true })
  titleEndsWith?: string[]
  @Field(() => [String], { nullable: true })
  titleContains?: string[]
  @Field(() => [Console], { nullable: true })
  console?: Console[] // enums
  @Field(() => [Int], { nullable: true })
  year_of_release?: [number] | [number, number]
  @Field(() => [String], { nullable: true })
  publisher?: string[]
  @Field(() => [Genre], { nullable: true })
  genre?: Genre[]
  @Field(() => [Rating], { nullable: true })
  rating?: Rating[]
  @Field(() => [Int], { nullable: true })
  critic_score?: [number, number]
  @Field(() => [Int], { nullable: true })
  user_score?: [number, number]
  @Field(() => [String], { nullable: true })
  developer?: string[]
  @Field(() => [Float], { nullable: true })
  global_sales?: [number, number]
  @Field(() => [Float], { nullable: true })
  na_sales?: [number, number]
  @Field(() => [Float], { nullable: true })
  eu_sales?: [number, number]
  @Field(() => [Float], { nullable: true })
  jp_sales?: [number, number]
  @Field(() => [Float], { nullable: true })
  other_sales?: [number, number]
}

@InputType()
export class QueryOptions {
  @Field(() => WhereOptions)
  where: WhereOptions // optional?
  @Field(() => [GroupByColumn], { nullable: true }) // enums?
  groupBy?: GroupByColumn[] //('year_of_release' | 'genre')[] // etc. // optional?
  // validate groupBy if no enums?

  @Field(() => [OrderByColumn], { nullable: true })
  orderBy?: OrderByColumn[]
  // validate orderBy
}

@InputType()
export class PaginatedQueryOptions extends QueryOptions {
  @Field(() => Int)
  limit: number
  @Field(() => Int)
  offset: number
}

//
@InputType()
export class PaginatedWhereOptions {
  @Field(() => WhereOptions, { nullable: true })
  where: WhereOptions
  @Field(() => Int)
  limit: number
  @Field(() => Int)
  offset: number
}
