import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLiabilities } from "../hooks/useLiabilities";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FINANCE_PURPOSES, REPAYMENT_FREQUENCIES } from "../constants";
import {
  CreateLiabilitySchema,
  UpdateLiabilitySchema,
  type CreateLiabilityInput,
  type Liability,
  type UpdateLiabilityInput,
} from "../types";
import { Modal } from "@/components/common/modal";
import { DatePicker } from "@/components/common/DatePicker";
import { InputNumber } from "@/components/common/InputNumber";
import type { Person, Company } from "@/features/clients/types";
import { LiabilityOwnershipFields } from "./LiabilityOwnershipFields";
import { LinkedAssetsFields } from "./LinkedAssetsFields";
import { FixedRatePeriodsFields } from "./FixedRatePeriodsFields";
import { useAllLenders, useAllLoans } from "@/hooks/useSharedData";
import type { Asset } from "@/features/assets/types";

interface LiabilityFormDialogProps {
  liability?: Liability | null;
  initialPerson: Person | null;
  initialCompany: Company | null;
  initialAsset: Asset | null;
  onClose: () => void;
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

export const LiabilityModalContent = ({
  liability,
  initialPerson,
  initialCompany,
  initialAsset,
  onClose,
  onSubmittingChange,
}: LiabilityFormDialogProps) => {
  const isEditing = !!liability;
  const {
    createLiabilityAsync,
    updateLiabilityAsync,
    isCreatingLiability,
    isUpdatingLiability,
  } = useLiabilities();

  const { data: lenderData, isLoading: isLoadingLenders } = useAllLenders();
  const { data: loanData, isLoading: isLoadingLoans } = useAllLoans();
  const lenders = useMemo(() => lenderData?.data || [], [lenderData?.data]);
  const loans = useMemo(() => loanData?.data || [], [loanData?.data]);

  const initialLenderId = useMemo(() => {
    if (liability?.loanId && loans.length > 0) {
      const loan = loans.find((loan) => loan.id === liability.loanId);
      if (loan?.lenderId) return loan.lenderId;
    }
    return lenders[0]?.id || "";
  }, [liability?.loanId, loans, lenders]);

  const [selectedLenderId, setSelectedLenderId] = useState<string>("");

  useEffect(() => {
    if (initialLenderId && !selectedLenderId) {
      setSelectedLenderId(initialLenderId);
    }
  }, [initialLenderId, selectedLenderId]);

  const loansBySelectedLender = useMemo(() => {
    if (!selectedLenderId) return [];
    return loans.filter((loan) => loan.lenderId === selectedLenderId);
  }, [loans, selectedLenderId]);

  const initialLoanId = useMemo(() => {
    if (liability?.loanId) return liability.loanId;
    return loansBySelectedLender[0]?.id || "";
  }, [liability?.loanId, loansBySelectedLender]);

  const form = useForm<CreateLiabilityInput | UpdateLiabilityInput>({
    resolver: zodResolver(
      isEditing ? UpdateLiabilitySchema : CreateLiabilitySchema,
    ),
    defaultValues: {
      name: liability?.name || "",
      startDate: liability?.startDate
        ? new Date(liability.startDate)
        : undefined,
      financePurpose: liability?.financePurpose || FINANCE_PURPOSES[0],
      loanId: liability?.loanId || initialLoanId,
      loanTerm: liability?.loanTerm ?? null,
      interestOnlyTerm: liability?.interestOnlyTerm ?? null,
      amount: liability?.amount ?? null,
      initialBalance: liability?.initialBalance ?? null,
      repaymentAmount: liability?.repaymentAmount ?? null,
      repaymentFrequency:
        liability?.repaymentFrequency || REPAYMENT_FREQUENCIES[2],
      bankAccountName: liability?.bankAccountName || "",
      bankAccountBsb: liability?.bankAccountBsb || "",
      bankAccountNumber: liability?.bankAccountNumber || "",
      offsetAccountBsb: liability?.offsetAccountBsb || "",
      offsetAccountNumber: liability?.offsetAccountNumber || "",
      discountPercent: liability?.discountPercent ?? null,
      settlementRate: liability?.settlementRate ?? null,
      introRateYears: liability?.introRateYears ?? null,
      introRatePercent: liability?.introRatePercent ?? null,
      liabilityPeople:
        liability?.liabilityPeople ||
        (initialPerson
          ? [
              {
                personId: initialPerson.id,
                percent: 100,
              },
            ]
          : []),
      liabilityCompanies:
        liability?.liabilityCompanies ||
        (initialCompany
          ? [
              {
                companyId: initialCompany.id,
                percent: 100,
              },
            ]
          : []),
      liabilityAssets:
        liability?.liabilityAssets ||
        (initialAsset
          ? [
              {
                assetId: initialAsset.id,
              },
            ]
          : []),
      fixedRatePeriods: liability?.fixedRatePeriods || [],
      ...(isEditing && liability ? { id: liability.id } : {}),
    },
  });

  useEffect(() => {
    if (initialLoanId && !form.getValues("loanId")) {
      form.setValue("loanId", initialLoanId);
    }
  }, [initialLoanId, form]);

  const handleLenderChange = (lenderId: string) => {
    setSelectedLenderId(lenderId);
    const firstLoan = loans.find((loan) => loan.lenderId === lenderId);
    if (firstLoan) {
      form.setValue("loanId", firstLoan.id);
    } else {
      form.setValue("loanId", "");
    }
  };

  const discountPercent = form.watch("discountPercent");
  const settlementRate = form.watch("settlementRate");

  const effectiveRate =
    settlementRate && discountPercent
      ? Number(settlementRate) - Number(discountPercent)
      : settlementRate || 0;

  const onSubmit = async (
    data: CreateLiabilityInput | UpdateLiabilityInput,
  ) => {
    try {
      if (isEditing && liability) {
        await updateLiabilityAsync({ ...data, id: liability.id });
      } else {
        await createLiabilityAsync(data);
      }
      onClose();
      form.reset();
    } catch (error) {
      console.error("Liability submission error:", error);
    }
  };

  const isSubmitting = isCreatingLiability || isUpdatingLiability;

  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <Form {...form}>
      <form
        id="liability-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log("Validation Errors:", errors),
        )}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Liability name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Commencement Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="financePurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finance Purpose</FormLabel>
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    defaultValue="Residential"
                    className="flex justify-start items-center gap-2"
                  >
                    {FINANCE_PURPOSES.map((purpose) => (
                      <RadioGroupItem
                        key={purpose}
                        value={purpose}
                        id={purpose}
                      >
                        <Label htmlFor={purpose} className="cursor-pointer">
                          {purpose}
                        </Label>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>
                Lender <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                onValueChange={handleLenderChange}
                value={selectedLenderId}
                disabled={isLoadingLenders}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingLenders
                          ? "Loading lenders..."
                          : "Select lender"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lenders.map((lender) => (
                    <SelectItem key={lender.id} value={lender.id}>
                      {lender.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>

            <FormField
              control={form.control}
              name="loanId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Loan Product
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    disabled={
                      isLoadingLoans ||
                      !selectedLenderId ||
                      loansBySelectedLender.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingLoans
                              ? "Loading loans..."
                              : !selectedLenderId
                                ? "Select a lender first"
                                : loansBySelectedLender.length === 0
                                  ? "No loans available"
                                  : "Select loan product"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loansBySelectedLender.map((loan) => (
                        <SelectItem key={loan.id} value={loan.id}>
                          {loan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Term (Years)</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Years"
                      {...field}
                      value={field.value?.toString() || ""}
                      onChange={(val) =>
                        field.onChange(val ? parseInt(val) : null)
                      }
                      allowDecimal={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestOnlyTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest-Only Term (Years)</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Years"
                      {...field}
                      value={field.value?.toString() || ""}
                      onChange={(val) =>
                        field.onChange(val ? parseInt(val) : null)
                      }
                      allowDecimal={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="discountPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate Discount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <InputNumber
                        placeholder="0.00"
                        className="pr-8"
                        {...field}
                        allowDecimal={true}
                        maxDecimals={2}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Effective Interest Rate</FormLabel>
              <div className="h-10 px-3 py-2 border rounded-md bg-muted text-muted-foreground flex items-center">
                {Number(effectiveRate).toFixed(2)}%
              </div>
            </FormItem>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="settlementRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Settlement Rate</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <InputNumber
                        placeholder="0.00"
                        className="pr-8"
                        {...field}
                        allowDecimal={true}
                        maxDecimals={2}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="introRateYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intro Rate</FormLabel>
                    <FormControl>
                      <InputNumber
                        placeholder="Years"
                        {...field}
                        value={field.value?.toString() || ""}
                        onChange={(val) =>
                          field.onChange(val ? parseInt(val) : null)
                        }
                        allowDecimal={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="introRatePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intro Rate Discount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <InputNumber
                          placeholder="0.00"
                          className="pr-8"
                          {...field}
                          allowDecimal={true}
                          maxDecimals={2}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="initialBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance (Last Known)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <InputNumber
                        placeholder="0.00"
                        {...field}
                        allowDecimal={true}
                        maxDecimals={2}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Loan Limit</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <InputNumber
                        placeholder="0.00"
                        {...field}
                        allowDecimal={true}
                        maxDecimals={2}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="repaymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repayment Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <InputNumber
                        placeholder="0.00"
                        {...field}
                        allowDecimal={true}
                        maxDecimals={2}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repaymentFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repayment Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REPAYMENT_FREQUENCIES.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="bankAccountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Account name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bankAccountBsb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BSB</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="000-000" maxLength={7} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Account number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="offsetAccountBsb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offset BSB</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="000-000" maxLength={7} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offsetAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offset Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Account number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FixedRatePeriodsFields control={form.control} />
        <LinkedAssetsFields control={form.control} />
        <LiabilityOwnershipFields
          control={form.control}
          type={initialPerson ? "people" : "company"}
          setValue={form.setValue}
        />
      </form>
    </Form>
  );
};

export const openUpSertLiabilityModal = ({
  liability,
  initialPerson,
  initialCompany,
  initialAsset,
}: {
  liability: Liability | null;
  initialPerson: Person | null;
  initialCompany: Company | null;
  initialAsset: Asset | null;
}) => {
  const isEditing = !!liability;
  let isSubmitting = false;

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? "Edit Liability" : "Add a new liability",
      description: isEditing
        ? "Update liability information"
        : "Enter liability details",
      content: (
        <LiabilityModalContent
          liability={liability}
          initialPerson={initialPerson}
          initialCompany={initialCompany}
          initialAsset={initialAsset}
          onClose={() => Modal.close()}
          onSubmittingChange={(submitting) => {
            isSubmitting = submitting;
            updateFooter();
          }}
        />
      ),
      footer: (
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => Modal.close()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="liability-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      ),
      className: "max-w-4xl!",
    });
  };

  updateFooter();
};
