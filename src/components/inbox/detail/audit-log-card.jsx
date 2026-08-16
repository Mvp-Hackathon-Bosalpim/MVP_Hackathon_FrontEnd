import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn, formatDateTime } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

const INITIAL_SHOW = 3;

function AuditLogCard({ changeLog = [] }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const FIELD_LABEL_MAP = {
    normalized_item_name: t("reg.manual.item_name"),
    supplier_name: t("inbox.filter.supplier"),
    spec: t("common.spec"),
    unit: t("common.unit_label"),
    price_before: t("detail.existing_unit_price"),
    price_after: t("detail.changed_unit_price"),
    effective_date: t("inbox.table.applied_date"),
    review_status: t("common.status"),
  };

  const getFieldLabel = (field) => FIELD_LABEL_MAP[field] ?? field ?? "-";

  const ACTION_MAP = {
    edit: { label: t("changelog.action.EDIT"), color: "text-[#E38359]" },
    approve: { label: t("changelog.action.APPROVE"), color: "text-state-success" },
    reject: { label: t("changelog.action.REJECT"), color: "text-state-error" },
    re_review: { label: t("changelog.action.RE_REVIEW"), color: "text-primary-navy" },
  };

  const TABLE_HEADS = [
    t("common.date_time"),
    t("history.table.modifier"),
    t("history.table.change_item"),
    t("history.table.before_change"),
    t("history.table.after_change"),
    t("history.table.action_result"),
    t("history.table.reason"),
  ];

  const visible = expanded ? changeLog : changeLog.slice(0, INITIAL_SHOW);
  const hasMore = changeLog.length > INITIAL_SHOW;

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-[20px] font-bold text-gray-700">
        {t("detail.section_audit_log")}
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        {/* 테이블 */}
        <table className="w-full">
          <thead>
            <tr className="bg-surface-100 border-b border-gray-100">
              {TABLE_HEADS.map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-[18px] font-bold text-gray-600"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-[18px] text-gray-300"
                >
                  {t("detail.no_history")}
                </td>
              </tr>
            ) : (
              visible.map((log, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {formatDateTime(log.at)}
                  </td>
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {log.actor ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {getFieldLabel(log.field)}
                  </td>
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {log.from ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {log.to ?? "-"}
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 text-[18px] font-semibold",
                      ACTION_MAP[log.action]?.color ?? "text-gray-500",
                    )}
                  >
                    {ACTION_MAP[log.action]?.label ?? log.action ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {log.memo ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 더보기 */}
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center justify-center gap-1 border-t border-gray-100 py-4 text-[18px] text-gray-500"
          >
            {expanded ? t("detail.collapse") : t("detail.load_more")}
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform",
                expanded && "rotate-180",
              )}
            />
          </button>
        )}
      </div>
    </section>
  );
}

export default AuditLogCard;
