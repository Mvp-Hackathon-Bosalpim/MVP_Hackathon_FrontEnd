import { useState } from "react";
import { cn, formatDateTime } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

const TABS = ["변경 이력", "주석"];
const INITIAL_SHOW = 3;

const TABLE_HEADS = [
  "일시",
  "변경자",
  "변경 항목",
  "변경 전",
  "변경 후",
  "사유",
];

function AuditLogCard({ changeLog = [], comments = [] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const tabCounts = [changeLog.length, comments.length];
  const rows = activeTab === 0 ? changeLog : comments;
  const visible = expanded ? rows : rows.slice(0, INITIAL_SHOW);
  const hasMore = rows.length > INITIAL_SHOW;

  return (
    <section className="mt-6">
      <h2 className="mb-4 text-[20px] font-bold text-gray-700">
        3. 변경 이력(Audit Log)
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        {/* 탭 */}
        <div className="border-primary-gold flex border-b bg-[#D8D2C5]">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(i);
                setExpanded(false);
              }}
              className={cn(
                "px-6 py-4 text-[18px] font-bold transition-colors",
                activeTab === i
                  ? "border-b-2 border-gray-700 text-gray-700"
                  : "text-gray-400",
              )}
            >
              {tab}({tabCounts[i]})
            </button>
          ))}
        </div>

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
                  colSpan={6}
                  className="py-12 text-center text-[18px] text-gray-300"
                >
                  내역이 없습니다.
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
                    {log.field_label ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {log.from ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {log.to ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-[18px] text-gray-500">
                    {log.reason ?? "-"}
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
            {expanded ? "접기" : "더보기"}
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
