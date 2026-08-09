import { useState } from "react";
import {
  FileText,
  Clock,
  AlertTriangle,
  LineChart,
  PenLine,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SuccessCircleIcon from "@/assets/icons/success-circle-icon.svg?react";
import StatCard from "../../components/ui/stat-card";
import QuickActionButton from "../../components/ui/quick-action-button";
import PriorityIssueBarChart from "../../components/ui/priority-issue-bar-chart";
import ExportHistoryTable from "../../components/ui/export-history-table";
import { useNavigate } from "react-router-dom";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";

const TOTAL_DATA_COUNT = 1000;

export default function DashboardPage() {
  const { t } = useTranslation();

  const PRIORITY_ISSUES = [
    {
      issue_type: "missing_required",
      label: t("dashboard.missing_data_label"),
      count: 45,
      color: "state-error",
    },
    {
      issue_type: "duplicate_suspected",
      label: t("dashboard.duplicate_data_label"),
      count: 30,
      color: "state-warning",
    },
    {
      issue_type: "spec_mismatch",
      label: t("dashboard.mismatched_data_label"),
      count: 28,
      color: "state-gold",
    },
    {
      issue_type: "unit_mismatch",
      label: t("dashboard.unit_mismatch_label"),
      count: 20,
      color: "issue-unit",
    },
  ];
  const TOTAL_ERROR_COUNT = PRIORITY_ISSUES.reduce(
    (sum, issue) => sum + issue.count,
    0,
  );
  const navigate = useNavigate();
  const [exportRecords] = useState([]);

  const unit = t("common.count_unit");

  const OVERVIEW_STATS = [
    { icon: FileText, label: t("dashboard.total_count"), unit },
    { icon: SuccessCircleIcon, label: t("dashboard.approved"), unit },
    {
      icon: AlertTriangle,
      label: t("dashboard.exception_error"),
      unit,
      iconColor: "text-primary-gold",
    },
    { icon: Clock, label: t("dashboard.pending_receipt"), unit },
  ];

  const PRODUCTIVITY_STATS = [
    { icon: LineChart, label: t("dashboard.total_count"), unit },
    { icon: SuccessCircleIcon, label: t("dashboard.approved"), unit },
    {
      icon: AlertTriangle,
      label: t("dashboard.exception_error"),
      unit,
      iconColor: "text-primary-gold",
    },
    { icon: Clock, label: t("dashboard.pending_receipt"), unit },
  ];

  const handleFileSelect = (file) => {
    navigate("/register", {
      state: { defaultTab: "upload", uploadFile: file },
    });
  };

  return (
    <div className="mx-auto max-w-[1300px] space-y-6 px-6 py-6">
      {/* 1. 전체 현황 */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* 2. 오늘 생산성 지표 */}
      <section className="bg-surface-200 border-surface-200 rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-bold text-gray-700">
          {t("dashboard.today_productivity")}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTIVITY_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* 3. 빠른 실행 + 우선 검수 목록 */}
      <section className="grid h-full grid-cols-1 gap-5 lg:grid-cols-[1fr_3fr]">
        <div className="bg-surface-0 border-surface-200 flex h-full flex-col overflow-hidden rounded-lg border">
          <div className="px-4 py-3">
            <h2 className="text-lg font-bold text-gray-700">
              {t("dashboard.quick_actions")}
            </h2>
          </div>
          <div className="mt-2 flex flex-1 flex-col gap-5 px-4 pb-4">
            <QuickActionButton
              icon={UploadIcon}
              label={`+${t("dashboard.upload_new_file")}`}
              onFileSelect={handleFileSelect}
            />
            <QuickActionButton
              icon={PenLine}
              label={`+${t("dashboard.manual_registration")}`}
              onClick={() =>
                navigate("/register", { state: { defaultTab: "manual" } })
              }
            />
          </div>
        </div>

        <div className="bg-surface-0 border-surface-200 flex h-full flex-col overflow-hidden rounded-lg border">
          <div className="bg-surface-0 border-surface-200 flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-lg font-bold text-gray-700">
              {t("dashboard.priority_receipt_list")}
            </h2>
            <button
              onClick={() => navigate("/inbox")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              {t("dashboard.view_all")} <ChevronRight size={16} />
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
      <section className="bg-surface-0 border-surface-200 overflow-hidden rounded-lg border">
        <div className="bg-surface-300 flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-bold text-gray-700">
            {t("dashboard.recent_export_history")}
          </h2>
          <button
            onClick={() => navigate("/export-history")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            {t("dashboard.view_all")} <ChevronRight size={16} />
          </button>
        </div>
        <ExportHistoryTable records={exportRecords} />
      </section>
    </div>
  );
}
