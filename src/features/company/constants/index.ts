export const VALIDATION = {
  COMPANY: {
    NAME_MAX: 200,
    TRADING_NAME_MAX: 200,
    TYPE_MAX: 100,
    ABN_LENGTH: 11,
    ACN_LENGTH: 9,
    PHONE_MAX: 20,
    WEBSITE_MAX: 500,
    EMAIL_MAX: 256,
    INDUSTRY_MAX: 100,
    TRUST_NAME_MAX: 200,
    EXTERNAL_CONTACT_NAME_MAX: 200,
    EXTERNAL_CONTACT_EMAIL_MAX: 256,
    EXTERNAL_CONTACT_PHONE_MAX: 20,
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

export const COMPANY_TYPES = [
  'Sole Trader',
  'Partnership',
  'Private Company',
  'Public Company',
  'Trust',
  'Other',
]

export const INDUSTRIES = [
  'Agriculture',
  'Construction',
  'Education',
  'Finance',
  'Healthcare',
  'Hospitality',
  'Information Technology',
  'Manufacturing',
  'Mining',
  'Professional Services',
  'Real Estate',
  'Retail',
  'Transportation',
  'Other',
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

export const companyKeys = {
  all: ['companies'] as const,
  companies: () => [...companyKeys.all, 'companies'] as const,
  companiesList: (query: any) =>
    [...companyKeys.companies(), 'list', query] as const,
  companyDetail: (id: string) =>
    [...companyKeys.companies(), 'detail', id] as const,
}
