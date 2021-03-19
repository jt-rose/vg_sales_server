import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'

type Ratings = 'AO' | 'E' | 'E10+' | 'EC' | 'K-A' | 'M' | 'RP' | 'T'
/*
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
*/
export enum Genre {
  ACTION = 'Action',
  ADVENTURE = 'Adventure',
  FIGHTING = 'Fighting',
  MISC = 'Misc',
  PLATFORM = 'Platform',
  PUZZLE = 'Puzzle',
  RACING = 'Racing',
  ROLEPLAYING = 'Role-Playing',
  SHOOTER = 'Shooter',
  SIMULATION = 'Simulation',
  SPORTS = 'Sports',
  STRATEGY = 'Strategy',
}

registerEnumType(Genre, {
  name: 'genre',
  description: 'select games by different genres',
})

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

  @Field(() => Genre)
  genre!: Genre

  @Field()
  publisher!: string

  // millions
  @Field()
  na_sales!: number

  @Field()
  eu_sales!: number

  @Field()
  jp_sales!: number

  @Field()
  other_sales!: number

  @Field()
  global_sales!: number

  @Field(() => Int, { nullable: true })
  critic_score: number

  @Field(() => Int, { nullable: true })
  critic_count: number

  @Field(() => Int, { nullable: true })
  user_score: number

  @Field(() => Int, { nullable: true })
  user_count: number

  @Field({ nullable: true })
  developer: string

  @Field(() => String, { nullable: true })
  rating: Ratings
}
