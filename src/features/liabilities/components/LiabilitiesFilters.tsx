import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { FINANCE_PURPOSES } from "../constants";
import type { LiabilityQuery } from "../types";
import { DatePicker } from "@/components/common/DatePicker";

interface LiabilitiesFiltersProps {
  onFilterChange: (filters: Partial<LiabilityQuery>) => void;
  onReset: () => void;
}

export const LiabilitiesFilters = ({
  onFilterChange,
  onReset,
}: LiabilitiesFiltersProps) => {
  const [filters, setFilters] = useState<Partial<LiabilityQuery>>({
    name: "",
    loanId: "",
    financePurpose: "",
    startDateFrom: undefined,
    startDateTo: undefined,
  });

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    onFilterChange(debouncedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters]);

  const handleChange = (field: keyof LiabilityQuery, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    const emptyFilters = {
      name: "",
      loanId: "",
      financePurpose: "",
      startDateFrom: undefined,
      startDateTo: undefined,
    };
    setFilters(emptyFilters);
    onReset();
  };

  const hasActiveFilters =
    filters.name !== "" ||
    filters.loanId !== "" ||
    filters.financePurpose !== "" ||
    filters.startDateFrom !== undefined ||
    filters.startDateTo !== undefined;

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Liability Name</Label>
          <Input
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Finance Purpose</Label>
          <Select
            value={filters.financePurpose || ""}
            onValueChange={(value) =>
              handleChange("financePurpose", value || "")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All purposes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All purposes</SelectItem>
              {FINANCE_PURPOSES.map((purpose) => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>From Commencement Date</Label>
          <DatePicker
            value={filters.startDateFrom}
            onChange={(value) => handleChange("startDateFrom", value)}
            placeholder="Pick a date"
            disableFutureDates
          />
        </div>

        <div className="space-y-2">
          <Label>To Commencement Date</Label>
          <DatePicker
            value={filters.startDateTo}
            onChange={(value) => handleChange("startDateTo", value)}
            placeholder="Pick a date"
            disableFutureDates
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
