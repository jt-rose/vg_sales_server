import { Resolver, Query, Arg } from 'type-graphql'
import { PaginatedQueryOptions } from '../fields/QUERY_OPTIONS'
import {
  PaginatedGames,
  PaginatedCrossPlatformSales,
  PaginatedYearSales,
  PaginatedPublisherSales,
  PaginatedGenreSales,
  PaginatedConsoleGameSales,
  PaginatedRatingSales,
} from '../fields/RESPONSE'
import {
  consoleQuery,
  criticScoreQuery,
  crossPlatformTitleQuery,
  eachTitleVersionQuery,
  gamesListQuery,
  genreQuery,
  PublisherQuery,
  ratingQuery,
  userScoreQuery,
  yearOfReleaseQuery,
} from './../utils/queries'

@Resolver()
export class Games {
  @Query(() => PaginatedGames)
  async games(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return gamesListQuery(options)
  }

  // not combining sales of a single title across consoles/ PC - add later
  @Query(() => PaginatedGames)
  async salesByTitles(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return eachTitleVersionQuery(options)
  }

  @Query(() => PaginatedCrossPlatformSales)
  async salesByCrossPlatformTitles(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return crossPlatformTitleQuery(options)
  }

  @Query(() => PaginatedGenreSales)
  async salesByGenre(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return genreQuery(options)
  }

  @Query(() => PaginatedYearSales)
  async salesByYear(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return yearOfReleaseQuery(options)
  }

  @Query(() => PaginatedPublisherSales)
  async salesByPublisher(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return PublisherQuery(options)
  }

  // this is for games sold per console, not console sales themselves
  @Query(() => PaginatedConsoleGameSales)
  async salesByConsole(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return consoleQuery(options)
  }

  // Note: provide resolver to compare console sales to game sales

  @Query(() => PaginatedRatingSales)
  async salesByRating(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return ratingQuery(options)
  }

  @Query(() => PaginatedGames)
  async highestCriticScores(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return criticScoreQuery(options)
  }

  @Query(() => PaginatedGames)
  async highestUserScores(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return userScoreQuery(options)
  }
}
