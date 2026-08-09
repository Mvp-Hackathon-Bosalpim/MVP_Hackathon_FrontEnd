import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useExportDocuments from "@/hooks/mutations/export/use-export-documents";
import { getExportDownloadUrl } from "@/services/api/export";
import useDocumentStatusCounts from "@/hooks/queries/inbox/use-document-status-counts";

const FORMATS = ["JSON", "CSV"];

/**
 * @typedef {Object} InboxExportModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 */

/** @param {InboxExportModalProps} props */
function InboxExportModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [format, setFormat] = useState("JSON");
  const [fileName, setFileName] = useState("");

  const { data: statusCounts } = useDocumentStatusCounts();
  const approvedCount = statusCounts?.approved_count ?? 0;

  const exportMutation = useExportDocuments();

  const handleClose = () => {
    setFormat("JSON");
    setFileName("");
    onClose();
  };

  const handleConfirm = () => {
    exportMutation.mutate(
      { format, file_name: fileName },
      {
        onSuccess: async (data) => {
          try {
            const downloadUrl = await getExportDownloadUrl(data.id);
            window.location.href = downloadUrl;
            handleClose();
          } catch (e) {
            console.error("[export] download url error:", e);
          }
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false} className="min-w-150 gap-0 p-0">
        {/* 헤더 */}
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-100 px-8 py-6">
          <DialogTitle className="text-2xl font-bold text-gray-700">
            {t("export.title")}
          </DialogTitle>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-700"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </DialogHeader>

        {/* 바디 */}
        <div className="flex flex-col px-8 py-6">
          {/* 승인 완료 */}
          <div className="border-b border-gray-100 pb-6">
            <p className="mb-1 text-base font-bold text-gray-700">
              {t("export.approved_completed")}
            </p>
            <p className="text-base text-gray-500">
              총 <strong className="text-gray-700">{approvedCount}</strong> 건
            </p>
          </div>

          {/* 형식 선택 */}
          <div className="border-b border-gray-100 py-6">
            <p className="mb-3 text-base font-bold text-gray-700">
              {t("export.select_format")}
            </p>
            <div className="flex flex-col gap-2">
              {FORMATS.map((f) => (
                <label
                  key={f}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="export-format"
                    value={f}
                    checked={format === f}
                    onChange={() => setFormat(f)}
                    className="accent-primary-navy size-4"
                  />
                  <span className="text-base text-gray-700">{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 파일명 */}
          <div className="pt-6">
            <p className="mb-3 text-base font-bold text-gray-700">
              {t("export.file_name")}
            </p>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={t("export.file_name_placeholder")}
              className="w-full rounded border border-gray-200 px-4 py-3 text-base text-gray-700 outline-none placeholder:text-gray-300 focus:border-gray-500"
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex gap-3 px-8 pb-8">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded border border-gray-200 py-2 text-base text-gray-500 transition-colors hover:bg-gray-50"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!fileName.trim() || exportMutation.isPending}
            className="bg-primary-navy flex-1 rounded py-2 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("export.confirm")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InboxExportModal;
