import type { Loan } from '@/features/loans/types'
import { INTEREST_RATE_TYPES } from '@/features/loans/constants'

type RateType = 'OOPI' | 'OOIO' | 'IVPI' | 'IVIO'

type EffectiveRateResult = {
  rate: number
  baseRate: number
  discountPercent: number
  rateType: RateType
  rateId?: string
  message?: string
}

type CalculateEffectiveRateParams = {
  loan: Loan | undefined
  financePurpose: string
  commencementDate: Date | null
  interestOnlyTerm?: number | null
  discountPercent?: number | null
  introRateYears?: number | null
  introRatePercent?: number | null
  today?: Date
}

export function calculateEffectiveInterestRate(
  params: CalculateEffectiveRateParams
): EffectiveRateResult | null {
  const {
    loan,
    financePurpose,
    commencementDate,
    interestOnlyTerm,
    discountPercent = 0,
    introRateYears,
    introRatePercent,
  } = params
  if (loan == undefined) return null
  if (!commencementDate) return null
  const today = new Date()
  const purposePrefix = financePurpose === 'Investment' ? 'IV' : 'OO'
  let repaymentSuffix: 'PI' | 'IO' = 'PI'

  if (interestOnlyTerm && interestOnlyTerm > 0) {
    const ioEndDate = new Date(commencementDate)
    ioEndDate.setFullYear(ioEndDate.getFullYear() + Number(interestOnlyTerm))
    if (today < ioEndDate) {
      repaymentSuffix = 'IO'
    }
  }

  const rateType = `${purposePrefix}${repaymentSuffix}` as RateType

  const matchedRate = (loan.interestRates || []).find(
    (r) => r.rateType === rateType
  )

  if (!matchedRate)
    return {
      rate: 0,
      baseRate: 0,
      discountPercent: discountPercent || 0,
      rateType,
      rateId: undefined,
      message: `This loan doesn't support ${INTEREST_RATE_TYPES.find((type) => type.value === rateType)?.label || '-'} loans`,
    }

  const baseRate = matchedRate.rate
  let effectiveRate = baseRate - (discountPercent || 0)

  if (
    introRateYears &&
    introRateYears > 0 &&
    introRatePercent &&
    introRatePercent > 0
  ) {
    effectiveRate *= (100 - introRatePercent) / 100
  }

  return {
    rate: Number(effectiveRate.toFixed(2)),
    baseRate,
    discountPercent: discountPercent || 0,
    rateType,
    rateId: matchedRate.id,
  }
}
