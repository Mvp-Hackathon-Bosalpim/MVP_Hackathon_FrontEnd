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

  const content = data?.content ?? [];

  const isAllSelected =
    content.length > 0 && content.every((item) => selectedIds.includes(item.id));

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(content.map((item) => item.id));
    }
  };

  return (
    <section className="px-20 py-10">
      <header className="mb-14 flex items-center gap-4">
        <DownloadIcon />

        <div>
          <h2 className="mb-1 text-4xl font-bold text-gray-700">
            {t("inbox.title")}
          </h2>
          <p className="text-2xl text-gray-500">{t("inbox.desc")}</p>
        </div>
      </header>

      <InboxStats className="mb-6" />

      <InboxSearchFilter onFilterChange={() => setSelectedIds([])} />

      <div>
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="h-14 px-10" />

                {INBOX_TABLE_THEAD_KEYS.map((key) => (
                  <th
                    key={key}
                    className="h-14 px-4 text-left text-base font-bold text-gray-500"
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
              {!isPending && data && data.total_elements > 0 && (
                <>
                  {content.map((item) => (
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
              selectedCount={selectedIds.length}
              isAllSelected={isAllSelected}
              onSelectAll={handleSelectAll}
              currentPage={page + 1}
              totalPages={data.total_pages}
              pageSize={size}
              hasSelection={selectedIds.length > 0}
              selectedIds={selectedIds}
              contentIds={content.map((item) => item.id)}
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
    {
      label: t("inbox.stats.pending"),
      value: data?.needs_review_count ?? null,
    },
    { label: t("inbox.stats.exception"), value: data?.on_hold_count ?? null },
    { label: t("inbox.status.approved"), value: data?.approved_count ?? null },
    { label: t("inbox.status.rejected"), value: data?.rejected_count ?? null },
  ];

  const StatLabelClassName = "text-lg font-bold text-gray-500";
  const StatValueClassName = "text-lg text-gray-500";

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
