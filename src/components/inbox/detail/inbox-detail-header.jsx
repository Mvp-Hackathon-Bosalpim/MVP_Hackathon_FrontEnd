import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import LeftIcon from "@/assets/icons/left-icon.svg?react";

function InboxDetailHeader({ data }) {
  const { t } = useTranslation();

  const REVIEW_STATUS_MAP = {
    new: { label: t("inbox.status.new"), className: "text-state-gold" },
    pending: { label: t("inbox.status.reviewing"), className: "text-state-warning" },
    approved: { label: t("inbox.status.approved"), className: "text-state-success" },
    rejected: { label: t("inbox.status.rejected"), className: "text-state-error" },
  };

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
        {t("detail.back_to_list")}
      </Link>
      <div className="mb-6 flex w-full justify-between">
        <HeaderCell label={t("detail.data_id")}>
          <span className="text-primary-navy font-bold">#{doc_id}</span>
        </HeaderCell>

        <HeaderCell label={t("detail.current_status")}>
          <span className={`font-bold ${status.className}`}>
            {status.label}
          </span>
        </HeaderCell>

        <HeaderCell label={t("detail.original_file")}>
          <span className="max-w-40 overflow-hidden text-nowrap text-ellipsis text-gray-700">
            {source_ref.file_name}
          </span>
        </HeaderCell>

        <HeaderCell label={t("detail.row_number")}>
          <span className="text-gray-700">
            {current_index}
            <span className="text-gray-300"> /{total}</span>
          </span>
        </HeaderCell>

        <HeaderCell label={t("detail.created_date")}>
          <span className="text-gray-700">
            {formatDateTime(effective_date)}
          </span>
        </HeaderCell>

        <HeaderCell label={t("detail.last_modified")}>
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
