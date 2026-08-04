import { useState } from "react";
import DownloadIcon from "@/assets/icons/download-icon.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import CheckIcon from "@/assets/icons/check-icon.svg?react";
import ErrorCircleIcon from "@/assets/icons/error-circle-icon.svg?react";
import SuccessCircleIcon from "@/assets/icons/success-circle-icon.svg?react";
import TrashIcon from "@/assets/icons/trash-icon.svg?react";
import LineArrowRightIcon from "@/assets/icons/line-arrow-right-icon.svg?react";
import { cn } from "@/lib/utils";
const UPLOAD_NOTICE = [
  "원본 행 번호와 파일명을 자동으로 함께 저장합니다.",
  "필수 필드가 비어 있으면 “확인 필요”로 표시하고 대기 이유를 남깁니다.",
  '동일 공급사·품목·규격·단가·적용일 조합은 "중복 의심”으로 분류합니다.',
  "결과를 미리 입력해 두지 않고, 매 업로드마다 새로 판정합니다.",
];

function RegisterPage() {
  return (
    <section className="h-full w-full p-20">
      <header className="mb-4 flex items-center gap-4">
        <DownloadIcon />

        <div>
          <h2 className="text-4xl font-bold text-gray-700">증빙 데이터 등록</h2>
          <p className="text-2xl text-gray-500">
            파일 업로드 또는 수기 입력을 통해 증빙 데이터를 등록하세요.
          </p>
        </div>
      </header>

      <div>
        <h4 className="mb-5 text-[28px] font-bold text-gray-700">
          1. 파일 업로드
        </h4>
        <div className="flex h-90 items-center gap-4">
          {/* File Uploader */}
          <FileUploader />

          {/* Notice */}
          <FileNoticeBox />
        </div>
      </div>

      <RegisterResultBox />

      <ManualEntrySection />
    </section>
  );
}

export default RegisterPage;

function FileUploader() {
  return (
    <div className="flex h-full w-2/3 flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-gray-100 bg-white py-19">
      <UploadIcon />
      <p className="text-[28px] font-bold text-gray-700">
        XLSX 또는 CSV 파일을 이곳에 드래그하세요
      </p>
      <span className="my-1 block text-[24px] text-gray-300">또는</span>

      <label className="rounded-sm border-2 border-gray-100 px-4 py-1.5 text-[24px] text-gray-500">
        파일 선택
        <input type="file" className="hidden" />
      </label>

      <span className="text-[24px] text-gray-300">
        지원 형식 : xlsx, csv ...
      </span>
    </div>
  );
}

function FileNoticeBox() {
  return (
    <div className="h-full w-1/3 rounded-lg border-4 border-[#D5A548] bg-white px-6 py-5">
      <h4 className="mb-5 text-[28px] font-bold text-gray-700">
        업로드 전 확인
      </h4>

      <ul className="flex flex-col gap-4">
        {UPLOAD_NOTICE.map((notice, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <CheckIcon className="size-6" />
            <p className="text-lg text-gray-500">{notice}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RegisterResultBox() {
  // status : 'error' | 'success'

  const [status, setStatus] = useState("error");

  return (
    <div className="my-10 rounded-lg border border-gray-100 bg-white p-7">
      <div className="flex gap-3">
        {status === "error" && <ErrorCircleIcon className="size-6" />}
        {status === "success" && <SuccessCircleIcon className="size-6" />}

        <div className="flex w-full flex-col">
          <div className="mb-2 flex w-full items-center justify-between">
            <p
              className={cn(
                "text-[28px] font-bold",
                status === "error" && "text-[#AD211D]",
                status === "success" && "text-[#74996B]",
              )}
            >
              {status === "error" && "업로드 실패"}
              {status === "success" && "업로드 성공"}
            </p>

            <span className="text-[24px] text-gray-300">2026-00-00 00:00</span>
          </div>

          <span className="text-[24px] text-gray-300">
            파일명: qwertyuiopasdfghjkl
          </span>

          {status === "error" && (
            <div className="flex items-center justify-between">
              <p className="text-[24px] text-[#AD211D]">
                지원되지 않는 파일 형식입니다. xlsx 또는 csv 파일만 업로드
                가능합니다.
              </p>

              <button
                type="button"
                onClick={() => setStatus("success")}
                className="border-primary-navy rounded-sm border px-4 py-2 text-[24px] text-gray-500"
              >
                다시 시도
              </button>
            </div>
          )}

          {status === "success" && (
            <>
              <div className="mt-8 rounded-lg border border-gray-100">
                <p className="border-b border-gray-100 p-6 text-[24px] font-bold text-gray-500">
                  파싱 결과 요약
                </p>

                <div className="mb-6 flex w-full items-center justify-around py-10">
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[24px]">
                    <p>총 건수</p>
                    <div>
                      <span className="text-[28px] font-bold">20</span>건
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[24px]">
                    <p>정상 건수</p>
                    <div>
                      <span className="text-[28px] font-bold text-[#1E9800]">
                        16
                      </span>
                      건
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[24px]">
                    <p>예약 건수</p>
                    <div>
                      <span className="text-[28px] font-bold text-[#F07800]">
                        4
                      </span>
                      건
                    </div>
                  </div>
                </div>
              </div>

              <p className="my-6 text-[24px] text-gray-500">
                예외/오류 데이터는 인박스에서 확인 및 검수해주세요.
              </p>

              <div className="bg-primary-navy flex items-center justify-center gap-4 rounded-lg py-4">
                <span className="text-surface-100 text-[24px] font-bold">
                  인박스로 이동
                </span>
                <LineArrowRightIcon />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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

function ManualEntrySection() {
  const [rows, setRows] = useState([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);

  const addRow = () => setRows((prev) => [...prev, { ...EMPTY_ROW }]);

  const deleteRow = (idx) =>
    setRows((prev) => prev.filter((_, i) => i !== idx));

  const updateRow = (idx, field, value) =>
    setRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)),
    );

  const reset = () => setRows([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);

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
                  />
                </td>
                <td className="px-2 py-3">
                  <TableInput
                    value={row.품목명}
                    placeholder="품목명 입력"
                    onChange={(v) => updateRow(idx, "품목명", v)}
                  />
                </td>
                <td className="px-2 py-3">
                  <TableInput
                    value={row.단가}
                    placeholder="숫자만 입력"

                    onChange={(v) => updateRow(idx, "단가", v)}
                  />
                </td>
                <td className="px-2 py-3">
                  <TableInput
                    value={row.규격}
                    placeholder="규격 입력"
                    onChange={(v) => updateRow(idx, "규격", v)}
                  />
                </td>
                <td className="px-2 py-3">
                  <TableInput
                    value={row.수량}
                    placeholder="숫자만 입력"

                    onChange={(v) => updateRow(idx, "수량", v)}
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
                    onChange={(v) => updateRow(idx, "공급일자", v)}
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
        <button className="bg-primary-navy rounded-sm px-6 py-2 text-[20px] text-white transition-opacity hover:opacity-90">
          등록하기
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
      className="bg-surface-100 w-full rounded border border-gray-100 px-2 py-1 text-center text-gray-500 placeholder-gray-500 outline-none"
    />
  );
}
