import { useTranslation } from "react-i18next";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import FileOutlineIcon from "@/assets/icons/file-outline-icon.svg?react";

function SourceDataCard({ data, onPrev, onNext }) {
  const { t } = useTranslation();

  const FIELDS = [
    { label: t("reg.manual.item_name"), key: "normalized_item_name" },
    { label: t("common.spec"), key: "spec" },
    { label: t("common.unit_label"), key: "unit" },
    {
      label: t("detail.existing_unit_price"),
      key: "price_before",
      format: (v) => `₩${formatNumber(v)}`,
    },
    {
      label: t("detail.changed_unit_price"),
      key: "price_after",
      format: (v) => `₩${formatNumber(v)}`,
    },
    { label: t("inbox.table.applied_date"), key: "effective_date" },
  ];

  const { source_ref, current_index, total } = data;

  return (
    <section className="flex min-w-130 flex-col">
      <h2 className="mb-4 text-[20px] font-bold text-gray-700">
        {t("detail.section_original_evidence")}
      </h2>

      <div className="bg-surface-200 flex flex-1 flex-col rounded-lg border border-gray-100 p-6">
        {/* 파일 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            <FileOutlineIcon className="size-6" />
            <span className="max-w-50 overflow-clip text-[18px] text-nowrap text-ellipsis">
              {source_ref.file_name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[18px] text-gray-500">
              {current_index}
              <span className="text-gray-300"> /{total}</span>
            </span>
            <button
              onClick={onPrev}
              className="flex size-6 items-center justify-center rounded-xs border-2 border-gray-100 text-gray-500 hover:bg-gray-50"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              onClick={onNext}
              className="flex size-6 items-center justify-center rounded-xs border-2 border-gray-100 text-gray-500 hover:bg-gray-50"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <dl className="flex-1 rounded-md border border-gray-100 bg-white">
          <div className="grid grid-cols-[1fr_1fr] border-b border-gray-100 px-6 py-4">
            <dt className="text-[18px] font-bold text-gray-500">{t("detail.field_name")}</dt>
            <dd className="text-[18px] font-bold text-gray-500">
              {t("detail.original_value")}
            </dd>
          </div>

          {FIELDS.map(({ label, key, format }) => (
            <div
              key={key}
              className="grid grid-cols-[1fr_1fr] px-6 pt-3 last:py-3"
            >
              <dt className="text-[18px] font-bold text-gray-500">{label}</dt>
              <dd className="text-[18px] text-gray-500">
                {format ? format(data[key]) : (data[key] ?? "—")}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default SourceDataCard;
