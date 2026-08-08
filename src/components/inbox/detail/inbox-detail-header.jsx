import { formatDateTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import LeftIcon from "@/assets/icons/left-icon.svg?react";
const REVIEW_STATUS_MAP = {
  new: { label: "새 항목", className: "text-state-gold" },
  pending: { label: "검토중", className: "text-state-warning" },
  approved: { label: "승인", className: "text-state-success" },
  rejected: { label: "반려", className: "text-state-error" },
};

function InboxDetailHeader({ data }) {
  const {
    doc_id,
    review_status,
    source_ref,
    current_index,
    total,
    reviewed_at,
    effective_date,
  } = data;

  const status = REVIEW_STATUS_MAP[review_status] ?? {
    label: review_status,
    className: "text-gray-500",
  };

  return (
    <>
      <Link
        to="/inbox"
        className="mb-6 flex items-center font-bold text-gray-500"
      >
        <LeftIcon />
        목록으로 돌아가기
      </Link>
      <div className="mb-6 flex w-full justify-between">
        <HeaderCell label="데이터 ID">
          <span className="text-primary-navy font-bold">#{doc_id}</span>
        </HeaderCell>

        <HeaderCell label="현재 상태">
          <span className={`font-bold ${status.className}`}>
            {status.label}
          </span>
        </HeaderCell>

        <HeaderCell label="원본 파일">
          <span className="max-w-40 overflow-hidden text-nowrap text-ellipsis text-gray-700">
            {source_ref.file_name}
          </span>
        </HeaderCell>

        <HeaderCell label="행 번호">
          <span className="text-gray-700">
            {current_index}
            <span className="text-gray-300"> /{total}</span>
          </span>
        </HeaderCell>

        <HeaderCell label="생성일">
          <span className="text-gray-700">
            {formatDateTime(effective_date)}
          </span>
        </HeaderCell>

        <HeaderCell label="마지막 수정">
          <span className="text-gray-700">{formatDateTime(reviewed_at)}</span>
        </HeaderCell>
      </div>
    </>
  );
}

export default InboxDetailHeader;

function HeaderCell({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[18px] font-bold text-gray-500">{label}</span>
      <span className="text-[18px]">{children}</span>
    </div>
  );
}
