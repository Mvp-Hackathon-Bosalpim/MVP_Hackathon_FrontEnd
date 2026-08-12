import { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { cn, formatNumber } from "@/lib/utils";
import MappingInput from "./mapping-input";
import ImagesIcon from "@/assets/icons/images-icon.svg?react";

const MappingEditCard = forwardRef(function MappingEditCard(
  { data, exceptionFlags = [], onSubmit },
  ref,
) {
  const { t } = useTranslation();
  const { docId } = useParams();
  const isDuplicate = exceptionFlags.includes("DUPLICATE_SUSPECTED");

  const MAPPING_FIELDS = [
    {
      label: t("reg.manual.item_name"),
      rawKey: "normalized_item_name",
      valueKey: "normalized_item_name",
      required: true,
    },
    {
      label: t("common.spec"),
      rawKey: "spec",
      valueKey: "spec",
      required: true,
    },
    {
      label: t("common.unit_label"),
      rawKey: "unit",
      valueKey: "unit",
      required: true,
    },
    {
      label: t("detail.existing_unit_price"),
      rawKey: "price_before",
      valueKey: "price_before",
      required: true,
      format: (v) => (v != null ? `₩${formatNumber(v)}` : null),
    },
    {
      label: t("detail.changed_unit_price"),
      rawKey: "price_after",
      valueKey: "price_after",
      required: true,
      format: (v) => (v != null ? `₩${formatNumber(v)}` : null),
    },
    {
      label: t("inbox.table.applied_date"),
      rawKey: "effective_date",
      valueKey: "effective_date",
      required: true,
      mask: "date",
    },
  ];

  function validate(formValues) {
    const errors = {};
    MAPPING_FIELDS.forEach(({ label, valueKey, required }) => {
      if (required && !String(formValues[valueKey] ?? "").trim()) {
        errors[valueKey] = t("detail.please_enter_value", { field: label });
      }
    });
    return errors;
  }

  function initFormValues(d) {
    return Object.fromEntries(
      MAPPING_FIELDS.map(({ valueKey }) => [valueKey, d[valueKey] ?? ""]),
    );
  }

  const [savedValues, setSavedValues] = useState(() => initFormValues(data));
  const [formValues, setFormValues] = useState(() => initFormValues(data));

  // exception_flags → 필드별 경고 메시지 (검증 에러보다 낮은 우선순위)
  const FLAG_FIELD_MAP = {
    SPEC_MISMATCH: { valueKey: "spec", message: t("exception.SPEC_MISMATCH") },
    UNIT_MISMATCH: { valueKey: "unit", message: t("exception.UNIT_MISMATCH") },
  };

  const flagFieldErrors = exceptionFlags.reduce((acc, flag) => {
    const mapping = FLAG_FIELD_MAP[flag];
    if (mapping) acc[mapping.valueKey] = mapping.message;
    return acc;
  }, {});

  const errors = validate(formValues);
  const hasErrors = Object.keys(errors).length > 0;
  const isDirty = MAPPING_FIELDS.some(
    ({ valueKey }) =>
      String(formValues[valueKey] ?? "") !==
      String(savedValues[valueKey] ?? ""),
  );

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasErrors) return;
    onSubmit?.(formValues);
  };

  useImperativeHandle(ref, () => ({
    save: () => {
      if (!hasErrors) onSubmit?.(formValues);
    },
    resetTo: (values) => setSavedValues(values),
  }));

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-gray-700">
          {t("detail.section_mapping_editing")}
        </h2>
        {isDuplicate && (
          <Link
            to={`/inbox/${docId}/duplication`}
            className="bg-primary-navy flex items-center gap-2 rounded-md px-4 py-2 text-[18px] font-bold text-white"
          >
            <ImagesIcon className="size-5" />
            {t("detail.check_duplicate")}
          </Link>
        )}
      </div>

      <div className="bg-surface-200 rounded-lg border border-gray-100 p-4">
        <form
          className="rounded-lg border border-gray-100 bg-white"
          onSubmit={handleSubmit}
        >
          <dl>
            {/* 헤더 행 */}
            <div className="grid grid-cols-[160px_1fr_1fr] border-b border-gray-100 px-6 py-4">
              <dt className="text-[18px] font-bold text-gray-500">
                {t("detail.field_name")}
              </dt>
              <dd className="text-[18px] font-bold text-gray-500">
                {t("detail.original_value")}
              </dd>
              <dd className="text-[18px] font-bold text-gray-500">
                {t("detail.mapped_edited_value")}
              </dd>
            </div>

            {/* 필드 행 */}
            {MAPPING_FIELDS.map(({ label, rawKey, valueKey, format, mask }) => {
              const rawDisplay = format
                ? (format(data[rawKey]) ?? "-")
                : (data[rawKey] ?? "-");

              return (
                <div
                  key={valueKey}
                  className="grid grid-cols-[160px_1fr_1fr] items-center px-6 pt-2"
                >
                  <dt className="text-[18px] font-bold text-gray-500">
                    {label}
                  </dt>
                  <dd className="text-[18px] text-gray-500">{rawDisplay}</dd>
                  <dd>
                    <MappingInput
                      mask={mask}
                      value={formValues[valueKey]}
                      onChange={(val) => handleChange(valueKey, val)}
                      placeholder={t("detail.please_enter_value", {
                        field: label,
                      })}
                      error={errors[valueKey] ?? flagFieldErrors[valueKey]}
                    />
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="flex justify-end p-6">
            <button
              type="submit"
              disabled={hasErrors || !isDirty}
              className={cn(
                "rounded-lg px-8 py-2 text-[18px] font-bold text-white transition-opacity",
                hasErrors || !isDirty
                  ? "bg-primary-navy cursor-not-allowed opacity-40"
                  : "bg-primary-navy cursor-pointer",
              )}
            >
              {t("detail.save")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
});

export default MappingEditCard;
