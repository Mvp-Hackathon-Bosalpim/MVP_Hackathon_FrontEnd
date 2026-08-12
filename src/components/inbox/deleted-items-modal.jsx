import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Pagination from "@/components/ui/export-pagination";
import useDeletedItems from "@/hooks/queries/inbox/use-deleted-items";
import { cn, formatNumber } from "@/lib/utils";

const PAGE_SIZE_DEFAULT = 20;

const DELETED_BADGE = {
  dot: "bg-gray-400",
  text: "text-gray-600",
  label: "삭제",
};

function SourceTypeBadge({ sourceType }) {
  return (
    <div className="text-surface-100 bg-primary-navy inline rounded-md px-4 py-2 text-center font-bold">
      {sourceType}
    </div>
  );
}

function DeletedStatusBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#DEE1E5] px-4 py-1">
      <span className={cn("size-2.5 rounded-full", DELETED_BADGE.dot)} />
      <span className={cn("text-[18px] font-bold", DELETED_BADGE.text)}>
        {DELETED_BADGE.label}
      </span>
    </div>
  );
}

/**
 * @typedef {Object} DeletedItemsModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 */

/** @param {DeletedItemsModalProps} props */
function DeletedItemsModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const {
    data: allItems = [],
    isPending,
    isError,
  } = useDeletedItems({ enabled: isOpen });

  const totalElements = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const visibleItems = allItems.slice((page - 1) * pageSize, page * pageSize);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const handleClose = () => {
    setPage(1);
    setPageSize(PAGE_SIZE_DEFAULT);
    onClose();
  };

  const TABLE_HEADS = [
    t("inbox.table.document"),
    t("inbox.table.original"),
    t("inbox.filter.supplier"),
    t("inbox.table.item"),
    t("inbox.table.spec_unit"),
    t("inbox.table.changed_unit_price"),
    t("inbox.table.applied_date"),
    t("common.status"),
    t("inbox.table.delete_reason"),
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false} className="min-w-300 gap-0 p-0">
        <DialogHeader className="flex-row items-center justify-between border-b border-gray-100 px-8 py-6">
          <DialogTitle className="text-2xl font-bold text-gray-700">
            {t("inbox.deleted_list.title")}
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

        <div className="max-h-125 overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="border-b border-gray-100">
                {TABLE_HEADS.map((head) => (
                  <th
                    key={head}
                    className="h-14 px-4 text-left text-base font-bold text-gray-500"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isPending && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-300">
                    {t("inbox.loading")}
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-300">
                    {t("inbox.load_error")}
                  </td>
                </tr>
              )}
              {!isPending && !isError && visibleItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-300">
                    {t("inbox.deleted_list.empty")}
                  </td>
                </tr>
              )}
              {!isPending &&
                !isError &&
                visibleItems.map((item) => (
                  <tr key={item.id} className="h-18 border-t border-gray-100">
                    {/* 문서 */}
                    <td className="pl-4 text-base text-gray-700">
                      {item.doc_id}
                    </td>

                    {/* 원본 */}
                    <td className="pl-4">
                      <SourceTypeBadge sourceType={item.source_type} />
                    </td>

                    {/* 공급사 */}
                    <td className="pl-4 text-base text-gray-700">
                      {item.supplier_name}
                    </td>

                    {/* 품목 */}
                    <td className="pl-4">
                      <span className="text-base font-bold text-gray-700">
                        {item.normalized_item_name}
                      </span>
                    </td>

                    {/* 규격/단위 */}
                    <td className="pl-4">
                      <span className="text-base font-bold text-gray-700">
                        {item.spec ?? "—"}
                      </span>
                    </td>

                    {/* 변경단가 */}
                    <td className="pl-4">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-gray-700">
                          ₩{formatNumber(item.price_after)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ₩{formatNumber(item.price_before)}
                        </span>
                      </div>
                    </td>

                    {/* 적용일 */}
                    <td className="pl-4 text-base text-gray-700">
                      {item.effective_date ?? "—"}
                    </td>

                    {/* 상태 */}
                    <td className="pl-4">
                      <DeletedStatusBadge />
                    </td>

                    {/* 삭제 이유 */}
                    <td className="max-w-80 px-4 py-2 text-base text-gray-500">
                      {item.memo ?? "—"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            leftSlot={
              <span className="text-[20px] text-gray-500">
                {t("inbox.deleted_list.total", {
                  count: formatNumber(totalElements),
                })}
              </span>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeletedItemsModal;
