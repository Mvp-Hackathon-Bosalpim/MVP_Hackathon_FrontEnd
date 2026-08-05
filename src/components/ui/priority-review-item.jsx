const SEVERITY_STYLES = {
  high: { label: "높음", color: "bg-gray-700" },
  medium: { label: "보통", color: "bg-gray-300" },
  low: { label: "낮음", color: "bg-gray-100" },
};

export default function PriorityReviewItem({ order, occurredAt, severity }) {
  const severityStyle = severity ? SEVERITY_STYLES[severity] : null;

  return (
    <div className="flex items-center py-6">
      <div className="flex items-center gap-4 shrink-0">
        <span className="flex items-center justify-center w-9 h-9 border border-gray-300 rounded text-base font-bold text-gray-700">
          {order}
        </span>
        <span className="text-lg text-gray-500">항목 준비 중</span>
      </div>

      <span className="ml-90 text-xl text-gray-500 whitespace-nowrap">
        발생일 {occurredAt ?? "-"}
      </span>

      <span className="ml-90 flex items-center gap-3 text-xl text-gray-500 whitespace-nowrap">
        심각도
        <span className={`w-7 h-7 rounded-full ${severityStyle?.color ?? "bg-gray-100"}`} />
        {severityStyle?.label ?? "-"}
      </span>

      <button className="ml-auto text-sm font-semibold bg-primary-navy text-white rounded px-4 py-2 hover:opacity-90 transition-opacity">
        검토하기
      </button>
    </div>
  );
}