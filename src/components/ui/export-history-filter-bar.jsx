import { useState } from "react";
import { Search, ChevronDown, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import ExportDateRangePicker from "./export-date-range-picker";

export default function ExportHistoryFilterBar({
  fileName,
  onFileNameChange,
  selectedFormat,
  onFormatChange,
  dateRange,
  onDateRangeChange,
  onReset,
}) {
  const { t } = useTranslation();
  const [isFormatOpen, setIsFormatOpen] = useState(false);

  const FORMAT_OPTIONS = [
    { label: t("common.all"), value: null },
    { label: "JSON", value: "JSON" },
    { label: "CSV", value: "CSV" },
  ];

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* 파일명 검색 */}
      <div className="w-64">
        <label className="mb-1.5 block text-xs font-medium text-gray-500">{t("common.search")}</label>
        <div className="relative">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder={t("history.search_file_name")}
            className="w-full rounded border border-gray-100 py-2 pr-3 pl-9 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-primary-navy"
          />
        </div>
      </div>

      {/* 형식 */}
      <div className="relative">
        <label className="mb-1.5 block text-xs font-medium text-gray-500">{t("common.format")}</label>
        <button
          type="button"
          onClick={() => setIsFormatOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded border border-gray-100 px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-surface-100"
        >
          {selectedFormat ?? t("export.format_all")}
          <ChevronDown
            size={14}
            className={`transition-transform ${isFormatOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isFormatOpen && (
          <div className="absolute z-10 mt-2 w-28 overflow-hidden rounded-lg border border-surface-200 bg-surface-0 shadow-lg">
            {FORMAT_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  onFormatChange(option.value);
                  setIsFormatOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-surface-100 ${
                  (!selectedFormat && option.value === null) || selectedFormat === option.value
                    ? "font-semibold text-primary-navy"
                    : "text-gray-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 기간 */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">{t("common.date_time")}</label>
        <ExportDateRangePicker range={dateRange} onRangeChange={onDateRangeChange} />
      </div>

      {/* 필터 초기화 */}
      <button
        type="button"
        onClick={() => {
          setIsFormatOpen(false);
          onReset();
        }}
        className="ml-auto flex items-center gap-1.5 rounded border border-gray-100 bg-surface-0 px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-surface-100"
      >
        <RotateCcw size={14} />
        {t("common.reset_filter")}
      </button>
    </div>
  );
}
