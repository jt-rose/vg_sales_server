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
} from './../utils/queries'
import 'reflect-metadata'
import { Resolver, Query, Int, Arg } from 'type-graphql'
import {
  PaginatedGames,
  PaginatedCrossPlatformSales,
  GenreSales,
  PaginatedYearSales,
  PaginatedPublisherSales,
  ConsoleGameSales,
  RatingSales,
} from '../fields/RESPONSE'

@Resolver()
export class Games {
  @Query(() => PaginatedGames)
  async games(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Int) cursor: number
  ) {
    return gamesListQuery({
      whereOptions: {}, // update later
      limit,
      cursor,
    })
  }

  // update filter, cursor, and limit args later
  // not combining sales of a single title across consoles/ PC - add later
  @Query(() => PaginatedGames)
  async salesByTitles(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Int) cursor: number
  ) {
    return eachTtitleVersionQuery({
      whereOptions: {}, // update later
      limit,
      cursor,
    })
  }

  @Query(() => PaginatedCrossPlatformSales)
  async salesByCrossPlatformTitles(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Int) cursor: number
  ) {
    return crossPlatformTitleQuery({
      whereOptions: {}, // update later
      limit,
      cursor,
    })
  }

  @Query(() => [GenreSales])
  async salesByGenre() {
    return genreQuery({})
  }

  @Query(() => PaginatedYearSales)
  async salesByYear(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Int) cursor: number
  ) {
    return yearOfReleaseQuery({
      whereOptions: {}, // update later
      limit,
      cursor,
    })
  }

  @Query(() => PaginatedPublisherSales)
  async salesByPublisher(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Int) cursor: number
  ) {
    return PublisherQuery({
      whereOptions: {}, // update later
      limit,
      cursor,
    })
  }

  // this is for games sold per console, not console sales themselves
  @Query(() => [ConsoleGameSales])
  async salesByConsole() {
    return consoleQuery({})
  }
  // compare console sales to game sales

  @Query(() => [RatingSales])
  async salesByRating() {
    return ratingQuery({})
  }

  @Query(() => PaginatedGames)
  async highestCriticScores(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Int) cursor: number
  ) {
    return criticScoreQuery({
      whereOptions: {}, // update later
      limit,
      cursor,
    })
  }

  @Query(() => PaginatedGames)
  async highestUserScores(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Int) cursor: number
  ) {
    return userScoreQuery({
      whereOptions: {}, // update later
      limit,
      cursor,
    })
  }
}
