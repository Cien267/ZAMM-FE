import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../services/peopleService'
import type { PersonQuery } from '../types'
import { peopleKeys } from '../constants'

export const usePeopleQueries = () => {
  // People queries
  const usePeopleList = (query: PersonQuery) => {
    return useQuery({
      queryKey: peopleKeys.peopleList(query),
      queryFn: () => peopleService.getPeople(query),
    })
  }

  const usePerson = (id: string, enabled = true) => {
    return useQuery({
      queryKey: peopleKeys.personDetail(id),
      queryFn: () => peopleService.getPerson(id),
      enabled: enabled && !!id,
    })
  }

  return {
    usePeopleList,
    usePerson,
  }
}
