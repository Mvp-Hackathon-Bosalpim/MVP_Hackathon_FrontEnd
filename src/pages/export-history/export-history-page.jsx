import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExportHistoryIcon from "@/assets/icons/export-history-icon.svg?react";
import ExportHistoryFilterBar from "@/components/ui/export-history-filter-bar";
import ExportFileTable from "@/components/ui/export-file-table";
import Pagination from "@/components/ui/export-pagination";

const EXPORT_FILE_TEMPLATES = [
  { format: "JSON", count: "1,234", requestedBy: "관리자", status: "완료" },
  { format: "CSV", count: "856", requestedBy: "관리자", status: "완료" },
  { format: "JSON", count: "2,048", requestedBy: "시스템", status: "완료" },
  { format: "CSV", count: "-", requestedBy: "시스템", status: "실패" },
  { format: "JSON", count: "512", requestedBy: "관리자", status: "완료" },
  { format: "CSV", count: "-", requestedBy: "시스템", status: "실패" },
];

function formatDateStamp(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function formatDateTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:00`;
}

function startOfDay(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

const MOCK_DATE_SPAN = 20;
const BASE_DATE = new Date(2026, 6, 22);

const EXPORT_FILES = Array.from({ length: 62 }, (_, i) => {
  const date = new Date(BASE_DATE);
  date.setDate(BASE_DATE.getDate() + (i % MOCK_DATE_SPAN));
  date.setHours(9 + (i % 8), (i * 7) % 60, 0, 0);

  const template = EXPORT_FILE_TEMPLATES[i % EXPORT_FILE_TEMPLATES.length];
  const ext = template.format.toLowerCase();

  return {
    id: i + 1,
    date,
    exportedAt: formatDateTime(date),
    fileName: `export_${formatDateStamp(date)}_${i + 1}.${ext}`,
    ...template,
  };
});

const DEFAULT_PAGE_SIZE = 20;

export default function ExportHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [fileName, setFileName] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const filteredFiles = useMemo(() => {
    const keyword = fileName.trim().toLowerCase();

    return EXPORT_FILES.filter((file) => {
      if (selectedFormat && file.format !== selectedFormat) return false;

      if (dateRange.start && dateRange.end) {
        const fileDay = startOfDay(file.date);
        if (
          fileDay < startOfDay(dateRange.start) ||
          fileDay > startOfDay(dateRange.end)
        ) {
          return false;
        }
      }

      if (keyword && !file.fileName.toLowerCase().includes(keyword))
        return false;

      return true;
    });
  }, [fileName, selectedFormat, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / pageSize));

  const visibleFiles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredFiles.slice(start, start + pageSize);
  }, [filteredFiles, page, pageSize]);

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
            {t("history.total_count", { count: filteredFiles.length })}
          </span>
        </div>

        <ExportFileTable records={visibleFiles} />

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
