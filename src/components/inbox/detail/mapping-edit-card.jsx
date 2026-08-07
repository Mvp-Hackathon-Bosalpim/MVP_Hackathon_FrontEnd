import { useState } from "react";
import { cn, formatNumber } from "@/lib/utils";
import MappingInput from "./mapping-input";

const MAPPING_FIELDS = [
  {
    label: "품목명",
    rawKey: "raw_item_name",
    valueKey: "normalized_item_name",
    required: true,
  },
  { label: "규격", rawKey: "spec", valueKey: "spec", required: true },
  { label: "단위", rawKey: "unit", valueKey: "unit", required: true },
  {
    label: "기존 단가",
    rawKey: "price_before",
    valueKey: "price_before",
    required: true,
    format: (v) => (v != null ? `₩${formatNumber(v)}` : null),
  },
  {
    label: "변경 단가",
    rawKey: "price_after",
    valueKey: "price_after",
    required: true,
    format: (v) => (v != null ? `₩${formatNumber(v)}` : null),
  },
  {
    label: "적용일",
    rawKey: "effective_date",
    valueKey: "effective_date",
    required: true,
  },
];

function validate(formValues) {
  const errors = {};
  MAPPING_FIELDS.forEach(({ label, valueKey, required }) => {
    if (required && !String(formValues[valueKey] ?? "").trim()) {
      errors[valueKey] = `필수값 누락: ${label}을 입력해주세요.`;
    }
  });
  return errors;
}

function initFormValues(data) {
  return Object.fromEntries(
    MAPPING_FIELDS.map(({ valueKey }) => [valueKey, data[valueKey] ?? ""]),
  );
}

function MappingEditCard({ data, onSubmit }) {
  const initialValues = useState(() => initFormValues(data))[0];
  const [formValues, setFormValues] = useState(() => initFormValues(data));

  const errors    = validate(formValues);
  const hasErrors = Object.keys(errors).length > 0;
  const isDirty   = MAPPING_FIELDS.some(
    ({ valueKey }) => String(formValues[valueKey] ?? "") !== String(initialValues[valueKey] ?? ""),
  );

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasErrors) return;
    onSubmit?.(formValues);
  };

  return (
    <section className="w-full">
      <h2 className="mb-4 text-[20px] font-bold text-gray-700">
        2. 매핑 및 수정
      </h2>

      <div className="bg-surface-200 rounded-lg border border-gray-100 p-4">
        <form
          className="rounded-lg border border-gray-100 bg-white"
          onSubmit={handleSubmit}
        >
          <dl>
            {/* 헤더 행 */}
            <div className="grid grid-cols-[160px_1fr_1fr] border-b border-gray-100 px-6 py-4">
              <dt className="text-[18px] font-bold text-gray-500">필드명</dt>
              <dd className="text-[18px] font-bold text-gray-500">
                원본 값(관찰값)
              </dd>
              <dd className="text-[18px] font-bold text-gray-500">
                매핑/수정 값
              </dd>
            </div>

            {/* 필드 행 */}
            {MAPPING_FIELDS.map(({ label, rawKey, valueKey, format }) => {
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
                      value={formValues[valueKey]}
                      onChange={(val) => handleChange(valueKey, val)}
                      placeholder={`${label}을 입력해주세요.`}
                      error={errors[valueKey]}
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
              저장하기
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default MappingEditCard;
