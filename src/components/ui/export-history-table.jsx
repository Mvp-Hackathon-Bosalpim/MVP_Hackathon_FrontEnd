import { useTranslation } from "react-i18next";
import { formatExportedAt } from "@/lib/utils";
import useDownloadExport from "@/hooks/mutations/export/use-download-export";

const STATUS_COLOR = {
  COMPLETED: "bg-state-success",
  FAILED: "bg-state-error",
};

function ExportHistoryRow({ record, t, i18n }) {
  const downloadMutation = useDownloadExport();
  const status = record.status?.toUpperCase();
  const statusLabel =
    i18n.language.startsWith("ko") && status === "COMPLETED"
      ? t("export.status_completed")
      : record.status;

  const handleDownload = () => {
    downloadMutation.mutate(record.id, {
      onSuccess: (url) => window.open(url, "_blank"),
    });
  };

  return (
    <tr>
      <td className="py-5 px-3 text-gray-700">{record.fileName}</td>
      <td className="py-5 px-3 text-gray-500">{record.format}</td>
      <td className="py-5 px-3 text-gray-500">{formatExportedAt(record.exportedAt)}</td>
      <td className="py-5 px-3 text-gray-500">{record.count}</td>
      <td className="py-5 px-3">
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs text-white ${STATUS_COLOR[status] ?? "bg-primary-navy"}`}
        >
          {statusLabel}
        </span>
      </td>
      <td className="py-5 px-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
          className="text-xs font-medium border border-gray-100 rounded px-3 py-1.5 hover:bg-surface-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("common.download")}
        </button>
        {downloadMutation.isError && (
          <p className="mt-1 text-xs text-state-error">{t("export.download_error")}</p>
        )}
      </td>
    </tr>
  );
}

export default function ExportHistoryTable({ records = [] }) {
  const { t, i18n } = useTranslation();

  const COLUMNS = [
    t("common.file_name"),
    t("common.format"),
    t("export.export_date_time"),
    t("export.created_count"),
    t("common.status"),
    t("common.download"),
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-gray-500">
            {COLUMNS.map((col) => (
              <th key={col} className="py-3 px-3 font-semibold bg-surface-200">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200">
          {records.length > 0
            ? records.map((record) => (
              <ExportHistoryRow key={record.id} record={record} t={t} i18n={i18n} />
            ))
            : (
              <tr>
                <td colSpan={COLUMNS.length} className="py-10 text-center text-gray-300">
                  {t("export.no_data")}
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}
