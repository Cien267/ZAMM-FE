import { useFieldArray, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { InputNumber } from "@/components/common/InputNumber";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, X } from "lucide-react";
import type { CreateLiabilityInput, UpdateLiabilityInput } from "../types";
import { useAllPeople, useAllCompanies } from "@/hooks/useSharedData";

interface LiabilityOwnershipFieldsProps {
  control: Control<CreateLiabilityInput | UpdateLiabilityInput>;
  setValue: any;
  type: "people" | "company";
}

export const LiabilityOwnershipFields = ({
  control,
  setValue,
  type,
}: LiabilityOwnershipFieldsProps) => {
  const isLiabilityPeople = type === "people";
  const fieldName = isLiabilityPeople
    ? "liabilityPeople"
    : "liabilityCompanies";

  const { data: peopleData } = useAllPeople();
  const { data: companiesData } = useAllCompanies();

  const options = isLiabilityPeople
    ? peopleData?.data || []
    : companiesData?.data || [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName as "liabilityPeople" | "liabilityCompanies",
  });

  const redistribute = (count: number) => {
    const share = Math.floor(100 / count);
    const remainder = 100 % count;

    for (let i = 0; i < count; i++) {
      const finalPercent = i === 0 ? share + remainder : share;
      setValue(`${fieldName}.${i}.percent` as any, finalPercent);
    }
  };

  const addApplicant = () => {
    const nextCount = fields.length + 1;

    if (isLiabilityPeople) {
      append({ personId: "", percent: 0 });
    } else {
      append({ companyId: "", percent: 0 });
    }

    redistribute(nextCount);
  };

  const removeApplicant = (index: number) => {
    if (fields.length <= 1) return;

    remove(index);
    redistribute(fields.length - 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Applicants</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addApplicant}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add {isLiabilityPeople ? "Person" : "Company"}
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No applicants added</p>
          <Button
            type="button"
            variant="link"
            onClick={addApplicant}
            className="mt-2"
          >
            Add your first applicant
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Applicant {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeApplicant(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={
                    isLiabilityPeople
                      ? `liabilityPeople.${index}.personId`
                      : `liabilityCompanies.${index}.companyId`
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isLiabilityPeople ? "Person" : "Company"}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={`Select ${
                                isLiabilityPeople ? "person" : "company"
                              }`}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {"fullName" in opt ? opt.fullName : opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`${fieldName}.${index}.percent`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percent</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <InputNumber
                            placeholder="100"
                            className="pr-8"
                            {...field}
                            allowDecimal={false}
                            allowNegative={false}
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
          ))}
        </div>
      )}
    </div>
  );
};
