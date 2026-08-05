import { useState } from "react";
import {
  FileText, Clock, AlertTriangle, CheckCircle,
  LineChart, Percent, Upload, PenLine, ChevronRight,
} from "lucide-react";
import StatCard from "../../components/ui/stat-card";
import QuickActionButton from "../../components/ui/quick-action-button";
import PriorityReviewItem from "../../components/ui/priority-review-item";
import ExportHistoryTable from "../../components/ui/export-history-table";

const OVERVIEW_STATS = [
  { icon: FileText, label: "전체 건수", unit: "건" },
  { icon: Clock, label: "검수 대기", unit: "건" },
  { icon: AlertTriangle, label: "예외/오류 탐지", unit: "건" ,iconColor: "text-primary-gold"},
  { icon: CheckCircle, label: "승인 완료", unit: "건" },
];

const PRODUCTIVITY_STATS = [
  { icon: LineChart, label: "전체 건수", unit: "건" },
  { icon: Clock, label: "평균 검수 시간", unit: "" },
  { icon: AlertTriangle, label: "오류 발생률", unit: "%", iconColor: "text-primary-gold" },
  { icon: Percent, label: "품질/정확도", unit: "%" },
];

export default function DashboardPage() {
  const [exportRecords] = useState([]);

  return (
    <div className="max-w-[2000px] mx-auto p-6 space-y-10">
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
                <QuickActionButton icon={Upload} label="+신규 파일 업로드" onClick={() => {}} />
                <QuickActionButton icon={PenLine} label="+수기 등록" onClick={() => {}} />
            </div>
        </div>

        <div className="bg-surface-0 border border-surface-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-0 border-b border-surface-200">
            <h2 className="text-lg font-bold text-gray-700">우선 검수 필요 목록</h2>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              전체보기 <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-evenly divide-y divide-surface-200 px-4">
            {[1, 2, 3].map((order) => (
              <PriorityReviewItem key={order} order={order} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. 최근 데이터 내보내기 이력 */}
      <section className="bg-surface-0 border border-surface-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-surface-300 ">
            <h2 className="text-lg font-bold text-gray-700">최근 데이터 내보내기 이력</h2>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                전체보기 <ChevronRight size={16} />
            </button>
        </div>
        <ExportHistoryTable records={exportRecords} />
        </section>
    </div>
  );
}