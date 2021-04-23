import { Resolver, Query, Arg, UseMiddleware } from 'type-graphql'
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
} from '../utils/paginate'
import { rateLimit } from '../utils/rateLimit'

@Resolver()
export class Games {
  @Query(() => PaginatedGames)
  @UseMiddleware(rateLimit())
  async games(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return gamesListQuery(options)
  }

  @Query(() => PaginatedGames)
  @UseMiddleware(rateLimit())
  async salesByTitles(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return eachTitleVersionQuery(options)
  }

  @Query(() => PaginatedCrossPlatformSales)
  @UseMiddleware(rateLimit())
  async salesByCrossPlatformTitles(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return crossPlatformTitleQuery(options)
  }

  @Query(() => PaginatedGenreSales)
  @UseMiddleware(rateLimit())
  async salesByGenre(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return genreQuery(options)
  }

  @Query(() => PaginatedYearSales)
  @UseMiddleware(rateLimit())
  async salesByYear(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return yearOfReleaseQuery(options)
  }

  @Query(() => PaginatedPublisherSales)
  @UseMiddleware(rateLimit())
  async salesByPublisher(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return PublisherQuery(options)
  }

  // this is for games sold per console, not console sales themselves
  @Query(() => PaginatedConsoleGameSales)
  @UseMiddleware(rateLimit())
  async salesByConsole(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return consoleQuery(options)
  }

  @Query(() => PaginatedRatingSales)
  @UseMiddleware(rateLimit())
  async salesByRating(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return ratingQuery(options)
  }

  @Query(() => PaginatedGames)
  @UseMiddleware(rateLimit())
  async highestCriticScores(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return criticScoreQuery(options)
  }

  @Query(() => PaginatedGames)
  @UseMiddleware(rateLimit())
  async highestUserScores(
    @Arg('options', () => PaginatedQueryOptions) options: PaginatedQueryOptions
  ) {
    return userScoreQuery(options)
  }
}
