import { useTranslation } from "react-i18next";

const STATUS_COLOR = {
  COMPLETED: "bg-state-success",
  FAILED: "bg-state-error",
};

function formatExportedAt(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yy}.${mm}.${dd} ${hh}:${min}:${ss}`;
}

export default function ExportHistoryTable({ records = [] }) {
  const { t, i18n } = useTranslation();

  const COLUMNS = [
    t("common.file_name"),
    t("common.format"),
    t("export.export_date_time"),
    t("export.created_count"),
    t("export.requester"),
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
            ? records.map((record) => {
              const status = record.status?.toUpperCase();
              const statusLabel =
                i18n.language.startsWith("ko") && status === "COMPLETED"
                  ? t("export.status_completed")
                  : record.status;
              return (
                <tr key={record.id}>
                  <td className="py-5 px-3 text-gray-700">{record.fileName}</td>
                  <td className="py-5 px-3 text-gray-500">{record.format}</td>
                  <td className="py-5 px-3 text-gray-500">{formatExportedAt(record.exportedAt)}</td>
                  <td className="py-5 px-3 text-gray-500">{record.count}</td>
                  <td className="py-5 px-3 text-gray-500">{record.requestedBy}</td>
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
                      onClick={() => {}}
                      className="text-xs font-medium border border-gray-100 rounded px-3 py-1.5 hover:bg-surface-100 transition-colors"
                    >
                      {t("common.download")}
                    </button>
                  </td>
                </tr>
              );
            })
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
