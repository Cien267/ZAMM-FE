import { Pencil, Clock } from 'lucide-react'
import { useState } from 'react'
// import { EventTimeline } from '@/features/events/components/EventTimeline'
import { NoteList } from '@/features/notes/components/NoteList'
import type { Company } from '../../types'

const EVENT_TAB = 'event_tab'
const NOTE_TAB = 'note_tab'

interface RightSectionProps {
  company: Company
}

export const CompanyRightSection = ({ company }: RightSectionProps) => {
  const [tab, setTab] = useState(NOTE_TAB)

  return (
    <div className="w-1/4 ml-10">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <h3
          className={`font-semibold flex items-center gap-2 cursor-pointer w-1/2 border-r  justify-center ${tab === EVENT_TAB ? 'text-sky-500' : 'hover:text-sky-500'}`}
          onClick={() => setTab(EVENT_TAB)}
        >
          <Clock className="w-5 h-5" /> Event Timeline
        </h3>
        <h3
          className={`font-semibold flex items-center gap-2 cursor-pointer w-1/2 justify-center ${tab === NOTE_TAB ? 'text-sky-500' : 'hover:text-sky-500'}`}
          onClick={() => setTab(NOTE_TAB)}
        >
          <Pencil className="w-5 h-5" /> Note
        </h3>
      </div>
      {/* {tab === EVENT_TAB && (
        <EventTimeline
          type="company"
          exportTitle={company.name}
          personId={null}
          companyId={company.id}
          liabilityId={null}
        />
      )} */}
      {tab === NOTE_TAB && (
        <NoteList
          type="company"
          personId={null}
          companyId={company.id}
          liabilityId={null}
        />
      )}
    </div>
  )
}
