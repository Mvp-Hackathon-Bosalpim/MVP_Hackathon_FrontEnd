import { cn, formatNumber } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const INBOX_STATUS_BADGE_CONFIG = {
  NEW: {
    i18nKey: "inbox.status.new",
    dot: "bg-[#31598D]",
    text: "text-[#31598D]",
  },
  NEEDS_REVIEW: {
    i18nKey: "inbox.status.needs_check",
    dot: "bg-state-gold",
    text: "text-state-gold",
  },
  ON_HOLD: {
    i18nKey: "inbox.status.on_hold",
    dot: "bg-state-warning",
    text: "text-state-warning",
  },
  APPROVED: {
    i18nKey: "inbox.status.approved",
    dot: "bg-state-success",
    text: "text-state-success",
  },
  REJECTED: {
    i18nKey: "inbox.status.rejected",
    dot: "bg-state-error",
    text: "text-state-error",
  },
};

function InboxSourceTypeBadge({ sourceType }) {
  return (
    <div
      className={cn(
        "text-surface-100 inline rounded-md px-4 py-2 text-center font-bold",
        sourceType === "수기" ? "bg-[#2C5691]" : "bg-primary-navy",
      )}
    >
      {sourceType}
    </div>
  );
}

function InboxStatusBadge({ reviewStatus }) {
  const { t } = useTranslation();
  const config = INBOX_STATUS_BADGE_CONFIG[reviewStatus] ?? {
    i18nKey: null,
    dot: "bg-gray-400",
    text: "text-gray-600",
  };
  const label = config.i18nKey ? t(config.i18nKey) : (reviewStatus ?? "-");

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#DEE1E5] px-4 py-1">
      <span className={cn("size-2.5 rounded-full", config.dot)} />
      <span className={cn("text-[18px] font-bold", config.text)}>
        {label}
      </span>
    </div>
  );
}

/**
 * @typedef {Object} InboxRowProps
 * @property {InboxItemDetailDto} item
 * @property {boolean} isSelected
 * @property {(id: number) => void} onToggle
 */

/**@param {InboxRowProps} props */
function InboxRow({ item, isSelected, onToggle }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <tr
      onClick={() => navigate(`/inbox/${item.id}`)}
      className="h-18 w-full cursor-pointer border-t border-gray-100"
    >
      <td align="center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onClick={() => onToggle(item.id)}
          className="size-6 border-gray-700 data-checked:bg-gray-700"
        />
      </td>

      {/* 문서 */}
      <td className="pl-4">{item.doc_id}</td>

      {/* 원본 */}
      <td className="pl-4">
        <InboxSourceTypeBadge sourceType={item.source_type} />
      </td>

      {/* 공급사 */}
      <td className="pl-4 text-lg">{item.supplier_name}</td>

      {/* 품목 */}
      <td className="pl-4">
        <div className="flex flex-col">
          {item.normalized_item_name ? (
            <span className="text-lg font-bold text-gray-700">
              {item.normalized_item_name}
            </span>
          ) : (
            <span className="text-lg font-bold text-state-error">
              {t("inbox.no_item_name")}
            </span>
          )}
          <span className="text-base text-gray-300">{item.raw_item_name}</span>
        </div>
      </td>

      {/* 규격/단위 */}
      <td className="pl-4">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-700">{item.spec}</span>
          <span className="text-base text-gray-400">{item.unit}</span>
        </div>
      </td>

      {/* 변경단가 */}
      <td className="pl-4">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-700">
            ₩{formatNumber(item.price_after)}
          </span>
          <span className="text-base text-gray-400 line-through">
            ₩{formatNumber(item.price_before)}
          </span>
        </div>
      </td>

      {/* 적용일 */}
      <td className="pl-4">
        {item.effective_date ? (
          <span className="text-lg text-gray-700">{item.effective_date}</span>
        ) : (
          <span className="text-lg text-state-error">{t("inbox.table.not_entered")}</span>
        )}
      </td>

      {/* 상태 */}
      <td className="pl-4">
        <InboxStatusBadge reviewStatus={item.review_status} />
      </td>

      {/* 대기이유 */}
      <td className="pl-4">
        <span className="text-gray-500">—</span>
        {/* {item.exception_flags.length > 0 ? (
          <span className="flex items-center gap-2 text-[20px] font-bold text-[#D5A548]">
            <span className="size-3 rounded-full bg-[#D5A548]" />
            사유 있음
          </span>
        ) : (
        <></>
        )} */}
      </td>
    </tr>
  );
}

export default InboxRow;
