import { Field, Int, ObjectType } from 'type-graphql'

type Ratings = 'AO' | 'E' | 'E10+' | 'EC' | 'K-A' | 'M' | 'RP' | 'T'

type Genre =
  | 'Action'
  | 'Adventure'
  | 'Fighting'
  | 'Misc'
  | 'Platform'
  | 'Puzzle'
  | 'Racing'
  | 'Role-Playing'
  | 'Shooter'
  | 'Simulation'
  | 'Sports'
  | 'Strategy'

@ObjectType()
export class GAMES {
  @Field(() => Int)
  id!: number

  @Field()
  title!: string

  @Field()
  console!: string

  @Field(() => Int)
  year_of_release!: number

  @Field(() => String) // issue with registerEnums, check later
  genre!: Genre

  @Field()
  publisher!: string

  // millions
  @Field()
  NA_players!: number

  @Field()
  EU_players!: number

  @Field()
  JP_players!: number

  @Field()
  other_players!: number

  @Field()
  global_players!: number

  @Field(() => Int)
  critic_score: number

  @Field(() => Int)
  critic_count: number

  @Field()
  user_score: number

  @Field(() => Int)
  user_count: number

  @Field()
  developer: string

  @Field(() => String)
  rating: Ratings

  @Field(() => String)
  unique_by_name!: string

  @Field(() => String)
  unique_by_year!: string
}
