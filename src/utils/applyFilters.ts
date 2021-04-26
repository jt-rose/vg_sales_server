import { QueryOptions, TextSearch } from '../fields/QUERY_OPTIONS'
import { TextSearchType } from '../fields/ENUMS'
import { QueryType } from './queries'

/* ----------- utility functions to differentiate 'where' options ----------- */

const hasNumericSearchType = (whereColumn: string) =>
  [
    'year_of_release',
    'critic_score',
    'user_score',
    'global_sales',
    'na_sales',
    'eu_sales',
    'jp_sales',
    'other_sales',
  ].includes(whereColumn)

const hasSearchRange = (whereData: string[] | number[]) => whereData.length > 1

const formatTextSearch = (textSearch: TextSearch) => {
  switch (textSearch.searchType) {
    case TextSearchType.STARTSWITH:
      return textSearch.searchText.map((text) => text + '%')
    case TextSearchType.ENDSWITH:
      return textSearch.searchText.map((text) => '%' + text)
    case TextSearchType.CONTAINS:
      return textSearch.searchText.map((text) => '%' + text + '%')
    default:
      return textSearch.searchText
  }
}

const getLengthOfIlikeArgs = (length: number) => {
  switch (length) {
    case 2:
      return '?? ilike any(array[?, ?])'
    case 3:
      return '?? ilike any(array[?, ?, ?])'
    case 4:
      return '?? ilike any(array[?, ?, ?, ?])'
    case 5:
      return '?? ilike any(array[?, ?, ?, ?, ?])'
    default:
      throw new Error('no more than 5 arguments may be provided')
  }
}

/* -------------------- apply 'where' filters to queries -------------------- */

// HOF to apply 'where'  options to knex queries
export const applyFilters = (query: QueryType) => (options: QueryOptions) => {
  // destructure options
  const { where, groupBy, orderBy } = options

  // format new query with group and order by options
  const newQuery = query({ orderBy, groupBy })

  // apply 'where' options to formatted query
  const optionsArray = Object.entries(where)

  return optionsArray.reduce((prev, current) => {
    const [column, searchConditions] = current
    const range = hasSearchRange(searchConditions)

    if (hasNumericSearchType(column)) {
      if (range) {
        return prev.whereBetween(column, searchConditions)
      } else {
        return prev.where(column, searchConditions[0])
      }
    }

    // use whereIn for columns with enums
    const hasEnums = ['genre', 'rating', 'console'].includes(column)
    if (hasEnums && range) {
      return prev.whereIn(column, searchConditions)
    }
    if (hasEnums) {
      return prev.where(column, searchConditions[0])
    }

    // format text search if searching for titles that contain, start with, etc.
    const formattedTextSearch =
      column === 'title' ? formatTextSearch(searchConditions) : searchConditions

    if (
      range ||
      (column === 'title' && hasSearchRange(searchConditions.searchText))
    ) {
      const sqlText = getLengthOfIlikeArgs(formattedTextSearch.length)
      return prev.whereRaw(sqlText, [column, ...formattedTextSearch])
    } else {
      return prev.where(column, 'ilike', formattedTextSearch[0])
    }
  }, newQuery)
}
