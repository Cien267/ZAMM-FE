export const CLIENT_TYPES = {
  PEOPLE: "people" as const,
  COMPANY: "company" as const,
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

export const TITLE_OPTIONS = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"]

export const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"]

export const GENDER_VARIANT_MAPPING: Record<string, any> = {
  Male: "indigo",
  Female: "rose",
  Other: "violet",
  "Prefer not to say": "muted",
}

export const MARITAL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Divorced",
  "De facto",
]

export const MARITAL_STATUS_VARIANT_MAPPING: Record<string, any> = {
  Married: "success",
  Single: "info",
  "De facto": "secondary",
  Divorced: "warning",
  Widowed: "outline",
}

export const PHONE_PREFERENCE_OPTIONS = ["Work", "Mobile"]

export const COMPANY_TYPES = [
  "Sole Trader",
  "Partnership",
  "Private Company",
  "Public Company",
  "Trust",
  "Other",
]

export const INDUSTRIES = [
  "Agriculture",
  "Construction",
  "Education",
  "Finance",
  "Healthcare",
  "Hospitality",
  "Information Technology",
  "Manufacturing",
  "Mining",
  "Professional Services",
  "Real Estate",
  "Retail",
  "Transportation",
  "Other",
]

export const AUSTRALIAN_STATES = [
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "NT",
  "ACT",
]

export const STREET_TYPES = [
  "Street",
  "Road",
  "Avenue",
  "Drive",
  "Court",
  "Place",
  "Crescent",
  "Lane",
  "Way",
  "Circuit",
]

export const RELATIONSHIP_OPTIONS = [
  "Spouse",
  "Domestic Partner",
  "Child",
  "Stepchild",
  "Foster Child",
  "Legal Ward",
  "Parent",
  "Sibling",
  "Grandchild",
  "Grandparent",
  "Niece / Nephew",
  "Other",
]

export const COMPANY_ROLE_OPTIONS = [
  "Director",
  "Secretary",
  "Shareholder",
  "Manager",
  "Authorized Signatory",
  "Other",
]

export const clientKeys = {
  all: ["clients"] as const,
  people: () => [...clientKeys.all, "people"] as const,
  peopleList: (query: any) => [...clientKeys.people(), "list", query] as const,
  personDetail: (id: string) => [...clientKeys.people(), "detail", id] as const,
  companies: () => [...clientKeys.all, "companies"] as const,
  companiesList: (query: any) =>
    [...clientKeys.companies(), "list", query] as const,
  companyDetail: (id: string) =>
    [...clientKeys.companies(), "detail", id] as const,
}
