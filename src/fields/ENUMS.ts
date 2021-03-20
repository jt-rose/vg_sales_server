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

export enum Rating {
  AO = 'AO',
  E = 'E',
  E10PLUS = 'E10+',
  EC = 'EC',
  K_A = 'K-A',
  M = 'M',
  RP = 'RP',
  T = 'T',
}

registerEnumType(Rating, {
  name: 'rating',
  description: 'select games by different ratings',
})

export enum GroupByColumn {
  GENRE = 'genre',
  RATING = 'rating',
  CONSOLE = 'console',
  TITLE = 'title',
  PUBLISHER = 'publisher',
  YEAR_OF_RELEASE = 'year_of_release',
}

registerEnumType(GroupByColumn, {
  name: 'Column',
  description: 'The columns that can be used to group the search by',
})

export enum OrderByColumnName {
  TITLE = 'title',
  CONSOLE = 'console',
  YEAR_OF_RELEASE = 'year_of_release',
  PUBLISHER = 'publisher',
  GENRE = 'genre',
  RATING = 'rating',
  CRITIC_SCORE = 'critic_score',
  USER_SCORE = 'user_score',
  DEVELOPER = 'developer',
  GLOBAL_SALES = 'global_sales',
  NA_SALES = 'na_sales',
  EU_SALES = 'eu_sales',
  JP_SALES = 'jp_sales',
  OTHER_SALES = 'other_sales',
}

registerEnumType(OrderByColumnName, {
  name: 'OrderByColumns',
  description: 'select columns to order results by',
})

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
  description:
    'select whether column should be sorted as ascending or descending',
})
