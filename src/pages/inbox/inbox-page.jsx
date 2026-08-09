import DownloadIcon from "@/assets/icons/download-icon.svg?react";
import { cn, formatNumber } from "@/lib/utils";
import useDocumentStatusCounts from "@/hooks/queries/inbox/use-document-status-counts";
import { useState } from "react";
import InboxResultFooter from "@/components/inbox/inbox-result-footer";
import { INBOX_TABLE_THEAD } from "@/components/inbox/inbox-table-config";
import useInboxSearchParams from "@/hooks/inbox/use-inbox-search-params";
import InboxStatusRow from "@/components/inbox/inbox-status-row";
import InboxRow from "@/components/inbox/inbox-row";
import InboxSearchFilter from "@/components/inbox/inbox-search-filter";

function InboxPage() {
  const [selectedIds, setSelectedIds] = useState([]);

  const {
    page,
    size,
    hasFilter,
    data,
    isPending,
    isError,
    refetch,
    handlePageChange,
    handlePageSizeChange,
    handleFilterReset,
  } = useInboxSearchParams({ onNavigate: () => setSelectedIds([]) });

  const [selectedStatus, setSelectedStatus] = useState(null);

  const filteredContent = selectedStatus
    ? (data?.content ?? []).filter(
        (item) => item.review_status === selectedStatus,
      )
    : (data?.content ?? []);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

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

      <InboxStats className="mb-6" />

      <InboxStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        className="mb-4"
      />

      <InboxSearchFilter />

      <div>
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="h-14 px-10" />
                {INBOX_TABLE_THEAD.map((thead) => (
                  <th
                    key={thead}
                    className="h-14 px-4 text-left text-[22px] font-bold text-gray-500"
                  >
                    {thead}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isPending && <InboxStatusRow.Loading />}
              {isError && <InboxStatusRow.Error retry={refetch} />}
              {!isPending &&
                data &&
                data.total_elements === 0 &&
                (hasFilter ? (
                  <InboxStatusRow.NoResult reset={handleFilterReset} />
                ) : (
                  <InboxStatusRow.Empty />
                ))}
              {!isPending &&
                data &&
                data.total_elements > 0 &&
                filteredContent.length === 0 && (
                  <InboxStatusRow.NoResult
                    reset={() => setSelectedStatus(null)}
                  />
                )}
              {!isPending && data && filteredContent.length > 0 && (
                <>
                  {filteredContent.map((item) => (
                    <InboxRow
                      key={item.id}
                      item={item}
                      isSelected={selectedIds.includes(item.id)}
                      onToggle={handleToggleSelect}
                    />
                  ))}
                </>
              )}
            </tbody>
          </table>

          {!isPending && data && (
            <InboxResultFooter
              totalElements={data.total_elements}
              currentPage={page + 1}
              totalPages={data.total_pages}
              pageSize={size}
              hasSelection={selectedIds.length > 0}
              selectedIds={selectedIds}
              contentIds={filteredContent.map((item) => item.id)}
              onActionSuccess={() => setSelectedIds([])}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>

      {/* <InboxResultTable /> */}
    </section>
  );
}

export default InboxPage;

const STATUS_FILTER_CONFIG = [
  { key: "NEW", label: "새 항목", countField: "new_count" },
  { key: "NEEDS_REVIEW", label: "확인 필요", countField: "needs_review_count" },
  { key: "ON_HOLD", label: "보류 필요", countField: "on_hold_count" },
  { key: "APPROVED", label: "승인", countField: "approved_count" },
  { key: "REJECTED", label: "반려", countField: "rejected_count" },
];

function InboxStatusFilter({ selectedStatus, onStatusChange, className }) {
  const { data } = useDocumentStatusCounts();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {STATUS_FILTER_CONFIG.map(({ key, label, countField }) => {
        const isSelected = selectedStatus === key;
        const count = data?.[countField] ?? 0;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onStatusChange(isSelected ? null : key)}
            className={cn(
              "flex items-center gap-2 rounded-full border border-gray-100 px-4 py-1.5 text-sm transition-colors",
              isSelected
                ? "border-primary-navy bg-primary-navy text-white"
                : "bg-surface-200 text-gray-700",
            )}
          >
            <span>{label}</span>
            <span
              className={cn(
                "text-primary-navy flex aspect-square size-6 items-center justify-center rounded-full bg-white font-bold",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function InboxStats({ className }) {
  const { data } = useDocumentStatusCounts();

  const total = data
    ? (data.new_count ?? 0) +
      (data.needs_review_count ?? 0) +
      (data.on_hold_count ?? 0) +
      (data.approved_count ?? 0) +
      (data.rejected_count ?? 0)
    : null;

  const stats = [
    { label: "전체", value: total },
    { label: "검수 대기", value: data?.needs_review_count ?? null },
    {
      label: "예외 탐지 (누락/중복/불일치)",
      value: data?.on_hold_count ?? null,
    },
    { label: "승인", value: data?.approved_count ?? null },
    { label: "반려", value: data?.rejected_count ?? null },
  ];

  const StatLabelClassName = "text-[24px] font-bold text-gray-500";
  const StatValueClassName = "text-[24px] text-gray-500";

  return (
    <ul className={cn("flex items-center gap-5", className)}>
      {stats.map(({ label, value }) => (
        <li key={label} className="flex items-center gap-2">
          <span className={StatLabelClassName}>{label}</span>
          <span className={StatValueClassName}>
            {value !== null ? formatNumber(value) : "-"}
          </span>
        </li>
      ))}
    </ul>
  );
}
