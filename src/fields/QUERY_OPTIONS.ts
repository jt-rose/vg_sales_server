import { InputType, Field, Int, Float } from 'type-graphql'

/* ------------------- user options for generating queries ------------------ */

export type GroupByColumn =
  | 'genre'
  | 'rating'
  | 'console'
  | 'title'
  | 'publisher'
  | 'year_of_release'

export type OrderByColumn = string // update later

export class GroupAndOrderSettings {
  groupBy: GroupByColumn[] // add undefined and remove constructor?
  orderBy: OrderByColumn[]

  constructor(options: { groupBy?: GroupByColumn[]; orderBy?: string[] }) {
    this.groupBy = options.groupBy ?? []
    this.orderBy = options.orderBy ?? []
  }
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
  @Field(() => [String], { nullable: true })
  console?: string[]
  @Field(() => [Int], { nullable: true })
  year_of_release?: [number] | [number, number]
  @Field(() => [String], { nullable: true })
  publisher?: string[]
  @Field(() => [String], { nullable: true })
  genre?: string[]
  @Field(() => [String], { nullable: true })
  rating?: string[]
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

//

@InputType()
export class QueryOptions {
  @Field(() => WhereOptions)
  where: WhereOptions // optional?
  @Field(() => [String], { nullable: true }) // enums?
  groupBy?: GroupByColumn[] //('year_of_release' | 'genre')[] // etc. // optional?
  // validate groupBy if no enums?

  @Field(() => [String], { nullable: true })
  orderBy?: string[]
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
