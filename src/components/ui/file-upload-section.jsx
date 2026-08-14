import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OcrDocumentIcon from "@/assets/icons/ocr-document-icon.svg?react";
import OcrScanIcon from "@/assets/icons/ocr-scan-icon.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import CheckIcon from "@/assets/icons/check-icon.svg?react";
import ErrorCircleIcon from "@/assets/icons/error-circle-icon.svg?react";
import SuccessCircleIcon from "@/assets/icons/success-circle-icon.svg?react";
import LineArrowRightIcon from "@/assets/icons/line-arrow-right-icon.svg?react";
import FileOutlineIcon from "@/assets/icons/file-outline-icon.svg?react";
import { cn, formatNumber } from "@/lib/utils";
import useUploadDocument from "@/hooks/mutations/document/use-upload-document";
import usePreviewOcr from "@/hooks/mutations/document/use-preview-ocr";
import ConfirmModal from "@/components/ui/confirm-modal";

const ALLOWED_EXTENSIONS = ["xlsx", "csv", "jpg", "jpeg", "png", "pdf"];
const OCR_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"];

function getExtension(fileName) {
    return fileName.split(".").pop().toLowerCase();
}

function formatUploadTime(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function FileUploadSection({ initialFile }) {
    const { t } = useTranslation();
    const [uploadResult, setUploadResult] = useState(null);
    const { mutate: uploadDocument, isPending: isUploadingDocument } = useUploadDocument();
    const { mutate: previewOcr, isPending: isPreviewingOcr } = usePreviewOcr();
    const isUploading = isUploadingDocument || isPreviewingOcr;

    const handleFile = (file, forcedUploadType) => {
        if (!file || isUploading) return;
        const ext = getExtension(file.name);
        const uploadType = forcedUploadType ?? (OCR_EXTENSIONS.includes(ext) ? "ocr" : "file");
        const uploadedAt = new Date();

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            setUploadResult({ status: "error", fileName: file.name, uploadedAt, uploadType, errorMessage: t("reg.upload.unsupported_format") });
            return;
        }

        setUploadResult({ status: "processing", fileName: file.name, uploadedAt, uploadType, format: ext });

        if (uploadType === "ocr") {
            previewOcr(file, {
                onSuccess: (res) => {
                    setUploadResult({ status: "success", fileName: file.name, uploadedAt, uploadType, format: ext, ocrItems: res.data });
                },
                onError: (err) => {
                    setUploadResult({ status: "error", fileName: file.name, uploadedAt, uploadType, errorMessage: err.response?.data?.message ?? t("reg.upload.upload_failed_default") });
                },
            });
            return;
        }

        uploadDocument(file, {
            onSuccess: (res) => {
                const { total, normal, need_checked } = res.data;
                setUploadResult({ status: "success", fileName: file.name, uploadedAt, uploadType, format: ext, total, normal, needChecked: need_checked });
            },
            onError: (err) => {
                setUploadResult({ status: "error", fileName: file.name, uploadedAt, uploadType, errorMessage: err.response?.data?.message ?? t("reg.upload.upload_failed_default") });
            },
        });
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
                    1. {t("reg.tab.upload")}
                </h4>
                <div className="flex items-stretch gap-4">
                    {uploadResult?.status === "processing" ? (
                        <ProcessingBox fileName={uploadResult.fileName} format={uploadResult.format} uploadedAt={uploadResult.uploadedAt} />
                    ) : uploadResult?.status === "success" && uploadResult?.uploadType === "ocr" ? (
                        <OcrCompleteBox fileName={uploadResult.fileName} format={uploadResult.format} uploadedAt={uploadResult.uploadedAt} />
                    ) : (
                        <FileUploader onFileSelected={handleFile} onOcrFileSelected={(file) => handleFile(file, "ocr")} isUploading={isUploading} />
                    )}
                    <FileNoticeBox />
                </div>
            </div>

            {uploadResult?.status === "success" && uploadResult?.uploadType === "ocr" && uploadResult?.ocrItems?.length > 0 && (
                <>
                    <OcrComparisonCard fileName={uploadResult.fileName} format={uploadResult.format} ocrItems={uploadResult.ocrItems} />

                    <ConfirmModal isOpen onCancel={() => {}} onConfirm={() => {}}>
                        <SuccessCircleIcon className="size-6" />
                        <p className="text-state-success text-xl font-bold">
                            데이터 판별이 완료되었습니다
                        </p>
                        <p className="text-[16px] text-gray-300">
                            파일의 데이터를 분석하였습니다
                        </p>
                        <p className="mt-4 text-lg font-bold text-gray-700">
                            등록하시겠습니까?
                        </p>
                    </ConfirmModal>
                </>
            )}

            <RegisterResultBox uploadResult={uploadResult} onRetry={() => setUploadResult(null)} />
        </>
    );
}

function FileUploader({ onFileSelected, onOcrFileSelected, isUploading }) {
    const { t } = useTranslation();
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
        onOcrFileSelected(file);
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
                    {isUploading ? t("common.uploading") : t("reg.upload.drag_drop")}
                </p>
                <span className="my-1 block text-[20px] text-gray-300">{t("reg.upload.or")}</span>

                <label
                    className={cn(
                        "rounded-sm border-2 border-gray-100 px-4 py-1.5 text-[22px] text-gray-500",
                        isUploading && "pointer-events-none opacity-50",
                    )}
                >
                    {t("reg.upload.select_file")}
                    <input
                        type="file"
                        accept=".xlsx,.csv,.jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        onChange={handleInputChange}
                        disabled={isUploading}
                    />
                </label>

                <span className="text-[20px] text-gray-300">
                    {t("reg.upload.supported_formats")} : xlsx, csv, jpg, png, pdf ...
                </span>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
                <OcrFileSelect onFileSelected={handleOcrInputChange} />
            </div>
        </div>
    );
}

function ProcessingBox({ fileName, format, uploadedAt }) {
    return (
        <div className="border-primary-navy flex h-full w-2/3 flex-col items-center justify-center rounded-lg border bg-white p-4 text-center">
            <div className="border-primary-navy/20 border-t-primary-navy mb-4 size-12 animate-spin rounded-full border-4" />
            <p className="text-primary-navy text-[28px] font-bold">
                데이터 판별 중입니다...
            </p>
            <p className="mt-2 text-[20px] text-gray-300">
                업로드한 파일에서 데이터를 추출하고 있습니다. 잠시만 기다려주세요.
            </p>

            <div className="mt-6 flex flex-col gap-1 rounded-lg border border-gray-100 p-6 text-left">
                <div className="flex items-center gap-2 text-gray-500">
                    <FileOutlineIcon className="size-6" />
                    <span className="text-nowrap text-[20px]">파일명: {fileName ?? "-"}</span>
                </div>
                <span className="text-nowrap text-[18px] text-gray-300">
                    파일 형식: {format ?? "-"} · 업로드 시간: {uploadedAt ? formatUploadTime(uploadedAt) : "-"}
                </span>
            </div>
        </div>
    );
}

function OcrCompleteBox({ fileName, format, uploadedAt }) {
    return (
        <div className="border-primary-navy flex h-full w-2/3 flex-col items-center justify-center rounded-lg border bg-white p-4 text-center">
            <SuccessCircleIcon className="mb-4 size-12" />
            <p className="text-primary-navy text-[28px] font-bold">
                데이터 판별이 완료되었습니다
            </p>
            <p className="mt-2 text-[20px] text-gray-300">
                파일의 데이터를 분석하였습니다
            </p>

            <div className="mt-6 flex flex-col gap-1 rounded-lg border border-gray-100 p-6 text-left">
                <div className="flex items-center gap-2 text-gray-500">
                    <FileOutlineIcon className="size-6" />
                    <span className="text-nowrap text-[20px]">파일명: {fileName ?? "-"}</span>
                </div>
                <span className="text-nowrap text-[18px] text-gray-300">
                    파일 형식: {format ?? "-"} · 업로드 시간: {uploadedAt ? formatUploadTime(uploadedAt) : "-"}
                </span>
            </div>
        </div>
    );
}

function OcrComparisonCard({ fileName, format, ocrItems }) {
    const COLUMNS = [
        { key: "supplier_name", label: "공급사" },
        { key: "raw_item_name", label: "품목명" },
        { key: "spec", label: "규격" },
        { key: "unit", label: "단위" },
        { key: "price_before", label: "변경 전 단가", format: formatNumber },
        { key: "price_after", label: "변경 후 단가", format: formatNumber },
        { key: "effective_date", label: "적용일" },
    ];

    return (
        <div className="my-8 flex gap-6 rounded-lg border border-gray-100 bg-white p-7">
            <div className="flex w-1/4 min-w-0 flex-col gap-1 border-r border-gray-100 pr-6 text-left">
                <div className="flex min-w-0 items-center gap-2 text-gray-500">
                    <FileOutlineIcon className="size-6 shrink-0" />
                    <span className="min-w-0 flex-1 break-words text-[20px]">파일명: {fileName ?? "-"}</span>
                </div>
                <span className="text-nowrap text-[18px] text-gray-300">
                    파일 형식: {format ?? "-"}
                </span>
            </div>

            <div className="min-w-0 flex-1 overflow-x-auto">
                <table className="min-w-[700px] border-collapse text-[16px]">
                    <thead>
                        <tr className="bg-surface-100 border-b border-gray-100">
                            {COLUMNS.map(({ key, label }) => (
                                <th key={key} className="px-2 py-3 text-center font-medium text-gray-500 whitespace-nowrap">
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ocrItems.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100 last:border-0">
                                {COLUMNS.map(({ key, format: formatValue }) => (
                                    <td key={key} className="px-2 py-3 text-center text-gray-500 whitespace-nowrap">
                                        {item[key] != null ? (formatValue ? formatValue(item[key]) : item[key]) : "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function OcrFileSelect({ onFileSelected }) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <OcrDocumentIcon className="size-6 text-gray-500" />
                <div>
                    <p className="text-lg font-bold text-gray-700">
                        {t("reg.upload.ocr_desc")}
                    </p>
                    <p className="text-xs text-gray-500">
                        {t("reg.upload.ocr_desc")}
                    </p>
                </div>
            </div>

            <label className="flex shrink-0 items-center gap-2 rounded-sm border-2 border-gray-100 px-4 py-2 text-sm font-semibold text-gray-500">
                <OcrScanIcon className="size-6" />
                {t("reg.upload.ocr_select")}
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
    const { t } = useTranslation();

    const UPLOAD_NOTICE_KEYS = [
        "reg.upload.check_1",
        "reg.upload.check_2",
        "reg.upload.check_3",
        "reg.upload.check_4",
    ];

    return (
        <div className="flex h-full w-1/3 flex-col rounded-lg border-4 border-primary-gold bg-white px-6 py-8">
            <h4 className="mb-5 text-[28px] font-bold text-gray-700">
                {t("reg.upload.pre_check")}
            </h4>

            <ul className="flex flex-col gap-4">
                {UPLOAD_NOTICE_KEYS.map((key) => (
                    <li key={key} className="flex items-center gap-3">
                        <CheckIcon className="size-6" />
                        <p className="text-[20px] text-gray-500">{t(key)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function RegisterResultBox({ uploadResult, onRetry }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!uploadResult || uploadResult.status === "processing") {
        return null;
    }

    const { status, fileName, uploadedAt, total, normal, needChecked, errorMessage } = uploadResult;

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
                            {status === "error" && t("reg.upload.fail")}
                            {status === "success" && t("reg.upload.success")}
                        </p>

                        <span className="text-[20x] text-gray-300">
                            {uploadedAt ? formatUploadTime(uploadedAt) : "-"}
                        </span>
                    </div>

                    <span className="text-[20px] text-gray-300">{t("common.file_name")}: {fileName ?? "-"}</span>

                    {status === "error" && (
                        <div className="flex items-center justify-between">
                            <p className="text-[20x] text-state-error">{errorMessage ?? "-"}</p>

                            <button
                                type="button"
                                onClick={onRetry}
                                className="border-primary-navy rounded-sm border px-4 py-2 text-[24px] text-gray-500"
                            >
                                {t("common.retry")}
                            </button>
                        </div>
                    )}

                    {status === "success" && (
                        <>
                            <div className="mt-3 rounded-lg border border-gray-100">
                                <p className="border-b border-gray-100 p-6 text-[24px] font-bold text-gray-500">
                                    {t("reg.upload.parsing_summary")}
                                </p>

                                <div className="mb-6 flex w-full items-center justify-around py-">
                                    <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[20px]">
                                        <p>{t("reg.upload.total_count")}</p>
                                        <div>
                                            <span className="text-[28px] font-bold">{total ?? "-"}</span>{t("common.count_unit")}
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[20px]">
                                        <p>{t("reg.upload.normal_count")}</p>
                                        <div>
                                            <span className="text-[28px] font-bold text-state-success">{normal ?? "-"}</span>{t("common.count_unit")}
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center justify-center gap-2 border-r border-gray-100 py-2 text-[20px]">
                                        <p>{t("reg.upload.exception_count")}</p>
                                        <div>
                                            <span className="text-[28px] font-bold text-state-warning">{needChecked ?? "-"}</span>{t("common.count_unit")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="my-3 text-[20px] text-gray-500">
                                {t("reg.upload.check_inbox_desc")}
                            </p>

                            <button
                                onClick={() => navigate("/inbox")}
                                className="bg-primary-navy flex w-full items-center justify-center gap-4 rounded-lg py-4 transition-opacity hover:opacity-90"
                            >
                                <span className="text-surface-100 text-[22px] font-bold">
                                    {t("reg.upload.go_to_inbox")}
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
