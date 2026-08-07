import DownloadIcon from "@/assets/icons/download-icon.svg?react";
import { INBOX_STATS } from "./mock-data";
import InboxResultTable from "@/components/inbox/inbox-result-table";
import { cn } from "@/lib/utils";

function InboxPage() {
  return (
    <section className="px-20 py-10">
      <header className="mb-14 flex items-center gap-4">
        <DownloadIcon />

        <div>
          <h2 className="mb-1 text-4xl font-bold text-gray-700">검수 인박스</h2>
          <p className="text-2xl text-gray-500">
            상태별로 필터링하고 항목을 열어 원본 근거를 확인한 뒤
            수정•승인•반려하세요
          </p>
        </div>
      </header>

      <InboxStats className="mb-4" />

      <InboxResultTable />
    </section>
  );
}

export default InboxPage;

function InboxStats({ className }) {
  const StatLabelClassName = "text-[24px] font-bold text-gray-500";
  const StatValueClassName = "text-[24px] text-gray-500";

  return (
    <ul className={cn("flex items-center gap-5", className)}>
      <li className="flex items-center gap-2">
        <span className={StatLabelClassName}>전체</span>
        <span className={StatValueClassName}>{INBOX_STATS.total}</span>
      </li>
      <li className="flex items-center gap-2">
        <span className={StatLabelClassName}>검수 대기</span>
        <span className={StatValueClassName}>{INBOX_STATS.pending}</span>
      </li>
      <li className="flex items-center gap-2">
        <span className={StatLabelClassName}>예외 탐지 (누락/중복/뷸일치)</span>
        <span className={StatValueClassName}>{INBOX_STATS.exception}</span>
      </li>
      <li className="flex items-center gap-2">
        <span className={StatLabelClassName}>승인</span>
        <span className={StatValueClassName}>{INBOX_STATS.approved}</span>
      </li>
      <li className="flex items-center gap-2">
        <span className={StatLabelClassName}>반려</span>
        <span className={StatValueClassName}>{INBOX_STATS.rejected}</span>
      </li>
    </ul>
  );
}
