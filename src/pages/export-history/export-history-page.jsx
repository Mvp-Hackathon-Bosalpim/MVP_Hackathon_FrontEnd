import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExportHistoryIcon from "@/assets/icons/export-history-icon.svg?react";
import ExportHistoryFilterBar from "@/components/ui/export-history-filter-bar";
import ExportFileTable from "@/components/ui/export-file-table";
import Pagination from "@/components/ui/export-pagination";
import useExportHistory from "@/hooks/queries/export/use-export-history";

const DEFAULT_PAGE_SIZE = 20;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export default function ExportHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [fileName, setFileName] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const { data, isPending, isError, refetch } = useExportHistory({
    page: page - 1,
    size: pageSize,
  });

  const totalElements = data?.total_elements ?? 0;
  const totalPages = Math.max(1, data?.total_pages ?? 1);

  // 백엔드가 필터 파라미터를 지원하지 않아 현재 페이지에 로드된 content 안에서만 필터링
  const filteredContent = useMemo(() => {
    const keyword = fileName.trim().toLowerCase();
    const content = data?.content ?? [];

    return content.filter((record) => {
      if (selectedFormat && record.format !== selectedFormat) return false;

      if (dateRange.start && dateRange.end && record.exported_at) {
        const recordDay = startOfDay(new Date(record.exported_at));
        if (
          recordDay < startOfDay(dateRange.start) ||
          recordDay > startOfDay(dateRange.end)
        ) {
          return false;
        }
      }

      if (keyword && !record.file_name?.toLowerCase().includes(keyword))
        return false;

      return true;
    });
  }, [data, fileName, selectedFormat, dateRange]);

  const handleFileNameChange = (value) => {
    setFileName(value);
    setPage(1);
  };

  const handleFormatChange = (value) => {
    setSelectedFormat(value);
    setPage(1);
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    setPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPage(1);
  };

  const handleFilterReset = () => {
    setFileName("");
    setSelectedFormat(null);
    setDateRange({ start: null, end: null });
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1300px] space-y-5 px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ExportHistoryIcon className="h-10 w-10 shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-gray-700">
              {t("history.title")}
            </h1>
            <p className="text-sm text-gray-500">{t("history.desc")}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-surface-0 hover:bg-surface-100 flex items-center gap-1.5 rounded border border-gray-100 px-3 py-2 text-sm text-gray-500 transition-colors"
        >
          <ArrowLeft size={16} />
          {t("history.back_to_dashboard")}
        </button>
      </div>

      <ExportHistoryFilterBar
        fileName={fileName}
        onFileNameChange={handleFileNameChange}
        selectedFormat={selectedFormat}
        onFormatChange={handleFormatChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onReset={handleFilterReset}
      />

      <div className="border-surface-200 bg-surface-0 overflow-hidden rounded-lg border">
        <div className="px-4 py-3">
          <span className="text-sm text-gray-500">
            {t("history.total_count", { count: totalElements })}
          </span>
        </div>

        <ExportFileTable
          records={filteredContent}
          isPending={isPending}
          isError={isError}
          onRetry={refetch}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
