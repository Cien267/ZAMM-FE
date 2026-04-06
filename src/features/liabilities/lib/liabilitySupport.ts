import type { Loan } from '@/features/loans/types'
import type { FixedRatePeriodInput } from '@/features/liabilities/types'
import { INTEREST_RATE_TYPES } from '@/features/loans/constants'

type RateType = 'OOPI' | 'OOIO' | 'IVPI' | 'IVIO' | 'SETTLEMENT' | 'FIXED_RATE'

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
  settlementRate?: number | null
  fixedRatePeriods?: FixedRatePeriodInput[] | null
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
    settlementRate,
    fixedRatePeriods,
  } = params
  if (loan == undefined) return null
  if (!commencementDate) return null

  // settlement rate takes precedence
  if (settlementRate != null && Number(settlementRate)) {
    return {
      rate: Number(settlementRate),
      baseRate: Number(settlementRate),
      discountPercent: 0,
      rateType: 'SETTLEMENT',
      rateId: undefined,
    }
  }

  // check for fixed rate periods
  if (fixedRatePeriods && fixedRatePeriods.length > 0) {
    const comparedDate = new Date(commencementDate)
    for (const period of fixedRatePeriods.reverse()) {
      const periodStartDate = new Date(period.startDate)
      const periodEndDate = new Date(periodStartDate)
      periodEndDate.setFullYear(
        periodEndDate.getFullYear() + Number(period.term)
      )
      if (comparedDate >= periodStartDate && comparedDate < periodEndDate) {
        const customRate = period.customRate
        if (customRate != null && Number(customRate)) {
          return {
            rate: Number(customRate),
            baseRate: Number(customRate),
            discountPercent: 0,
            rateType: 'FIXED_RATE',
            rateId: undefined,
          }
        }
      }
    }
  }

  // determine rate type based on purpose and repayment type
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
