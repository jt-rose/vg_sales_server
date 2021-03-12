import { ObjectType, Field, Float, Int } from 'type-graphql'
import { GAMES } from './GAMES'

/* ------------------- paginated response without grouping ------------------ */

@ObjectType()
export class PaginatedGames {
  @Field(() => [GAMES])
  rows!: GAMES[]
  @Field()
  hasMore!: boolean
}

/* ------------------- paginated response grouped by sales ------------------ */

@ObjectType()
class GroupByQueryResponse {
  // sales groupings, always returned
  @Field(() => Float)
  global_sales!: number
  @Field(() => Float)
  na_sales!: number
  @Field(() => Float)
  eu_sales!: number
  @Field(() => Float)
  jp_sales!: number
  @Field(() => Float)
  other_sales!: number
  // optional group by columns
  @Field({ nullable: true })
  console?: string
  @Field(() => Int, { nullable: true })
  year_of_release?: number
  @Field({ nullable: true })
  genre?: string
  @Field(() => String, { nullable: true })
  rating?: string | null
  @Field({ nullable: true })
  publisher?: string
}

/* ---------------- mark specific group by fields as required --------------- */

@ObjectType()
export class GenreSales extends GroupByQueryResponse {
  @Field()
  genre!: string
}

@ObjectType()
export class PaginatedGenreSales {
  @Field(() => [GenreSales])
  rows!: GenreSales[]
  @Field()
  hasMore!: boolean
}

@ObjectType()
export class ConsoleGameSales extends GroupByQueryResponse {
  @Field()
  console!: string
}

@ObjectType()
export class PaginatedConsoleGameSales {
  @Field(() => [ConsoleGameSales])
  rows!: ConsoleGameSales[]
  @Field()
  hasMore!: boolean
}

@ObjectType()
export class RatingSales extends GroupByQueryResponse {
  @Field(() => String, { nullable: true })
  rating!: string | null
}

@ObjectType()
export class PaginatedRatingSales {
  @Field(() => [RatingSales])
  rows!: RatingSales[]
  @Field()
  hasMore!: boolean
}

@ObjectType()
class CrossPlatformSales extends GroupByQueryResponse {
  @Field()
  title!: string
}

@ObjectType()
export class PaginatedCrossPlatformSales {
  @Field(() => [CrossPlatformSales])
  rows!: CrossPlatformSales[]
  @Field()
  hasMore!: boolean
}

@ObjectType()
class YearSales extends GroupByQueryResponse {
  @Field(() => Int)
  year_of_release!: number
}

@ObjectType()
export class PaginatedYearSales {
  @Field(() => [YearSales])
  rows!: YearSales[]
  @Field()
  hasMore!: boolean
}

@ObjectType()
class PublisherSales extends GroupByQueryResponse {
  @Field()
  publisher!: string
}

@ObjectType()
export class PaginatedPublisherSales {
  @Field(() => [PublisherSales])
  rows!: PublisherSales[]
  @Field()
  hasMore!: boolean
}
