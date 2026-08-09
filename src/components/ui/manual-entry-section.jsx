import { useState } from "react";
import { useTranslation } from "react-i18next";
import TrashIcon from "@/assets/icons/trash-icon.svg?react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { createManualDocument } from "@/services/api/document";

const EMPTY_ROW = {
    공급사: "",
    품목명: "",
    규격: "",
    단위: "",
    변경전단가: "",
    변경후단가: "",
    적용일: "",
};
const ROW_FIELDS = ["공급사", "품목명", "규격", "단위", "변경전단가", "변경후단가", "적용일"];

function isRowEmpty(row) {
    return ROW_FIELDS.every((field) => String(row[field] ?? "").trim() === "");
}

function ManualEntrySection() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [rows, setRows] = useState([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);

    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const emptyIndexes = rows.reduce((acc, row, idx) => {
        if (isRowEmpty(row)) acc.add(idx);
        return acc;
    }, new Set());

    const handleSubmit = async () => {
        setSubmitAttempted(true);
        setSubmitError(null);
        if (emptyIndexes.size > 0) return;

        const items = rows.map((row) => ({
            spec: row.규격,
            unit: row.단위,
            supplier_name: row.공급사,
            raw_item_name: row.품목명,
            price_before: Number(row.변경전단가),
            price_after: Number(row.변경후단가),
            effective_date: row.적용일,
        }));

        setIsSubmitting(true);
        try {
            await createManualDocument(items);
            navigate("/inbox");
        } catch (err) {
            setSubmitError(err.response?.data?.message ?? t("reg.manual.register_failed_default"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const addRow = () => setRows((prev) => [...prev, { ...EMPTY_ROW }]);

    const deleteRow = (idx) =>
        setRows((prev) => prev.filter((_, i) => i !== idx));

    const updateRow = (idx, field, value) =>
        setRows((prev) =>
            prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)),
        );

    const reset = () => {
        setRows([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);
        setSubmitAttempted(false);
    };

    const TABLE_HEADERS = [
        t("reg.manual.supplier"),
        t("reg.manual.item_name"),
        t("common.spec"),
        t("common.unit_label"),
        t("detail.existing_unit_price"),
        t("detail.changed_unit_price"),
        t("inbox.table.applied_date"),
        t("reg.manual.delete"),
    ];

    return (
        <div className="mb-2">
            <div className="mb-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-[28px] font-bold text-gray-700">
                        2. {t("reg.manual.desc")}
                    </h4>
                    <button
                        onClick={addRow}
                        className="bg-primary-navy rounded-sm px-4 py-2 text-[20px] text-white"
                    >
                        + {t("reg.manual.add_row")}
                    </button>
                </div>
                {submitAttempted && emptyIndexes.size > 0 && (
                    <p className="text-[18px] text-state-error">
                        {t("reg.manual.empty_row_error")}
                    </p>
                )}
                {submitError && (
                    <p className="text-[18px] text-state-error">{submitError}</p>
                )}
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
                <table className="w-full border-collapse text-[18px]">
                    <thead>
                        <tr className="bg-surface-100 border-b border-gray-100">
                            <th className="w-12 py-1.5 text-center font-medium text-gray-500" />
                            {TABLE_HEADERS.map((header) => (
                                <th
                                    key={header}
                                    className="px-2 py-3 text-center font-medium text-gray-500"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr
                                key={idx}
                                className={cn(
                                    "border-b border-gray-100 last:border-0",
                                    submitAttempted && emptyIndexes.has(idx) && "bg-white outline outline-state-error -outline-offset-1",
                                )}
                            >
                                <td className="py-4 text-center text-gray-500">{idx + 1}</td>

                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.공급사}
                                        placeholder={t("reg.manual.supplier")}
                                        onChange={(v) => updateRow(idx, "공급사", v)}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.품목명}
                                        placeholder={t("reg.manual.item_name")}
                                        onChange={(v) => updateRow(idx, "품목명", v)}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.규격}
                                        placeholder={t("common.spec")}
                                        onChange={(v) => updateRow(idx, "규격", v)}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.단위}
                                        placeholder={t("common.unit_label")}
                                        onChange={(v) => updateRow(idx, "단위", v)}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.변경전단가}
                                        placeholder="0"
                                        onChange={(v) => updateRow(idx, "변경전단가", v)}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.변경후단가}
                                        placeholder="0"
                                        onChange={(v) => updateRow(idx, "변경후단가", v)}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.적용일}
                                        placeholder="YYYY-MM-DD"
                                        onChange={(v) => updateRow(idx, "적용일", formatDateInput(v))}
                                    />
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <button
                                        onClick={() => deleteRow(idx)}
                                        className="text-gray-300 transition-colors hover:text-gray-500"
                                    >
                                        <TrashIcon className="size-6" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end gap-3 py-4">
                <button
                    onClick={reset}
                    disabled={isSubmitting}
                    className="hover:bg-surface-100 rounded-sm border border-gray-100 px-6 py-2 text-[20px] text-gray-500 transition-colors disabled:opacity-50"
                >
                    {t("reg.manual.reset")}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary-navy rounded-sm px-6 py-2 text-[20px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isSubmitting ? t("common.registering") : t("reg.manual.register")}
                </button>
            </div>
        </div>
    );
}

function TableInput({ value, placeholder, type = "text", onChange }) {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="bg-surface-100 border-gray-100 w-full rounded border px-2 py-1 text-center text-gray-500 placeholder-gray-500 outline-none"
        />
    );
}

function formatDateInput(value) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

export default ManualEntrySection;
