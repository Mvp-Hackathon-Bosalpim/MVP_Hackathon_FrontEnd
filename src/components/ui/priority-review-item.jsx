import { useNavigate } from "react-router-dom";
import { FileText, AlertTriangle } from "lucide-react";

const TYPE_STYLES = {
  missing: { label: "누락", icon: AlertTriangle, iconColor: "text-[#AD211D]", tagColor: "text-[#AD211D] border-[#AD211D]" },
  duplicate: { label: "중복", icon: FileText, iconColor: "text-[#F07800]", tagColor: "text-[#F07800] border-[#F07800]" },
  mismatch: { label: "불일치", icon: AlertTriangle, iconColor: "text-[#D5A548]", tagColor: "text-[#D5A548] border-[#D5A548]" },
};

const SEVERITY_STYLES = {
  high: { label: "높음", color: "bg-gray-700" },
  medium: { label: "보통", color: "bg-gray-300" },
  low: { label: "낮음", color: "bg-gray-100" },
};

export default function PriorityReviewItem({ order, type, title, occurredAt, severity }) {
  const navigate = useNavigate();
  const typeStyle = type ? TYPE_STYLES[type] : null;
  const severityStyle = severity ? SEVERITY_STYLES[severity] : null;
  const TypeIcon = typeStyle?.icon;

  const handleReviewClick = () => {
    navigate(`/inbox?type=${type ?? ""}`);
  };

  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="flex items-center gap-2.5 flex-[2] min-w-0">
        <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-xs font-bold text-gray-700 shrink-0">
          {order}
        </span>
        {TypeIcon && <TypeIcon className={`w-6 h-6 shrink-0 ${typeStyle.iconColor}`} />}
        <span className="text-sm text-gray-500 truncate w-32">{title ?? "항목 준비 중"}</span>
        {typeStyle && (
          <span className={`ml-2 shrink-0 text-base border rounded px-2 py-1 ${typeStyle.tagColor}`}>
            {typeStyle.label}
          </span>
        )}
      </div>

      <span className="flex-[1] text-sm text-gray-500 whitespace-nowrap shrink-0">
        발생일 {occurredAt ?? "-"}
      </span>

      <span className="flex-[1.3] ml-15 flex items-center gap-1.5 text-sm text-gray-500 whitespace-nowrap shrink-0">
        심각도
        <span className={`w-4 h-4 rounded-full ${severityStyle?.color ?? "bg-gray-100"}`} />
        {severityStyle?.label ?? "-"}
      </span>

      <button
        onClick={handleReviewClick}
        className="shrink-0 text-xs font-semibold bg-primary-navy text-white rounded px-3 py-1.5 hover:opacity-90 transition-opacity"
      >
        검토하기
      </button>
    </div>
  );
}