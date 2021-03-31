import { ObjectType, InputType, Field, Int, Float } from 'type-graphql'
import {
  Genre,
  Console,
  Rating,
  GroupByColumn,
  OrderByColumnName,
  SortOrder,
} from './ENUMS'

/* -------------------- interface for order by arguments -------------------- */

@ObjectType()
@InputType('OrderByColumnInput')
export class OrderByColumn {
  @Field(() => OrderByColumnName)
  column: OrderByColumnName
  @Field(() => SortOrder)
  order: SortOrder
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
  console?: Console[]
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

/* -------------------- user inputs for designing queries ------------------- */

@InputType()
export class QueryOptions {
  @Field(() => WhereOptions)
  where: WhereOptions
  @Field(() => [GroupByColumn], { nullable: true })
  groupBy: GroupByColumn[]

  @Field(() => [OrderByColumn], {
    nullable: true,
    description: `if query uses group by columns, 
      then order by columns must be present 
      amongst group by options`,
  })
  orderBy: OrderByColumn[]
  // validate orderBy
}

@InputType()
export class PaginatedQueryOptions extends QueryOptions {
  @Field(() => Int)
  limit: number
  @Field(() => Int)
  offset: number
}
