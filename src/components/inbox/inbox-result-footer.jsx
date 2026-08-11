import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Pagination from "../ui/export-pagination";
import InboxActionModal from "./inbox-action-modal";
import { Checkbox } from "../ui/checkbox";
import useBulkApprove from "@/hooks/mutations/inbox/use-bulk-approve";
import useBulkReject from "@/hooks/mutations/inbox/use-bulk-reject";
import useBulkReReview from "@/hooks/mutations/inbox/use-bulk-re-review";
import useBulkDelete from "@/hooks/mutations/inbox/use-bulk-delete";
import InboxExportModal from "./inbox-export-modal";
import DeletedItemsModal from "./deleted-items-modal";

/**
 * @typedef {Object} InboxResultFooterProps
 * @property {number} selectedCount
 * @property {boolean} isAllSelected
 * @property {() => void} onSelectAll
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
  selectedCount,
  isAllSelected,
  onSelectAll,
  currentPage,
  onPageChange,
  onPageSizeChange,
  totalPages,
  pageSize,
  hasSelection,
  selectedIds,
  contentIds,
  onActionSuccess,
}) {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deletedModalOpen, setDeletedModalOpen] = useState(false);

  const bulkApprove = useBulkApprove();
  const bulkReject = useBulkReject();
  const bulkReReview = useBulkReReview();
  const bulkDelete = useBulkDelete();

  const handleConfirm = (memo) => {
    const { type, target } = modalState;
    const ids = target === "selected" ? selectedIds : contentIds;
    const body = { ids, ...(memo && { memo }) };

    const mutationMap = {
      approve: bulkApprove,
      reject: bulkReject,
      reReview: bulkReReview,
      delete: bulkDelete,
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
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllSelected}
                onClick={onSelectAll}
                className="size-6 border-gray-700 data-checked:bg-gray-700"
              />
              <span className="text-[20px] text-gray-500">
                {selectedCount}개 선택됨
              </span>
              <button
                type="button"
                onClick={() => openModal("delete", "selected")}
                disabled={!hasSelection || bulkDelete.isPending}
                className="flex items-center gap-2 border border-gray-100 px-4 py-2 text-base disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="size-4" />
                선택 삭제
              </button>
              <button
                type="button"
                onClick={() => setDeletedModalOpen(true)}
                className="flex items-center gap-2 border border-gray-100 px-4 py-2 text-base"
              >
                {t("inbox.deleted_list.title")}
              </button>
            </div>
          }
        />
      </div>

      <div className="flex items-center justify-end gap-3 px-4 pb-4">
        <button
          type="button"
          onClick={() => openModal("approve", "selected")}
          disabled={!hasSelection}
          className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-base disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("inbox.action.approve_selected")}
        </button>

        <button
          type="button"
          onClick={() => openModal("reject", "selected")}
          disabled={!hasSelection}
          className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-base disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("inbox.action.reject_selected")}
        </button>

        <button
          type="button"
          onClick={() => setExportModalOpen(true)}
          className="bg-primary-navy text-surface-100 flex w-40 items-center justify-center rounded-sm p-0 py-3 text-base font-bold"
        >
          {t("export.confirm")}
        </button>
      </div>

      <InboxExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />

      <DeletedItemsModal
        isOpen={deletedModalOpen}
        onClose={() => setDeletedModalOpen(false)}
      />

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
