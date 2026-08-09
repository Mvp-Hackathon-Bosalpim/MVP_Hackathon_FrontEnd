import { useSearchParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import ExportDateRangePicker from "@/components/ui/export-date-range-picker";
import FilterDropdown from "@/components/ui/filter-dropdown";
import useNormalizedItemNames from "@/hooks/queries/inbox/use-normalized-item-names";
import useSupplierNames from "@/hooks/queries/inbox/use-supplier-names";
import { formatDate, parseDateParam } from "@/lib/utils";

export default function InboxSearchFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const itemName = searchParams.get("itemName") ?? "";
  const supplierName = searchParams.get("supplierName") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  const { data: itemNames, isPending: isItemNamesPending } =
    useNormalizedItemNames();
  const { data: supplierNames, isPending: isSupplierNamesPending } =
    useSupplierNames();

  const dateRange = {
    start: parseDateParam(startDate),
    end: parseDateParam(endDate),
  };

  const updateParams = (updates) => {
    setSearchParams((prev) => {
      prev.set("page", 0);
      prev.set("size", 20);
      Object.entries(updates).forEach(([key, val]) => {
        if (val) prev.set(key, val);
        else prev.delete(key);
      });
      return prev;
    });
  };

  const handleDateRangeChange = (range) => {
    updateParams({
      startDate: formatDate(range.start),
      endDate: formatDate(range.end),
    });
  };

  const handleReset = () => {
    setSearchParams((prev) => {
      ["itemName", "supplierName", "startDate", "endDate"].forEach((key) =>
        prev.delete(key),
      );
      prev.set("page", 0);
      prev.set("size", 20);
      return prev;
    });
  };

  return (
    <div className="mb-4 flex items-end justify-between">
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-500">품목</span>
          <FilterDropdown
            placeholder="품목 선택"
            searchPlaceholder="품목명 검색"
            options={itemNames ?? []}
            isLoading={isItemNamesPending}
            value={itemName}
            onChange={(val) => updateParams({ itemName: val })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-500">공급사</span>
          <FilterDropdown
            placeholder="공급사 선택"
            searchPlaceholder="공급사명 검색"
            options={supplierNames ?? []}
            isLoading={isSupplierNamesPending}
            value={supplierName}
            onChange={(val) => updateParams({ supplierName: val })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-500">일시</span>
          <ExportDateRangePicker
            range={dateRange}
            onRangeChange={handleDateRangeChange}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="hover:bg-surface-100 flex items-center gap-1.5 rounded border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 transition-colors"
      >
        <RotateCcw size={14} />
        필터 초기화
      </button>
    </div>
  );
}
