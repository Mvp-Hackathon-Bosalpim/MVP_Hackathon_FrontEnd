export default function ConfirmModal({
    isOpen,
    onCancel,
    onConfirm,
    cancelLabel = "취소",
    confirmLabel = "등록하기",
    children,
}) {
    if (!isOpen) return null;

    return (
        <div className="my-8 rounded-lg border border-gray-100 bg-white p-7">
            <div className="flex flex-col items-center gap-2 py-2 text-center">
                {children}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 rounded border border-gray-200 py-2 text-base text-gray-500 transition-colors hover:bg-gray-50"
                >
                    {cancelLabel}
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="bg-primary-navy flex-1 rounded py-2 text-base font-bold text-white transition-opacity hover:opacity-90"
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
}
