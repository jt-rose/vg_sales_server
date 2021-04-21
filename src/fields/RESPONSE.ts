import { ObjectType, Field, Float, Int } from 'type-graphql'
import { GroupByColumn } from './ENUMS'
import { OrderByColumn } from './QUERY_OPTIONS'
import { GAMES } from './GAMES'

@ObjectType()
class GamesWithGroupBy extends GAMES {
  @Field(() => [String])
  grouping!: string[]
}

@ObjectType()
export class PaginatedGames {
  @Field(() => [GamesWithGroupBy])
  rows!: GamesWithGroupBy[]
  @Field(() => [GroupByColumn])
  groupedBy!: GroupByColumn[]
  @Field(() => [OrderByColumn])
  orderedBy!: OrderByColumn[]
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
  // list of group by combination, always returned
  @Field(() => [String])
  grouping!: string[]
  // optional group by columns, returned when selected
  // in additional group by options
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

@ObjectType()
export class PaginatedGamesWithGroupBy {
  @Field(() => [GroupByQueryResponse])
  rows!: GroupByQueryResponse[]
  @Field(() => [GroupByColumn])
  groupedBy!: GroupByColumn[]
  @Field(() => [OrderByColumn])
  orderedBy!: OrderByColumn[]
  @Field()
  hasMore!: boolean
}

/* ---------------- mark specific group by fields as required --------------- */

@ObjectType()
export class GenreSales extends GroupByQueryResponse {
  @Field()
  genre!: string
}

@ObjectType()
export class PaginatedGenreSales extends PaginatedGamesWithGroupBy {
  @Field(() => [GenreSales])
  rows!: GenreSales[]
}

@ObjectType()
export class ConsoleGameSales extends GroupByQueryResponse {
  @Field()
  console!: string
}

@ObjectType()
export class PaginatedConsoleGameSales extends PaginatedGamesWithGroupBy {
  @Field(() => [ConsoleGameSales])
  rows!: ConsoleGameSales[]
}

@ObjectType()
export class RatingSales extends GroupByQueryResponse {
  @Field(() => String, { nullable: true })
  rating!: string | null
}

@ObjectType()
export class PaginatedRatingSales extends PaginatedGamesWithGroupBy {
  @Field(() => [RatingSales])
  rows!: RatingSales[]
}

@ObjectType()
class CrossPlatformSales extends GroupByQueryResponse {
  @Field()
  title!: string
}

@ObjectType()
export class PaginatedCrossPlatformSales extends PaginatedGamesWithGroupBy {
  @Field(() => [CrossPlatformSales])
  rows!: CrossPlatformSales[]
}

@ObjectType()
class YearSales extends GroupByQueryResponse {
  @Field(() => Int)
  year_of_release!: number
}

@ObjectType()
export class PaginatedYearSales extends PaginatedGamesWithGroupBy {
  @Field(() => [YearSales])
  rows!: YearSales[]
}

@ObjectType()
class PublisherSales extends GroupByQueryResponse {
  @Field()
  publisher!: string
}

@ObjectType()
export class PaginatedPublisherSales extends PaginatedGamesWithGroupBy {
  @Field(() => [PublisherSales])
  rows!: PublisherSales[]
}
