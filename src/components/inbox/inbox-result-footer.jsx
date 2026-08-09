import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/lib/utils";
import Pagination from "../ui/export-pagination";
import InboxActionModal from "./inbox-action-modal";
import useBulkApprove from "@/hooks/mutations/inbox/use-bulk-approve";
import useBulkReject from "@/hooks/mutations/inbox/use-bulk-reject";
import useBulkReReview from "@/hooks/mutations/inbox/use-bulk-re-review";

/**
 * @typedef {Object} InboxResultFooterProps
 * @property {number} totalElements
 * @property {number} currentPage
 * @property {number} totalPages
 * @property {number} pageSize
 * @property {boolean} hasSelection
 * @property {number[]} selectedIds
 * @property {number[]} contentIds
 * @property {() => void} onActionSuccess
 * @property {(page: number) => void} onPageChange
 * @property {(size: number) => void} onPageSizeChange
 */

/** @param {InboxResultFooterProps} props */
function InboxResultFooter({
  currentPage,
  onPageChange,
  onPageSizeChange,
  totalElements,
  totalPages,
  pageSize,
  hasSelection,
  selectedIds,
  contentIds,
  onActionSuccess,
}) {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState(null);

  const bulkApprove = useBulkApprove();
  const bulkReject = useBulkReject();
  const bulkReReview = useBulkReReview();

  const handleConfirm = (memo) => {
    const { type, target } = modalState;
    const ids = target === "selected" ? selectedIds : contentIds;
    const body = { ids, ...(memo && { memo }) };

    const mutationMap = {
      approve: bulkApprove,
      reject: bulkReject,
      reReview: bulkReReview,
    };

    mutationMap[type].mutate(body, {
      onSuccess: () => {
        onActionSuccess?.();
        setModalState(null);
      },
    });
  };

  const openModal = (type, target) => setModalState({ type, target });

  return (
    <>
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          totalPages={totalPages}
          pageSize={pageSize}
          leftSlot={
            <span className="text-[20px] text-gray-500">
              {t("export.total_items", { count: formatNumber(totalElements) })}
            </span>
          }
        />
      </div>

      <div className="flex items-center justify-end gap-3 px-4 pb-4">
        <button
          type="button"
          onClick={() => openModal("reReview", "bulk")}
          className="text-surface-100 flex w-40 items-center justify-center rounded-sm bg-[#2C5691] p-0 py-3 text-[22px] font-bold"
        >
          {t("inbox.action.re_review")}
        </button>
        <button
          type="button"
          onClick={() => openModal("approve", "bulk")}
          className="text-surface-100 bg-primary-navy flex w-40 items-center justify-center rounded-sm p-0 py-3 text-[22px] font-bold"
        >
          {t("inbox.action.bulk_approve")}
        </button>
        <button
          type="button"
          onClick={() => openModal("approve", "selected")}
          disabled={!hasSelection}
          className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("inbox.action.approve_selected")}
        </button>
        <button
          type="button"
          onClick={() => openModal("reject", "bulk")}
          className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px]"
        >
          {t("inbox.action.bulk_reject")}
        </button>
        <button
          type="button"
          onClick={() => openModal("reject", "selected")}
          disabled={!hasSelection}
          className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("inbox.action.reject_selected")}
        </button>
      </div>

      <InboxActionModal
        isOpen={modalState !== null}
        onClose={() => setModalState(null)}
        onConfirm={handleConfirm}
        actionType={modalState?.type ?? "approve"}
      />
    </>
  );
}

export default InboxResultFooter;
