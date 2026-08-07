import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExportHistoryIcon from "@/assets/icons/export-history-icon.svg?react";
import ExportHistoryFilterBar from "@/components/ui/export-history-filter-bar";
import ExportChangeLogTable from "@/components/ui/export-change-log-table";
import Pagination from "@/components/ui/pagination";

// 마크업 단계: 실제 API 연동 전까지 더미 템플릿을 반복해 목데이터 생성
const CHANGE_LOG_TEMPLATES = [
  {
    changedBy: "시스템",
    item: "파일 생성",
    before: "생성 중",
    after: "JSON (1,234건)",
    reason: "예약된 일일 내보내기 작업 완료",
  },
  {
    changedBy: "시스템",
    item: "파일 생성",
    before: "생성 중",
    after: "CSV (856건)",
    reason: "월간 정산 데이터 생성 완료",
  },
  {
    changedBy: "시스템",
    item: "파일 생성",
    before: "생성 중",
    after: "실패",
    reason: "서버 처리 중 오류 발생",
  },
  {
    changedBy: "관리자",
    item: "파일 삭제",
    before: "JSON (1,234건)",
    after: "삭제",
    reason: "보관 기간 만료로 삭제 처리",
  },
  {
    changedBy: "관리자",
    item: "파일 다운로드",
    before: "-",
    after: "CSV (856건)",
    reason: "회계팀 정산 자료 요청",
  },
  {
    changedBy: "관리자",
    item: "파일 내보내기",
    before: "-",
    after: "JSON (2,048건)",
    reason: "외부 감사 대응 자료 제출",
  },
  {
    changedBy: "시스템",
    item: "파일 생성",
    before: "대기",
    after: "실패",
    reason: "네트워크 연결 오류",
  },
];

function formatDateTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:00`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

const MOCK_DATE_SPAN = 20;
const BASE_DATE = new Date(2026, 6, 22);

const CHANGE_LOGS = Array.from({ length: 62 }, (_, i) => {
  const date = new Date(BASE_DATE);
  date.setDate(BASE_DATE.getDate() + (i % MOCK_DATE_SPAN));
  date.setHours(9 + (i % 8), (i * 7) % 60, 0, 0);

  return {
    id: i + 1,
    date,
    changedAt: formatDateTime(date),
    ...CHANGE_LOG_TEMPLATES[i % CHANGE_LOG_TEMPLATES.length],
  };
});

const DEFAULT_PAGE_SIZE = 6;

export default function ExportHistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [fileName, setFileName] = useState("");
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const filteredLogs = useMemo(() => {
    const keyword = fileName.trim().toLowerCase();

    return CHANGE_LOGS.filter((log) => {
      if (selectedFormat && !log.after.includes(selectedFormat)) return false;

      if (dateRange.start && dateRange.end) {
        const logDay = startOfDay(log.date);
        if (logDay < startOfDay(dateRange.start) || logDay > startOfDay(dateRange.end)) {
          return false;
        }
      }

      if (keyword) {
        const haystack = `${log.changedBy} ${log.item} ${log.before} ${log.after} ${log.reason}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }

      return true;
    });
  }, [fileName, selectedFormat, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));

  const visibleLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

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
            <h1 className="text-2xl font-bold text-gray-700">데이터 내보내기 이력</h1>
            <p className="text-sm text-gray-500">
              최근 생성된 JSON/CSV 파일을 조회하고 필요한 파일을 다시 다운로드할 수 있습니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 rounded border border-gray-100 bg-surface-0 px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-surface-100"
        >
          <ArrowLeft size={16} />
          대시보드로 돌아가기
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

      {/* 데이터 카드 */}
      <div className="overflow-hidden rounded-lg border border-surface-200 bg-surface-0">
        <div className="px-4 py-3">
          <span className="text-sm text-gray-500">
            총 <span className="font-bold text-gray-700">{filteredLogs.length}</span>건
          </span>
        </div>

        <ExportChangeLogTable records={visibleLogs} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
