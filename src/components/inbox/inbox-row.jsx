import { cn, formatNumber } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useNavigate } from "react-router-dom";

const INBOX_STATUS_BADGE_CONFIG = {
  new: {
    label: "승인 가능",
    dot: "bg-primary-navy",
    text: "text-primary-navy",
  },
  need_review: {
    label: "확인 필요",
    dot: "bg-state-gold",
    text: "text-state-gold",
  },
  on_hold: {
    label: "중복 의심",
    dot: "bg-state-warning",
    text: "text-state-warning",
  },
  approved: {
    label: "승인",
    dot: "bg-state-success",
    text: "text-state-success",
  },
  rejected: { label: "반려", dot: "bg-state-error", text: "text-state-error" },
};

function InboxSourceTypeBadge({ sourceType }) {
  return (
    <div
      className={cn(
        "text-surface-100 text-stat text-surface-100 inline rounded-md px-4 py-2 text-center font-bold",
        sourceType === "수기" ? "bg-[#2C5691]" : "bg-primary-navy",
      )}
    >
      {sourceType}
    </div>
  );
}

function InboxStatusBadge({ reviewStatus }) {
  const config = INBOX_STATUS_BADGE_CONFIG[reviewStatus] ?? {
    label: reviewStatus,
    dot: "bg-gray-400",
    text: "text-gray-600",
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#DEE1E5] px-4 py-1">
      <span className={cn("size-2.5 rounded-full", config.dot)} />
      <span className={cn("text-[18px] font-bold", config.text)}>
        {config.label}
      </span>
    </div>
  );
}

function InboxRow({ item }) {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(`/inbox/${item.doc_id}`)}
      className="h-18 w-full cursor-pointer border-t border-gray-100"
    >
      <td align="center" onClick={(e) => e.stopPropagation()}>
        <Checkbox className="size-6 border-gray-700 data-checked:bg-gray-700" />
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
          <span className="text-lg font-bold text-gray-700">
            {item.normalized_item_name}
          </span>
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
          <span className="text-xl text-red-500">미 입력</span>
        )}
      </td>

      {/* 상태 */}
      <td className="pl-4">
        <InboxStatusBadge reviewStatus={item.review_status} />
      </td>

      {/* 대기이유 */}
      <td className="pl-4">
        {item.exception_flags.length > 0 ? (
          <span className="flex items-center gap-2 text-[20px] font-bold text-[#D5A548]">
            <span className="size-3 rounded-full bg-[#D5A548]" />
            사유 있음
          </span>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>
    </tr>
  );
}

export default InboxRow;
