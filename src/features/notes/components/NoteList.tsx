import { useState } from 'react'
import { format } from 'date-fns'
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  Plus,
  StickyNote,
  User,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { type Note, type NoteQuery } from '../types'
import { useNotes } from '../hooks/useNotes'
import { useNoteQueries } from '../hooks/useNotesQueries'
import { useAlert } from '@/contexts/AlertContext'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import {
  CreateNoteSchema,
  UpdateNoteSchema,
  type CreateNoteInput,
  type UpdateNoteInput,
} from '../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { NoteField } from './NoteField'
import { openUpSertEventModal } from '@/features/events/components/UpsertEvent'

const ListSkeleton = () => {
  return (
    <div className="relative space-y-0 w-1/4 ml-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="pb-8">
          <div className="flex flex-col gap-3 p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-50" />
                <Skeleton className="h-4 w-37.5" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface NoteListProps {
  personId: string | null
  companyId: string | null
  liabilityId: string | null
  type: 'person' | 'company' | 'liability'
  height?: string
}

export const NoteList = ({
  personId,
  companyId,
  liabilityId,
  type,
  height = 'h-150',
}: NoteListProps) => {
  const { openAlert } = useAlert()
  const { deleteNote, createNote, updateNote } = useNotes()
  const { useNotesList } = useNoteQueries()

  const query: NoteQuery = {
    pageNumber: 1,
    pageSize: 1000,
    sortBy: 'CreatedAt',
    sortDescending: true,
    authorId: undefined,
    personId: personId || undefined,
    companyId: companyId || undefined,
    liabilityId: liabilityId || undefined,
    eventId: undefined,
  }
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const { data: notesData, isLoading, error } = useNotesList(query)

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      text: '',
      authorId: undefined,
      liabilityId: liabilityId || undefined,
      eventId: undefined,
      personId: personId || undefined,
      companyId: companyId || undefined,
    },
  })
  const editForm = useForm<UpdateNoteInput>({
    resolver: zodResolver(UpdateNoteSchema),
    defaultValues: {
      text: '',
      authorId: undefined,
      liabilityId: liabilityId || undefined,
      eventId: undefined,
      personId: personId || undefined,
      companyId: companyId || undefined,
    },
  })

  if (isLoading) {
    return <ListSkeleton />
  }

  if (error) {
    return <ErrorState message={error.message} />
  }

  const sortedNotes = [...(notesData?.data || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const onDeleteConfirm = (note: Note) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete the note "${note.text}".`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await deleteNote(note.id)
      },
    })
  }

  const onSubmitCreate = async (data: CreateNoteInput) => {
    try {
      await createNote(data)
      form.reset()
    } catch (error) {
      console.error('Note submission error:', error)
    }
  }

  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.id)
    editForm.reset({
      id: note.id,
      text: note.text,
      authorId: undefined,
      liabilityId: liabilityId || undefined,
      eventId: undefined,
      personId: personId || undefined,
      companyId: companyId || undefined,
    })
  }

  const onUpdateSubmit = async (data: UpdateNoteInput) => {
    try {
      await updateNote(data)
      setEditingNoteId(null)
    } catch (error) {
      console.error('Update error:', error)
    }
  }
  return (
    <div className="relative space-y-0 py-2 pt-3">
      <h3 className="font-semibold pb-4">{sortedNotes.length} notes</h3>
      <div className="flex justify-between items-center gap-2 mb-4">
        <Form {...form}>
          <form
            id="note-form"
            onSubmit={form.handleSubmit(onSubmitCreate, (errors) =>
              console.log('Validation Errors:', errors)
            )}
            className="space-y-6 flex justify-between items-center w-full gap-2"
          >
            <NoteField control={form.control} />
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </form>
        </Form>
      </div>
      {sortedNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center animate-in fade-in zoom-in duration-300">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <StickyNote className="h-10 w-10 text-amber-500" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No note recorded</h3>
          <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-62.5">
            Capture your thoughts and observations by adding your first note.
          </p>
        </div>
      )}

      {sortedNotes.length > 0 && (
        <>
          <ScrollArea className={`flex-1 pr-4 ${height}`}>
            <div className="relative space-y-0 min-h-150">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className="relative transition-all bg-amber-100 hover:bg-amber-50 p-5 rounded-xl border border-amber-100 shadow-md mb-4"
                >
                  {editingNoteId === note.id ? (
                    <Form {...editForm}>
                      <form
                        onSubmit={editForm.handleSubmit(onUpdateSubmit)}
                        className="space-y-3"
                      >
                        <NoteField control={editForm.control} />
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNoteId(null)}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" type="submit">
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                          {note.text}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3 w-3" />
                              <span>{note.authorName}</span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(note.createdAt), 'MMM d, yyyy')}
                            </span>
                            {note.editedByName && (
                              <span className="italic opacity-70">
                                (Edited)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              openUpSertEventModal({
                                event: null,
                                type: type,
                                personId: personId,
                                companyId: companyId,
                                liabilityId: liabilityId,
                                description: note.text,
                              })
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add To Timeline
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(note)}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDeleteConfirm(note)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  )
}
