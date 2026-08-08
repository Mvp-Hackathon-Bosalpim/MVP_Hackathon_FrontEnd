import { useState } from "react";
import {
  FileText, Clock, AlertTriangle,
  LineChart, PenLine, ChevronRight,
} from "lucide-react";
import SuccessCircleIcon from "@/assets/icons/success-circle-icon.svg?react";
import StatCard from "../../components/ui/stat-card";
import QuickActionButton from "../../components/ui/quick-action-button";
import PriorityIssueBarChart from "../../components/ui/priority-issue-bar-chart";
import ExportHistoryTable from "../../components/ui/export-history-table";
import { useNavigate } from "react-router-dom";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";

const OVERVIEW_STATS = [
  { icon: FileText, label: "전체 건수", unit: "건" },
  { icon: SuccessCircleIcon, label: "승인 완료", unit: "건" },
  { icon: AlertTriangle, label: "예외/오류 탐지", unit: "건", iconColor: "text-primary-gold" },
  { icon: Clock, label: "검수 대기", unit: "건" },
];

const PRODUCTIVITY_STATS = [
  { icon: LineChart, label: "전체 건수", unit: "건" },
  { icon: SuccessCircleIcon, label: "승인 완료", unit: "건" },
  { icon: AlertTriangle, label: "예외/오류 탐지", unit: "건", iconColor: "text-primary-gold" },
  { icon: Clock, label: "검수 대기", unit: "건" },
];

const PRIORITY_ISSUES = [
  { issue_type: "missing_required", label: "누락 데이터", count: 45, color: "state-error" },
  { issue_type: "duplicate_suspected", label: "중복 의심", count: 30, color: "state-warning" },
  { issue_type: "spec_mismatch", label: "규격 불일치", count: 28, color: "state-gold" },
  { issue_type: "unit_mismatch", label: "단위 불일치", count: 20, color: "issue-unit" },
];
const TOTAL_ERROR_COUNT = PRIORITY_ISSUES.reduce((sum, issue) => sum + issue.count, 0);
const TOTAL_DATA_COUNT = 1000;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [exportRecords] = useState([]);

  const handleFileSelect = (file) => {
    navigate("/register", { state: { defaultTab: "upload", uploadFile: file } });
  };

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-6 space-y-6">
      {/* 1. 전체 현황 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OVERVIEW_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* 2. 오늘 생산성 지표 */}
      <section className="bg-surface-200 border border-surface-200 rounded-lg p-4">
        <h2 className="text-lg font-bold text-gray-700 mb-3">오늘 생산성 지표</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTIVITY_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* 3. 빠른 실행 + 우선 검수 목록 */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-5 h-full">
        <div className="bg-surface-0 border border-surface-200 rounded-lg overflow-hidden flex flex-col h-full">
          <div className="px-4 py-3">
            <h2 className="text-lg font-bold text-gray-700">빠른 실행</h2>
          </div>
          <div className="flex-1 flex flex-col gap-5 px-4 pb-4 mt-2">
            <QuickActionButton icon={UploadIcon} label="+신규 파일 업로드" onFileSelect={handleFileSelect} />
            <QuickActionButton icon={PenLine} label="+수기 등록" onClick={() => navigate("/register", { state: { defaultTab: "manual" } })} />
          </div>
        </div>

        <div className="bg-surface-0 border border-surface-200 rounded-lg overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-0 border-b border-surface-200">
            <h2 className="text-lg font-bold text-gray-700">우선 검수 필요 목록</h2>
            <button onClick={() => navigate("/inbox")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              전체보기 <ChevronRight size={16} />
            </button>
          </div>
          <PriorityIssueBarChart
            issues={PRIORITY_ISSUES}
            totalErrorCount={TOTAL_ERROR_COUNT}
            totalDataCount={TOTAL_DATA_COUNT}
          />
        </div>
      </section>
      {/* 4. 최근 데이터 내보내기 이력 */}
      <section className="bg-surface-0 border border-surface-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-surface-300 ">
          <h2 className="text-lg font-bold text-gray-700">최근 데이터 내보내기 이력</h2>
          <button
            onClick={() => navigate("/export-history")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            전체보기 <ChevronRight size={16} />
          </button>
        </div>
        <ExportHistoryTable records={exportRecords} />
      </section>
    </div>
  );
}