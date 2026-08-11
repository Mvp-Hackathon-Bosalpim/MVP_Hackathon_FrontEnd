import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import LeftIcon from "@/assets/icons/left-icon.svg?react";

const REVIEW_STATUS_CLASS = {
  APPROVED: "text-state-success",
  REJECTED: "text-state-error",
  ON_HOLD: "text-state-warning",
  NEEDS_REVIEW: "text-state-warning",
  NEW: "text-gray-500",
};

function InboxDetailHeader({ data }) {
  const { t } = useTranslation();

  const {
    doc_id,
    exception_flags,
    review_status,
    source_ref,
    current_index,
    total,
    effective_date,
    change_log,
  } = data;

  const flags = exception_flags ?? [];
  const lastModifiedAt = change_log?.[change_log.length - 1]?.at;

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
          {flags.length > 0 ? (
            <span className="font-bold text-state-warning">
              {flags.map((f) => t(`exception.label.${f}`, f)).join(", ")}
            </span>
          ) : (
            <span className={`font-bold ${REVIEW_STATUS_CLASS[review_status] ?? "text-gray-500"}`}>
              {t(`inbox.status.${review_status?.toLowerCase()}`, review_status ?? "-")}
            </span>
          )}
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

        <HeaderCell label={t("inbox.table.applied_date")}>
          <span className="text-gray-700">
            {formatDateTime(effective_date)}
          </span>
        </HeaderCell>

        <HeaderCell label={t("detail.last_modified")}>
          <span className="text-gray-700">{formatDateTime(lastModifiedAt)}</span>
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
