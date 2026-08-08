import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OcrDocumentIcon from "@/assets/icons/ocr-document-icon.svg?react";
import OcrScanIcon from "@/assets/icons/ocr-scan-icon.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import CheckIcon from "@/assets/icons/check-icon.svg?react";
import ErrorCircleIcon from "@/assets/icons/error-circle-icon.svg?react";
import SuccessCircleIcon from "@/assets/icons/success-circle-icon.svg?react";
import LineArrowRightIcon from "@/assets/icons/line-arrow-right-icon.svg?react";
import { cn } from "@/lib/utils";

const UPLOAD_NOTICE = [
    "원본 행 번호와 파일명을 자동으로 함께 저장합니다.",
    "필수 필드가 비어 있으면 “확인 필요”로 표시하고 대기 이유를 남깁니다.",
    '동일 공급사·품목·규격·단가·적용일 조합은 "중복 의심”으로 분류합니다.',
    "결과를 미리 입력해 두지 않고, 매 업로드마다 새로 판정합니다.",
];

const ALLOWED_EXTENSIONS = ["xlsx", "csv"];

function getExtension(fileName) {
    return fileName.split(".").pop().toLowerCase();
}

function formatUploadTime(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function FileUploadSection({ onGoToManualEntry, initialFile }) {
    // uploadResult: null | { status: 'success' | 'error', fileName: string }
    const [uploadResult, setUploadResult] = useState(null);

    const handleFile = (file) => {
        if (!file) return;
        const ext = getExtension(file.name);
        const uploadedAt = new Date();

        if (ALLOWED_EXTENSIONS.includes(ext)) {
            setUploadResult({ status: "success", fileName: file.name, uploadedAt });
        } else {
            setUploadResult({ status: "error", fileName: file.name, uploadedAt });
        }
    };

    useEffect(() => {
        if (initialFile) {
            handleFile(initialFile);
        }
    }, [initialFile]);

    return (
        <>
            <div>
                <h4 className="mb-5 text-[28px] font-bold text-gray-700">
                    1. 파일 업로드
                </h4>
                <div className="flex items-stretch gap-4">
                    <FileUploader onFileSelected={handleFile} onGoToManualEntry={onGoToManualEntry} />
                    <FileNoticeBox />
                </div>
            </div>

            <RegisterResultBox uploadResult={uploadResult} onRetry={() => setUploadResult(null)} />
        </>
    );
}

function FileUploader({ onFileSelected, onGoToManualEntry }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        onFileSelected(file);
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        onFileSelected(file);
    };

    const handleOcrInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onGoToManualEntry?.();
        }
    };

    return (
        <div className="flex h-full w-2/3 flex-col rounded-lg border border-gray-100 bg-white p-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8 transition-colors",
                    isDragging ? "border-primary-navy bg-surface-100" : "border-gray-300",
                )}
            >
                <UploadIcon />
                <p className="text-[28px] font-bold text-gray-700">
                    XLSX 또는 CSV 파일을 이곳에 드래그하세요
                </p>
                <span className="my-1 block text-[20px] text-gray-300">또는</span>

                <label className="rounded-sm border-2 border-gray-100 px-4 py-1.5 text-[22px] text-gray-500">
                    파일 선택
                    <input type="file" accept=".xlsx,.csv" className="hidden" onChange={handleInputChange} />
                </label>

                <span className="text-[20px] text-gray-300">
                    지원 형식 : xlsx, csv ...
                </span>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
                <OcrFileSelect onFileSelected={handleOcrInputChange} />
            </div>
        </div>
    );
}

function OcrFileSelect({ onFileSelected }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <OcrDocumentIcon className="size-6 text-gray-500" />
                <div>
                    <p className="text-lg font-bold text-gray-700">
                        이미지 또는 PDF 파일에서 텍스트 인식
                    </p>
                    <p className="text-xs text-gray-500">
                        이미지 또는 PDF 파일을 업로드하면 텍스트를 추출하여 수기 등록 폼에 자동 입력합니다.
                    </p>
                </div>
            </div>

            <label className="flex shrink-0 items-center gap-2 rounded-sm border-2 border-gray-100 px-4 py-2 text-sm font-semibold text-gray-500">
                <OcrScanIcon className="size-6" />
                파일 선택
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={onFileSelected}
                />
            </label>
        </div>
    );
}

function FileNoticeBox() {
    return (
        <div className="flex h-full w-1/3 flex-col rounded-lg border-4 border-primary-gold bg-white px-6 py-8">
            <h4 className="mb-5 text-[28px] font-bold text-gray-700">
                업로드 전 확인
            </h4>

            <ul className="flex flex-col gap-4">
                {UPLOAD_NOTICE.map((notice, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                        <CheckIcon className="size-6" />
                        <p className="text-[20px] text-gray-500">{notice}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function RegisterResultBox({ uploadResult, onRetry }) {
    const navigate = useNavigate();

    if (!uploadResult) {
        return null;
    }

    const { status, fileName, uploadedAt } = uploadResult;

    return (
        <div className="my-8 rounded-lg border border-gray-100 bg-white p-7">
            <div className="flex gap-2">
                {status === "error" && <ErrorCircleIcon className="size-6" />}
                {status === "success" && <SuccessCircleIcon className="size-6" />}

                <div className="flex w-full flex-col">
                    <div className="mb-2 flex w-full items-center justify-between">
                        <p
                            className={cn(
                                "text-[28px] font-bold",
                                status === "error" && "text-state-error",
                                status === "success" && "text-state-success",
                            )}
                        >
                            {status === "error" && "업로드 실패"}
                            {status === "success" && "업로드 성공"}
                        </p>

                        <span className="text-[20x] text-gray-300">
                            {uploadedAt ? formatUploadTime(uploadedAt) : "-"}
                        </span>
                    </div>

                    <span className="text-[20px] text-gray-300">파일명: {fileName ?? "-"}</span>

                    {status === "error" && (
                        <div className="flex items-center justify-between">
                            <p className="text-[20x] text-state-error">
                                지원되지 않는 파일 형식입니다. xlsx 또는 csv 파일만 업로드
                                가능합니다.
                            </p>

                            <button
                                type="button"
                                onClick={onRetry}
                                className="border-primary-navy rounded-sm border px-4 py-2 text-[24px] text-gray-500"
                            >
                                다시 시도
                            </button>
                        </div>
                    )}

                    {status === "success" && (
                        <>
                            <div className="mt-3 rounded-lg border border-gray-100">
                                <p className="border-b border-gray-100 p-6 text-[24px] font-bold text-gray-500">
                                    파싱 결과 요약
                                </p>

                                <div className="mb-6 flex w-full items-center justify-around py-">
                                    <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[20px]">
                                        <p>총 건수</p>
                                        <div>
                                            <span className="text-[28px] font-bold">-</span>건
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[20px]">
                                        <p>정상 건수</p>
                                        <div>
                                            <span className="text-[28px] font-bold text-state-success">-</span>건
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[20px]">
                                        <p>예약 건수</p>
                                        <div>
                                            <span className="text-[28px] font-bold text-state-warning">-</span>건
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="my-3 text-[20px] text-gray-500">
                                예외/오류 데이터는 인박스에서 확인 및 검수해주세요.
                            </p>

                            <button
                                onClick={() => navigate("/inbox")}
                                className="bg-primary-navy flex w-full items-center justify-center gap-4 rounded-lg py-4 transition-opacity hover:opacity-90"
                            >
                                <span className="text-surface-100 text-[22px] font-bold">
                                    인박스로 이동
                                </span>
                                <LineArrowRightIcon />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}