// components/ui/manual-entry-section.jsx
import { useState } from "react";
import TrashIcon from "@/assets/icons/trash-icon.svg?react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const TABLE_HEADERS = [
    "공급사",
    "품목명",
    "단가 (원)",
    "규격",
    "수량",
    "공급가액 (원)",
    "부가세 (원)",
    "공급일자",
    "비고",
    "삭제",
];

const EMPTY_ROW = {
    공급사: "",
    품목명: "",
    단가: "",
    규격: "",
    수량: "",
    공급일자: "",
    비고: "",
};
const REQUIRED_FIELDS = ["공급사", "품목명", "단가", "규격", "수량", "공급일자"];

function isRowComplete(row) {
    return REQUIRED_FIELDS.every((field) => String(row[field] ?? "").trim() !== "");
}

function ManualEntrySection() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);

    const [submitAttempted, setSubmitAttempted] = useState(false);

    const incompleteIndexes = rows.reduce((acc, row, idx) => {
        if (!isRowComplete(row)) acc.add(idx);
        return acc;
    }, new Set());

    const handleSubmit = () => {
        setSubmitAttempted(true);
        if (incompleteIndexes.size > 0) return;
        navigate("/inbox");
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

    const getSupplyAmount = (row) =>
        (parseFloat(row.단가) || 0) * (parseFloat(row.수량) || 0);

    const getVat = (row) => Math.round(getSupplyAmount(row) * 0.1);

    return (
        <div className="my-10">
            <div className="mb-5 flex items-center justify-between">
                <h4 className="text-[28px] font-bold text-gray-700">
                    2. 수기 등록 (파일이 없을 경우 직접 입력하세요)
                </h4>
                <button
                    onClick={addRow}
                    className="bg-primary-navy rounded-sm px-4 py-2 text-[20px] text-white"
                >
                    + 행 추가
                </button>
                {submitAttempted && incompleteIndexes.size > 0 && (
                    <p className="mb-2 text-[18px] text-[#AD211D]">
                        확인 필요: 필수 항목이 비어 있는 행이 있습니다. 붉은 테두리로 표시된 항목을 채워주세요.
                    </p>
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
                            <tr key={idx} className="border-b border-gray-100 last:border-0">
                                <td className="py-4 text-center text-gray-500">{idx + 1}</td>

                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.공급사}
                                        placeholder="공급사 입력"
                                        onChange={(v) => updateRow(idx, "공급사", v)}
                                        hasError={submitAttempted && !row.공급사?.trim()}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.품목명}
                                        placeholder="품목명 입력"
                                        onChange={(v) => updateRow(idx, "품목명", v)}
                                        hasError={submitAttempted && !row.품목명?.trim()}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.단가}
                                        placeholder="숫자만 입력"
                                        onChange={(v) => updateRow(idx, "단가", v)}
                                        hasError={submitAttempted && !row.단가?.trim()}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.규격}
                                        placeholder="규격 입력"
                                        onChange={(v) => updateRow(idx, "규격", v)}
                                        hasError={submitAttempted && !row.규격?.trim()}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.수량}
                                        placeholder="숫자만 입력"
                                        onChange={(v) => updateRow(idx, "수량", v)}
                                        hasError={submitAttempted && !row.수량?.trim()}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <input
                                        readOnly
                                        value={getSupplyAmount(row).toLocaleString()}
                                        className="bg-surface-200 w-full rounded border border-gray-100 px-2 py-1 text-center text-gray-500 outline-none"
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <input
                                        readOnly
                                        value={getVat(row).toLocaleString()}
                                        className="bg-surface-200 w-full rounded border border-gray-100 px-2 py-1 text-center text-gray-500 outline-none"
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.공급일자}
                                        placeholder="YYYY-MM-DD"
                                        onChange={(v) => updateRow(idx, "공급일자", formatDateInput(v))}
                                        hasError={submitAttempted && !row.공급일자?.trim()}
                                    />
                                </td>
                                <td className="px-2 py-3">
                                    <TableInput
                                        value={row.비고}
                                        placeholder="비고 입력"
                                        onChange={(v) => updateRow(idx, "비고", v)}
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
                    className="hover:bg-surface-100 rounded-sm border border-gray-100 px-6 py-2 text-[20px] text-gray-500 transition-colors"
                >
                    초기화
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-primary-navy rounded-sm px-6 py-2 text-[20px] text-white transition-opacity hover:opacity-90"
                >
                    등록하기
                </button>
            </div>
        </div>
    );
}

function TableInput({ value, placeholder, type = "text", onChange, hasError = false }) {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                "w-full rounded border px-2 py-1 text-center text-gray-500 placeholder-gray-500 outline-none",
                hasError ? "border-[#AD211D] bg-white" : "bg-surface-100 border-gray-100",
            )}
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