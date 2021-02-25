import { ObjectType, Field, Float, Int } from 'type-graphql'
import { GAMES } from './GAMES'

/* ------------------- response fields without pagination ------------------ */

@ObjectType()
class CombinedSales {
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
}

@ObjectType()
export class GenreSales extends CombinedSales {
  @Field()
  genre!: string
}

@ObjectType()
export class ConsoleGameSales extends CombinedSales {
  @Field()
  console!: string
}

@ObjectType()
export class RatingSales extends CombinedSales {
  @Field({ nullable: true })
  rating: string
}

/* -------------------- response fields with pagination -------------------- */

@ObjectType()
export class PaginatedGames {
  @Field(() => [GAMES])
  rows: GAMES[]
  @Field()
  hasMore: boolean
}

@ObjectType()
class CrossPlatformSales extends CombinedSales {
  @Field()
  title!: string
}

@ObjectType()
export class PaginatedCrossPlatformSales {
  @Field(() => [CrossPlatformSales])
  rows: CrossPlatformSales[]
  @Field()
  hasMore: boolean
}

@ObjectType()
class YearSales extends CombinedSales {
  @Field(() => Int)
  year_of_release!: number
}

@ObjectType()
export class PaginatedYearSales {
  @Field(() => [YearSales])
  rows: YearSales[]
  @Field()
  hasMore: boolean
}

@ObjectType()
class PublisherSales extends CombinedSales {
  @Field()
  publisher!: string
}

@ObjectType()
export class PaginatedPublisherSales {
  @Field(() => [PublisherSales])
  rows: PublisherSales[]
  @Field()
  hasMore: boolean
}
