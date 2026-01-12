import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { noteKeys } from '../constants'
import { noteService } from '../services/noteService'
import type { CreateNoteInput, UpdateNoteInput } from '../types'

export const useNotes = () => {
  const queryClient = useQueryClient()

  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteInput) => noteService.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.notes() })
      toast.success('Note created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create note')
      console.error('Create note error:', error)
    },
  })

  const updateNoteMutation = useMutation({
    mutationFn: (data: UpdateNoteInput) => noteService.updateNote(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.notes() })
      queryClient.invalidateQueries({
        queryKey: noteKeys.noteDetail(variables.id),
      })
      toast.success('Note updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update note')
      console.error('Update note error:', error)
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.notes() })
      toast.success('Note deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to toggleDismissNote note')
      console.error('Delete note error:', error)
    },
  })

  return {
    createNote: createNoteMutation.mutate,
    createNoteAsync: createNoteMutation.mutateAsync,
    isCreatingNote: createNoteMutation.isPending,
    createNoteError: createNoteMutation.error,

    updateNote: updateNoteMutation.mutate,
    updateNoteAsync: updateNoteMutation.mutateAsync,
    isUpdatingNote: updateNoteMutation.isPending,
    updateNoteError: updateNoteMutation.error,

    deleteNote: deleteNoteMutation.mutate,
    deleteNoteAsync: deleteNoteMutation.mutateAsync,
    isDeletingNote: deleteNoteMutation.isPending,
    deleteNoteError: deleteNoteMutation.error,
  }
}
