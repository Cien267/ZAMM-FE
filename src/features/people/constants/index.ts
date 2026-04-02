export const CLIENT_TYPES = {
  PEOPLE: 'people' as const,
  COMPANY: 'companies' as const,
}

export const VALIDATION = {
  PERSON: {
    FIRST_NAME_MAX: 100,
    MIDDLE_NAME_MAX: 100,
    LAST_NAME_MAX: 100,
    PREFERRED_NAME_MAX: 100,
    GENDER_MAX: 50,
    MARITAL_STATUS_MAX: 50,
    EMAIL_MAX: 256,
    PHONE_MAX: 20,
    TRUST_NAME_MAX: 200,
  },
  DEPENDENT: {
    FULL_NAME_MAX: 100,
    YEAR_OF_BIRTH_MIN: 1900,
    YEAR_OF_BIRTH_MAX: 2100,
    GENDER_MAX: 50,
    RELATIONSHIP_MAX: 50,
    NOTES_MAX: 200,
  },
  ADDRESS: {
    UNIT_NUMBER_MAX: 50,
    STREET_NUMBER_MAX: 50,
    STREET_NAME_MAX: 100,
    STREET_TYPE_MAX: 50,
    SUBURB_MAX: 100,
    STATE_MAX: 50,
    POSTCODE_MAX: 10,
    COUNTRY_MAX: 100,
  },
}

export const TITLE_OPTIONS = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof']

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say']

export const GENDER_VARIANT_MAPPING: Record<string, any> = {
  Male: 'indigo',
  Female: 'rose',
  Other: 'violet',
  'Prefer not to say': 'muted',
}

export const MARITAL_STATUS_OPTIONS = [
  'Single',
  'Married',
  'Divorced',
  'De facto',
]

export const MARITAL_STATUS_VARIANT_MAPPING: Record<string, any> = {
  Married: 'success',
  Single: 'info',
  'De facto': 'secondary',
  Divorced: 'warning',
  Widowed: 'outline',
}

export const PHONE_PREFERENCE_WORK = 'Work'
export const PHONE_PREFERENCE_MOBILE = 'Mobile'
export const PHONE_PREFERENCE_OPTIONS = [
  PHONE_PREFERENCE_WORK,
  PHONE_PREFERENCE_MOBILE,
]

export const AUSTRALIAN_STATES = [
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'WA',
  'TAS',
  'NT',
  'ACT',
]

export const STREET_TYPES = [
  'Street',
  'Road',
  'Avenue',
  'Drive',
  'Court',
  'Place',
  'Crescent',
  'Lane',
  'Way',
  'Circuit',
]

export const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Domestic Partner',
  'Child',
  'Stepchild',
  'Foster Child',
  'Legal Ward',
  'Parent',
  'Sibling',
  'Grandchild',
  'Grandparent',
  'Niece / Nephew',
  'Other',
]

export const COMPANY_ROLE_OPTIONS = [
  'Director',
  'Secretary',
  'Shareholder',
  'Manager',
  'Authorized Signatory',
  'Other',
]

export const peopleKeys = {
  all: ['people'] as const,
  people: () => [...peopleKeys.all, 'people'] as const,
  peopleList: (query: any) => [...peopleKeys.people(), 'list', query] as const,
  personDetail: (id: string) => [...peopleKeys.people(), 'detail', id] as const,
}
