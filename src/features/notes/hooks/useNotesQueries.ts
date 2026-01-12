import { useQuery } from '@tanstack/react-query'
import { noteService } from '../services/noteService'
import type { NoteQuery } from '../types'
import { noteKeys } from '../constants'

export const useNoteQueries = () => {
  const useNotesList = (query: NoteQuery) => {
    return useQuery({
      queryKey: noteKeys.notesList(query),
      queryFn: () => noteService.getNotes(query),
    })
  }

  const useNote = (id: string, enabled = true) => {
    return useQuery({
      queryKey: noteKeys.noteDetail(id),
      queryFn: () => noteService.getNote(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useNotesList,
    useNote,
  }
}
