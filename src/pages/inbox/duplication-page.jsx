import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDocument from "@/hooks/queries/inbox/use-document";
import useDuplicateGroup from "@/hooks/queries/inbox/use-duplicate-group";
import Pagination from "@/components/ui/export-pagination";
import { formatNumber, formatDateTime } from "@/lib/utils";
import LeftIcon from "@/assets/icons/left-icon.svg?react";

function SourceTypeBadge({ sourceType }) {
  return (
    <span
      className={`bg-primary-navy rounded-md px-4 py-2 text-base font-bold text-white`}
    >
      {sourceType ?? "-"}
    </span>
  );
}

function DuplicationPage() {
  const { docId } = useParams();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const {
    data: doc,
    isPending: docPending,
    isError: docError,
  } = useDocument(docId);
  const groupId = doc?.duplicate_group;

  const {
    data: groupData,
    isPending: groupPending,
    isError: groupError,
  } = useDuplicateGroup(groupId, { page: page - 1, size: pageSize });

  const duplicateItems = groupData?.content ?? [];
  const totalPages = groupData?.total_pages ?? 1;

  if (docPending) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-300">
        {t("common.loading")}
      </div>
    );
  }

  if (docError || !doc) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-300">
        {t("inbox.load_error")}
      </div>
    );
  }

  const createdAt = doc.change_log?.[0]?.at;

  return (
    <div className="px-20 py-10">
      <Link
        to={`/inbox/${docId}`}
        className="mb-6 flex items-center font-bold text-gray-500"
      >
        <LeftIcon />
        {t("detail.back_to_list")}
      </Link>

      <h1 className="mb-1 text-3xl font-bold text-gray-700">
        {t("duplication.title")}
      </h1>
      <p className="mb-8 text-lg text-gray-500">{t("duplication.desc")}</p>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        {/* 현재 품목 */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="mb-4 text-lg font-bold text-gray-700">
            {t("duplication.current_item")}
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-100 border-b border-gray-100">
                  {[
                    t("reg.manual.item_name"),
                    t("inbox.filter.supplier"),
                    t("common.spec"),
                    t("common.unit_label"),
                    t("detail.existing_unit_price"),
                    t("duplication.created_at"),
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-base font-bold text-gray-600"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {doc.normalized_item_name ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {doc.supplier_name ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{doc.spec ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-500">{doc.unit ?? "-"}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {doc.price_before != null
                      ? `₩${formatNumber(doc.price_before)}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDateTime(createdAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 중복 품목 목록 */}
        <div className="px-6 pb-4">
          <h2 className="mb-4 text-lg font-bold text-gray-700">
            {t("duplication.duplicate_list")}
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-100 border-b border-gray-100">
                  {[
                    t("duplication.no"),
                    t("reg.manual.item_name"),
                    t("inbox.filter.supplier"),
                    t("common.spec"),
                    t("common.unit_label"),
                    t("detail.existing_unit_price"),
                    t("duplication.source_file"),
                    t("duplication.created_at"),
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 text-left text-base font-bold text-gray-600"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupPending && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-300">
                      {t("common.loading")}
                    </td>
                  </tr>
                )}
                {groupError && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-300">
                      {t("inbox.load_error")}
                    </td>
                  </tr>
                )}
                {!groupPending && duplicateItems.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-300">
                      {t("common.no_items")}
                    </td>
                  </tr>
                )}
                {duplicateItems.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {(page - 1) * pageSize + i + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {item.normalized_item_name ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.supplier_name ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.spec ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.unit ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.price_before != null
                        ? `₩${formatNumber(item.price_before)}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <SourceTypeBadge sourceType={item.source_type} />
                        <span className="max-w-48 overflow-hidden text-nowrap text-ellipsis text-gray-500">
                          {item.doc_id ?? "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.effective_date ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 + 닫기 */}
        <div className="border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={() => {}}
            leftSlot={
              <Link
                to={`/inbox/${docId}`}
                className="rounded border border-gray-200 px-8 py-2 text-base text-gray-500 transition-colors hover:bg-gray-50"
              >
                {t("duplication.close")}
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default DuplicationPage;
