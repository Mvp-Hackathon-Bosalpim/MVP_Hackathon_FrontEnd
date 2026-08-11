import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_MEMO_LENGTH = 500;

/**
 * @typedef {'approve' | 'reject' | 'reReview' | 'delete'} ActionType
 *
 * @typedef {Object} InboxActionModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {(memo?: string) => void} onConfirm
 * @property {ActionType} actionType
 */

/** @param {InboxActionModalProps} props */
export default function InboxActionModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
}) {
  const { t } = useTranslation();
  const [memo, setMemo] = useState("");

  const MODAL_CONFIG = {
    approve: {
      title: t("inbox.modal.approve_title"),
      hasMemo: true,
      description: t("inbox.modal.approve_desc"),
      placeholder: t("inbox.modal.approve_placeholder"),
      confirmLabel: t("inbox.modal.approve_confirm"),
    },
    reject: {
      title: t("inbox.modal.reject_title"),
      hasMemo: true,
      description: t("inbox.modal.reject_desc"),
      placeholder: t("inbox.modal.reject_placeholder"),
      confirmLabel: t("inbox.modal.reject_confirm"),
    },
    reReview: {
      title: t("inbox.modal.re_review_title"),
      hasMemo: true,
      description: t("inbox.modal.re_review_desc"),
      placeholder: t("inbox.modal.re_review_placeholder"),
      confirmLabel: t("inbox.modal.re_review_confirm"),
    },
    delete: {
      title: t("inbox.modal.delete_title"),
      hasMemo: true,
      memoRequired: true,
      maxLength: 30,
      description: t("inbox.modal.delete_desc"),
      placeholder: t("inbox.modal.delete_placeholder"),
      confirmLabel: t("inbox.modal.delete_confirm"),
    },
  };

  const config = MODAL_CONFIG[actionType];
  if (!config) return null;

  const handleClose = () => {
    setMemo("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(config.hasMemo ? memo : undefined);
    setMemo("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false} className="min-w-150 gap-0 p-0">
        {/* 헤더 */}
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-100 px-8 py-6">
          <DialogTitle className="text-2xl font-bold text-gray-700">
            {config.title}
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
        <div className="px-8 py-6">
          {config.hasMemo ? (
            <>
              <p className="mb-3 text-base text-gray-500">
                {config.description}
              </p>
              <div className="relative rounded border border-gray-200">
                <textarea
                  value={memo}
                  onChange={(e) =>
                    setMemo(e.target.value.slice(0, config.maxLength ?? MAX_MEMO_LENGTH))
                  }
                  placeholder={config.placeholder}
                  rows={8}
                  className="w-full resize-none rounded border border-gray-100 px-4 py-3 text-base text-gray-700 outline-none placeholder:text-gray-300"
                />
                <span className="absolute right-4 bottom-3 text-sm text-gray-400">
                  {memo.length} / {config.maxLength ?? MAX_MEMO_LENGTH}
                </span>
              </div>
            </>
          ) : (
            <p className="text-base text-gray-500">
              {t("inbox.modal.approve_desc")}
            </p>
          )}
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
            disabled={config.memoRequired && !memo.trim()}
            className="bg-primary-navy flex-1 rounded py-2 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {config.confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
