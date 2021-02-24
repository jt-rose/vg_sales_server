import 'reflect-metadata'
import {
  highestCriticScoresQuery,
  highestUserScoresQuery,
  salesByCrossPlatformTitlesQuery,
  salesByGenreQuery,
  salesByPublisherQuery,
  salesByRatingQuery,
  salesByTitlesQuery,
  salesByYearQuery,
} from './../slonik/query'

import {
  Resolver,
  Query,
  ObjectType,
  Field,
  Float,
  Int,
  Arg,
} from 'type-graphql'
import { GAMES } from '../entities/GAMES'
import { gamesQuery, salesByConsoleQuery } from '../slonik/query'

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
class CrossPlatformSales extends CombinedSales {
  @Field()
  title!: string
}

@ObjectType()
class PaginatedCrossPlatformSales {
  @Field(() => [CrossPlatformSales])
  rows: CrossPlatformSales[]
  @Field()
  hasMore: boolean
}

@ObjectType()
class YearSales extends CombinedSales {
  @Field(() => Int)
  year!: number
}

@ObjectType()
class PaginatedYearSales {
  @Field(() => [YearSales])
  rows: YearSales[]
  @Field()
  hasMore: boolean
}

@ObjectType()
class GenreSales extends CombinedSales {
  @Field()
  genre!: string
}

@ObjectType()
class PublisherSales extends CombinedSales {
  @Field()
  publisher!: string
}

@ObjectType()
class PaginatedPublisherSales {
  @Field(() => [PublisherSales])
  rows: PublisherSales[]
  @Field()
  hasMore: boolean
}

@ObjectType()
class ConsoleGameSales extends CombinedSales {
  @Field()
  console!: string
}

@ObjectType()
class RatingSales extends CombinedSales {
  @Field({ nullable: true })
  rating: string
}

@ObjectType()
class PaginatedRes {
  @Field(() => [GAMES])
  rows: GAMES[]
  @Field()
  hasMore: boolean
}

@Resolver()
export class Games {
  @Query(() => PaginatedRes)
  async games(@Arg('limit', () => Int) limit: number) {
    return gamesQuery(limit)
  }

  // update filter, cursor, and limit args later
  // not combining sales of a single title across consoles/ PC - add later
  // set pool.query to function to add strict types for return
  @Query(() => PaginatedRes)
  async salesByTitles(@Arg('limit', () => Int) limit: number) {
    return salesByTitlesQuery(limit)
  }

  @Query(() => PaginatedCrossPlatformSales)
  async salesByCrossPlatformTitles(@Arg('limit', () => Int) limit: number) {
    return salesByCrossPlatformTitlesQuery(limit)
  }

  @Query(() => [GenreSales])
  async salesByGenre() {
    return salesByGenreQuery()
  }

  @Query(() => PaginatedYearSales)
  async salesByYear(@Arg('limit', () => Int) limit: number) {
    return salesByYearQuery(limit)
  }

  @Query(() => PaginatedPublisherSales)
  async salesByPublisher(@Arg('limit', () => Int) limit: number) {
    return salesByPublisherQuery(limit)
  }

  // this is for games sold per console, not console sales themselves
  @Query(() => [ConsoleGameSales])
  async salesByConsole() {
    return salesByConsoleQuery()
  }
  // compare console sales to game sales

  @Query(() => [RatingSales])
  async salesByRating() {
    return salesByRatingQuery()
  }

  @Query(() => PaginatedRes)
  async highestCriticScores(@Arg('limit', () => Int) limit: number) {
    return highestCriticScoresQuery(limit)
  }

  @Query(() => PaginatedRes)
  async highestUserScores(@Arg('limit', () => Int) limit: number) {
    return highestUserScoresQuery(limit)
  }
}
