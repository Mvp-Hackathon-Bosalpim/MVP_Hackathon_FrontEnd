import { useState } from "react";
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
  // { type: 'approve' | 'reject' | 'reReview', target: 'bulk' | 'selected' } | null
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
              총 {formatNumber(totalElements)}건
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
          재검토
        </button>
        <button
          type="button"
          onClick={() => openModal("approve", "bulk")}
          className="text-surface-100 bg-primary-navy flex w-40 items-center justify-center rounded-sm p-0 py-3 text-[22px] font-bold"
        >
          일괄 승인
        </button>
        <button
          type="button"
          onClick={() => openModal("approve", "selected")}
          disabled={!hasSelection}
          className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          선택 항목 승인
        </button>
        <button
          type="button"
          onClick={() => openModal("reject", "bulk")}
          className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px]"
        >
          일괄 반려
        </button>
        <button
          type="button"
          onClick={() => openModal("reject", "selected")}
          disabled={!hasSelection}
          className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          선택 항목 반려
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
