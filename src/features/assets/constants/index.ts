export const ZONING_TYPES = ["Residential", "Commercial"] as const

export const PROPERTY_TYPES = [
  "Apartment/Unit/Flat",
  "Bedsitter Bachelor",
  "Boarding House",
  "Commercial",
  "Company Title Unit",
  "Converted Commercial Property",
  "Converted Motel Units",
  "Display Home",
  "Duplex",
  "Fully-detached House",
  "Hobby Farm",
  "Industrial",
  "Kit Home",
  "Luxury House",
  "New Strata Title Unit",
  "Nursing Home",
  "Relocatable Home",
  "Resort Unit",
  "Retirement Unit",
  "Rural Lifestyle",
  "Semi-detached House",
  "Serviced Apartment",
  "Snow Lease",
  "Strata Title Unit",
  "Student Accommodation",
  "Studio Warehouse Apartment",
  "Terrace",
  "Townhouse",
  "Transportable Home",
  "Vacant Land",
  "Villa",
  "Warehouse Conversion",
] as const

export const RENTAL_INCOME_FREQUENCIES = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
] as const

export const assetKeys = {
  all: ["assets"] as const,
  lists: () => [...assetKeys.all, "list"] as const,
  list: (query: any) => [...assetKeys.lists(), query] as const,
  details: () => [...assetKeys.all, "detail"] as const,
  detail: (id: string) => [...assetKeys.details(), id] as const,
}

export const VALIDATION = {
  ASSET: {
    NAME_MAX: 200,
    PROPERTY_TYPE_MAX: 100,
    ZONING_TYPE_MAX: 100,
    RENTAL_INCOME_FREQUENCY_MAX: 50,
    RENTAL_AGENT_CONTACT_MAX: 200,
  },
}
