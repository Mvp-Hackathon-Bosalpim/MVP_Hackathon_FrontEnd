import { useTranslation } from "react-i18next";
import LoadingIndicator from "@/assets/loading-indicator.svg?react";
import AlertCircle from "@/assets/alert-circle.svg?react";
import { formatExportedAt } from "@/lib/utils";
import useDownloadExport from "@/hooks/mutations/export/use-download-export";

const STATUS_COLOR = {
  COMPLETED: "bg-state-success",
  FAILED: "bg-state-error",
};

function ExportFileRow({ record, t, i18n }) {
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
      <td className="px-3 py-4 text-gray-700">{record.file_name ?? "-"}</td>
      <td className="px-3 py-4 text-gray-500">{record.format ?? "-"}</td>
      <td className="px-3 py-4 whitespace-nowrap text-gray-500">{formatExportedAt(record.exported_at)}</td>
      <td className="px-3 py-4 text-gray-500">{record.exported_count ?? "-"}</td>
      <td className="px-3 py-4">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium text-white ${STATUS_COLOR[status] ?? "bg-primary-navy"}`}
        >
          {statusLabel ?? "-"}
        </span>
      </td>
      <td className="px-3 py-4">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
          className="rounded border border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-40"
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

export default function ExportFileTable({ records = [], isPending = false, isError = false, onRetry }) {
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
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            {COLUMNS.map((col) => (
              <th key={col} className="bg-surface-200 px-3 py-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200">
          {isPending && (
            <tr>
              <td colSpan={COLUMNS.length} className="py-20 text-center">
                <div className="flex flex-col items-center justify-center gap-3 text-gray-300">
                  <LoadingIndicator className="animate-spin" />
                  <p>{t("common.loading")}</p>
                </div>
              </td>
            </tr>
          )}
          {!isPending && isError && (
            <tr>
              <td colSpan={COLUMNS.length} className="py-20 text-center">
                <div className="flex flex-col items-center justify-center gap-3 text-gray-300">
                  <AlertCircle />
                  <p>{t("export.load_error")}</p>
                  <button
                    type="button"
                    onClick={onRetry}
                    className="rounded border border-primary-navy px-2 py-1.5 text-primary-navy"
                  >
                    {t("common.retry")}
                  </button>
                </div>
              </td>
            </tr>
          )}
          {!isPending && !isError && records.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="py-10 text-center text-gray-300">
                {t("export.no_data")}
              </td>
            </tr>
          )}
          {!isPending &&
            !isError &&
            records.map((record) => (
              <ExportFileRow key={record.id} record={record} t={t} i18n={i18n} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
