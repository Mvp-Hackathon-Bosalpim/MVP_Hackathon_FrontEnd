import DownloadIcon from "@/assets/icons/download-icon.svg?react";
import { cn, formatNumber } from "@/lib/utils";
import useDocumentStatusCounts from "@/hooks/queries/inbox/use-document-status-counts";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import InboxResultFooter from "@/components/inbox/inbox-result-footer";
import useInboxSearchParams from "@/hooks/inbox/use-inbox-search-params";
import InboxStatusRow from "@/components/inbox/inbox-status-row";
import InboxRow from "@/components/inbox/inbox-row";
import InboxSearchFilter from "@/components/inbox/inbox-search-filter";

const INBOX_TABLE_THEAD_KEYS = [
  "inbox.table.document",
  "inbox.table.original",
  "inbox.table.supplier",
  "inbox.table.item",
  "inbox.table.spec_unit",
  "inbox.table.changed_unit_price",
  "inbox.table.applied_date",
  "common.status",
  "inbox.table.pending_reason",
];

function InboxPage() {
  const { t } = useTranslation();
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
          <h2 className="mb-1 text-4xl font-bold text-gray-700">{t("inbox.title")}</h2>
          <p className="text-2xl text-gray-500">{t("inbox.desc")}</p>
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
                {INBOX_TABLE_THEAD_KEYS.map((key) => (
                  <th
                    key={key}
                    className="h-14 px-4 text-left text-[22px] font-bold text-gray-500"
                  >
                    {t(key)}
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
    </section>
  );
}

export default InboxPage;

const STATUS_FILTER_CONFIG = [
  { key: "NEW", labelKey: "inbox.status.new", countField: "new_count" },
  { key: "NEEDS_REVIEW", labelKey: "inbox.status.needs_check", countField: "needs_review_count" },
  { key: "ON_HOLD", labelKey: "inbox.status.on_hold", countField: "on_hold_count" },
  { key: "APPROVED", labelKey: "inbox.status.approved", countField: "approved_count" },
  { key: "REJECTED", labelKey: "inbox.status.rejected", countField: "rejected_count" },
];

function InboxStatusFilter({ selectedStatus, onStatusChange, className }) {
  const { t } = useTranslation();
  const { data } = useDocumentStatusCounts();

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {STATUS_FILTER_CONFIG.map(({ key, labelKey, countField }) => {
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
            <span>{t(labelKey)}</span>
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
  const { t } = useTranslation();
  const { data } = useDocumentStatusCounts();

  const total = data
    ? (data.new_count ?? 0) +
      (data.needs_review_count ?? 0) +
      (data.on_hold_count ?? 0) +
      (data.approved_count ?? 0) +
      (data.rejected_count ?? 0)
    : null;

  const stats = [
    { label: t("inbox.stats.total"), value: total },
    { label: t("inbox.stats.pending"), value: data?.needs_review_count ?? null },
    { label: t("inbox.stats.exception"), value: data?.on_hold_count ?? null },
    { label: t("inbox.status.approved"), value: data?.approved_count ?? null },
    { label: t("inbox.status.rejected"), value: data?.rejected_count ?? null },
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
