import { useSearchParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import ExportDateRangePicker from "@/components/ui/export-date-range-picker";
import FilterDropdown from "@/components/ui/filter-dropdown";
import useNormalizedItemNames from "@/hooks/queries/inbox/use-normalized-item-names";
import useSupplierNames from "@/hooks/queries/inbox/use-supplier-names";
import useDocumentStatusCounts from "@/hooks/queries/inbox/use-document-status-counts";
import { formatDate, parseDateParam } from "@/lib/utils";

const STATUS_FILTER_CONFIG = [
  { key: "NEW", labelKey: "inbox.status.new", countField: "new_count" },
  {
    key: "NEEDS_REVIEW",
    labelKey: "inbox.status.needs_check",
    countField: "needs_review_count",
  },
  {
    key: "ON_HOLD",
    labelKey: "inbox.status.on_hold",
    countField: "on_hold_count",
  },
  {
    key: "APPROVED",
    labelKey: "inbox.status.approved",
    countField: "approved_count",
  },
  {
    key: "REJECTED",
    labelKey: "inbox.status.rejected",
    countField: "rejected_count",
  },
];

export default function InboxSearchFilter({ onFilterChange }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: statusCounts } = useDocumentStatusCounts();

  const itemName = searchParams.get("itemName") ?? "";
  const supplierName = searchParams.get("supplierName") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const reviewStatus = searchParams.get("reviewStatus") ?? "";

  const { data: itemNames, isPending: isItemNamesPending } =
    useNormalizedItemNames();
  const { data: supplierNames, isPending: isSupplierNamesPending } =
    useSupplierNames();

  const dateRange = {
    start: parseDateParam(startDate),
    end: parseDateParam(endDate),
  };

  const updateParams = (updates) => {
    onFilterChange?.();
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

  const handleStatusChange = (key) => {
    updateParams({ reviewStatus: reviewStatus === key ? "" : key });
  };

  const handleDateRangeChange = (range) => {
    updateParams({
      startDate: formatDate(range.start),
      endDate: formatDate(range.end),
    });
  };

  const handleReset = () => {
    onFilterChange?.();
    setSearchParams((prev) => {
      [
        "itemName",
        "supplierName",
        "startDate",
        "endDate",
        "reviewStatus",
      ].forEach((key) => prev.delete(key));
      prev.set("page", 0);
      prev.set("size", 20);
      return prev;
    });
  };

  return (
    <div className="mb-4 space-y-3">
      {/* 상태 필터 */}
      <div className="flex items-center gap-4">
        {STATUS_FILTER_CONFIG.map(({ key, labelKey, countField }) => {
          const isSelected = reviewStatus === key;
          const count = statusCounts?.[countField] ?? 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleStatusChange(key)}
              className={cn(
                "flex items-center gap-2 rounded-full border border-gray-100 px-4 py-1.5 text-sm transition-colors",
                isSelected
                  ? "border-primary-navy bg-primary-navy text-white"
                  : "bg-surface-200 text-gray-700",
              )}
            >
              <span>{t(labelKey)}</span>
              <span className="text-primary-navy flex aspect-square size-6 items-center justify-center rounded-full bg-white font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 필드 필터 */}
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-500">
              {t("inbox.filter.item")}
            </span>
            <FilterDropdown
              placeholder={t("inbox.filter.item_placeholder")}
              searchPlaceholder={t("inbox.filter.item_search")}
              options={itemNames ?? []}
              isLoading={isItemNamesPending}
              value={itemName}
              onChange={(val) => updateParams({ itemName: val })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-500">
              {t("inbox.filter.supplier")}
            </span>
            <FilterDropdown
              placeholder={t("inbox.filter.supplier_placeholder")}
              searchPlaceholder={t("inbox.filter.supplier_search")}
              options={supplierNames ?? []}
              isLoading={isSupplierNamesPending}
              value={supplierName}
              onChange={(val) => updateParams({ supplierName: val })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-500">
              {t("common.date_time")}
            </span>
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
          {t("common.reset_filter")}
        </button>
      </div>
    </div>
  );
}
