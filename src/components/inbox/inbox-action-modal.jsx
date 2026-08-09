import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_MEMO_LENGTH = 500;

const MODAL_CONFIG = {
  approve: {
    title: "승인 확인",
    hasMemo: true,
    description: "승인 사유를 입력해주세요. (500자)",
    placeholder: "승인 사유를 입력해주세요.",
    confirmLabel: "승인",
  },
  reject: {
    title: "반려 사유 입력",
    hasMemo: true,
    confirmLabel: "반려",
    description: "반려 사유를 입력해주세요. (500자)",
    placeholder: "반려 사유를 입력해주세요.",
  },
  reReview: {
    title: "재검토 사유 입력",
    hasMemo: true,
    confirmLabel: "재검토",
    description: "재검토 사유를 입력해주세요. (500자)",
    placeholder: "재검토 사유를 입력해주세요.",
  },
};

/**
 * @typedef {'approve' | 'reject' | 'reReview'} ActionType
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
  const [memo, setMemo] = useState("");

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
                    setMemo(e.target.value.slice(0, MAX_MEMO_LENGTH))
                  }
                  placeholder={config.placeholder}
                  rows={8}
                  className="w-full resize-none rounded border border-gray-100 px-4 py-3 text-base text-gray-700 outline-none placeholder:text-gray-300"
                />
                <span className="absolute right-4 bottom-3 text-sm text-gray-400">
                  {memo.length} / {MAX_MEMO_LENGTH}
                </span>
              </div>
            </>
          ) : (
            <p className="text-base text-gray-500">
              선택한 항목을 승인하시겠습니까?
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
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-primary-navy flex-1 rounded py-2 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {config.confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
