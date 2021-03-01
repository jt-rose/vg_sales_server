import { Resolver, Query, Arg } from 'type-graphql'
import {
  PaginatedGames,
  PaginatedCrossPlatformSales,
  GenreSales,
  PaginatedYearSales,
  PaginatedPublisherSales,
  ConsoleGameSales,
  RatingSales,
} from '../fields/RESPONSE'
import {
  consoleQuery,
  criticScoreQuery,
  crossPlatformTitleQuery,
  eachTtitleVersionQuery,
  gamesListQuery,
  genreQuery,
  PublisherQuery,
  ratingQuery,
  userScoreQuery,
  yearOfReleaseQuery,
  PaginatedWhereOptions,
  WhereOptions,
} from './../utils/queries'

@Resolver()
export class Games {
  @Query(() => PaginatedGames)
  async games(
    @Arg('options', () => PaginatedWhereOptions) options: PaginatedWhereOptions
  ) {
    return gamesListQuery(options)
  }

  // not combining sales of a single title across consoles/ PC - add later
  @Query(() => PaginatedGames)
  async salesByTitles(
    @Arg('options', () => PaginatedWhereOptions) options: PaginatedWhereOptions
  ) {
    return eachTtitleVersionQuery(options)
  }

  @Query(() => PaginatedCrossPlatformSales)
  async salesByCrossPlatformTitles(
    @Arg('options', () => PaginatedWhereOptions) options: PaginatedWhereOptions
  ) {
    return crossPlatformTitleQuery(options)
  }

  @Query(() => [GenreSales])
  async salesByGenre(@Arg('where', () => WhereOptions) where: WhereOptions) {
    return genreQuery(where)
  }

  @Query(() => PaginatedYearSales)
  async salesByYear(
    @Arg('options', () => PaginatedWhereOptions) options: PaginatedWhereOptions
  ) {
    return yearOfReleaseQuery(options)
  }

  @Query(() => PaginatedPublisherSales)
  async salesByPublisher(
    @Arg('options', () => PaginatedWhereOptions) options: PaginatedWhereOptions
  ) {
    return PublisherQuery(options)
  }

  // this is for games sold per console, not console sales themselves
  @Query(() => [ConsoleGameSales])
  async salesByConsole(@Arg('where', () => WhereOptions) where: WhereOptions) {
    return consoleQuery(where)
  }

  // Note: provide resolver to compare console sales to game sales

  @Query(() => [RatingSales])
  async salesByRating(@Arg('where', () => WhereOptions) where: WhereOptions) {
    return ratingQuery(where)
  }

  @Query(() => PaginatedGames)
  async highestCriticScores(
    @Arg('options', () => PaginatedWhereOptions) options: PaginatedWhereOptions
  ) {
    return criticScoreQuery(options)
  }

  @Query(() => PaginatedGames)
  async highestUserScores(
    @Arg('options', () => PaginatedWhereOptions) options: PaginatedWhereOptions
  ) {
    return userScoreQuery(options)
  }
}
