import { registerEnumType } from 'type-graphql'

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
