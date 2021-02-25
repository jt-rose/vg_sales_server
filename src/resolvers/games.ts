import 'reflect-metadata'
import { querySalesBy, queryWithLimit } from './../slonik/query'
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
  async games(@Arg('limit', () => Int) limit: number) {
    //return gamesQuery(limit)
    return queryWithLimit({ gamesQuery: true })(limit)
  }

  // update filter, cursor, and limit args later
  // not combining sales of a single title across consoles/ PC - add later
  @Query(() => PaginatedGames)
  async salesByTitles(@Arg('limit', () => Int) limit: number) {
    //return salesByTitlesQuery(limit)
    return queryWithLimit({ titlesQuery: true })(limit)
  }

  @Query(() => PaginatedCrossPlatformSales)
  async salesByCrossPlatformTitles(@Arg('limit', () => Int) limit: number) {
    return queryWithLimit({ groupByColumn: 'title' })(limit)
  }

  @Query(() => [GenreSales])
  async salesByGenre() {
    return querySalesBy('genre')
  }

  @Query(() => PaginatedYearSales)
  async salesByYear(@Arg('limit', () => Int) limit: number) {
    //return salesByYearQuery(limit)
    return queryWithLimit({ groupByColumn: 'year_of_release' })(limit)
  }

  @Query(() => PaginatedPublisherSales)
  async salesByPublisher(@Arg('limit', () => Int) limit: number) {
    //return salesByPublisherQuery(limit)
    return queryWithLimit({ groupByColumn: 'publisher' })(limit)
  }

  // this is for games sold per console, not console sales themselves
  @Query(() => [ConsoleGameSales])
  async salesByConsole() {
    return querySalesBy('console')
  }
  // compare console sales to game sales

  @Query(() => [RatingSales])
  async salesByRating() {
    return querySalesBy('rating')
  }

  @Query(() => PaginatedGames)
  async highestCriticScores(@Arg('limit', () => Int) limit: number) {
    //return highestCriticScoresQuery(limit)
    return queryWithLimit({ scoreType: 'critic_score' })(limit)
  }

  @Query(() => PaginatedGames)
  async highestUserScores(@Arg('limit', () => Int) limit: number) {
    //return highestUserScoresQuery(limit)
    return queryWithLimit({ scoreType: 'user_score' })(limit)
  }
}
