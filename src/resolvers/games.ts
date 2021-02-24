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
import { Resolver, Query, Int, Arg } from 'type-graphql'
import { gamesQuery, salesByConsoleQuery } from '../slonik/query'
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
  async games(@Arg('limit', () => Int) limit: number) {
    return gamesQuery(limit)
  }

  // update filter, cursor, and limit args later
  // not combining sales of a single title across consoles/ PC - add later
  @Query(() => PaginatedGames)
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

  @Query(() => PaginatedGames)
  async highestCriticScores(@Arg('limit', () => Int) limit: number) {
    return highestCriticScoresQuery(limit)
  }

  @Query(() => PaginatedGames)
  async highestUserScores(@Arg('limit', () => Int) limit: number) {
    return highestUserScoresQuery(limit)
  }
}
