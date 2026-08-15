import { useTranslation } from "react-i18next";

export default function ConfirmModal({
    isOpen,
    onCancel,
    onConfirm,
    cancelLabel,
    confirmLabel,
    confirmLoadingLabel,
    isConfirming = false,
    children,
}) {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const resolvedCancelLabel = cancelLabel ?? t("common.cancel");
    const resolvedConfirmLabel = confirmLabel ?? t("reg.manual.register");
    const resolvedConfirmLoadingLabel = confirmLoadingLabel ?? resolvedConfirmLabel;

    return (
        <div className="my-8 rounded-lg border border-gray-100 bg-white p-7">
            <div className="flex flex-col items-center gap-2 py-2 text-center">
                {children}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isConfirming}
                    className="flex-1 rounded border border-gray-200 py-2 text-base text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {resolvedCancelLabel}
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isConfirming}
                    className="bg-primary-navy flex-1 rounded py-2 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isConfirming ? resolvedConfirmLoadingLabel : resolvedConfirmLabel}
                </button>
            </div>
        </div>
    );
}
