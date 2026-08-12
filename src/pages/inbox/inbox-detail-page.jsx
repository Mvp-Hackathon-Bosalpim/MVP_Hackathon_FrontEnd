import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useDocument from "@/hooks/queries/inbox/use-document";
import useUpdateDocument from "@/hooks/mutations/inbox/use-update-document";
import useApproveDocument from "@/hooks/mutations/inbox/use-approve-document";
import useRejectDocument from "@/hooks/mutations/inbox/use-reject-document";
import useBulkReReview from "@/hooks/mutations/inbox/use-bulk-re-review";
import useDeleteDocument from "@/hooks/mutations/inbox/use-delete-document";
import InboxDetailHeader from "@/components/inbox/detail/inbox-detail-header";
import MappingEditCard from "@/components/inbox/detail/mapping-edit-card";
import SourceDataCard from "@/components/inbox/detail/source-data-card";
import AuditLogCard from "@/components/inbox/detail/audit-log-card";
import InboxActionModal from "@/components/inbox/inbox-action-modal";
import { inboxKeys } from "@/constants/query-keys";
import CircleXIcon from "@/assets/icons/circle-x-icon.svg?react";
import LineArrowRightIcon from "@/assets/icons/line-arrow-right-icon.svg?react";
import { Trash2 } from "lucide-react";

function InboxDetailPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { docId } = useParams();
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reReviewModalOpen, setReReviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, isPending, isError, refetch } = useDocument(docId);
  const updateMutation = useUpdateDocument();
  const approveMutation = useApproveDocument();
  const rejectMutation = useRejectDocument();
  const reReviewMutation = useBulkReReview();
  const deleteMutation = useDeleteDocument();

  const isApproved = data?.review_status === "APPROVED";

  const handleSave = (formValues) => {
    updateMutation.mutate(
      { id: docId, body: formValues },
      {
        onSuccess: () => {
          cardRef.current?.resetTo(formValues);
          toast.success(t("toast.update_success"));
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message ?? t("toast.error_fallback"));
        },
      },
    );
  };

  const handleApproveConfirm = (memo) => {
    approveMutation.mutate(
      { id: docId, body: { ...(memo && { memo }) } },
      {
        onSuccess: () => {
          toast.success(t("toast.approve_success"));
          setApproveModalOpen(false);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message ?? t("toast.error_fallback"));
        },
      },
    );
  };

  const handleGoNext = () => {
    if (data?.next_doc_id) {
      navigate(`/inbox/${data.next_doc_id}`);
    } else {
      navigate("/inbox");
    }
  };

  const handleRejectConfirm = (memo) => {
    rejectMutation.mutate(
      { id: docId, body: { memo } },
      {
        onSuccess: () => {
          toast.success(t("toast.reject_success"));
          setRejectModalOpen(false);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message ?? t("toast.error_fallback"));
        },
      },
    );
  };

  const handleDeleteConfirm = (memo) => {
    deleteMutation.mutate(
      { id: Number(docId), body: { ...(memo && { memo }) } },
      {
        onSuccess: () => {
          toast.success(t("toast.delete_success"));
          setDeleteModalOpen(false);
          queryClient.removeQueries({ queryKey: inboxKeys.document(docId) });
          queryClient.invalidateQueries({ queryKey: inboxKeys.all });
          if (data?.next_doc_id) {
            navigate(`/inbox/${data.next_doc_id}`);
          } else {
            navigate("/inbox");
          }
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message ?? t("toast.error_fallback"));
        },
      },
    );
  };

  const handleReReviewConfirm = (memo) => {
    reReviewMutation.mutate(
      { ids: [Number(docId)], ...(memo && { memo }) },
      {
        onSuccess: () => {
          toast.success(t("toast.re_review_success"));
          setReReviewModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: inboxKeys.document(docId),
          });
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message ?? t("toast.error_fallback"));
        },
      },
    );
  };

  const handlePrev = () => {
    if (data?.previous_doc_id) navigate(`/inbox/${data.previous_doc_id}`);
  };

  const handleNext = () => {
    if (data?.next_doc_id) navigate(`/inbox/${data.next_doc_id}`);
  };

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-300">
        {t("inbox.loading")}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-gray-300">
        <p>{t("inbox.load_error")}</p>
        <button
          onClick={refetch}
          className="text-primary-navy border-primary-navy rounded-sm border px-4 py-2 text-sm"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="px-20 py-10">
      <InboxDetailHeader data={data} />

      <div className="flex items-stretch gap-4">
        <SourceDataCard
          data={data}
          onPrev={data.previous_doc_id ? handlePrev : undefined}
          onNext={data.next_doc_id ? handleNext : undefined}
        />
        <MappingEditCard
          key={data.doc_id}
          ref={cardRef}
          data={data}
          exceptionFlags={data.exception_flags ?? []}
          onSubmit={handleSave}
        />
      </div>

      <AuditLogCard changeLog={data.change_log ?? []} />

      <div className="flex items-center justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          disabled={deleteMutation.isPending}
          className="border-primary-navy text-primary-navy flex items-center gap-3 rounded-md border-2 bg-white px-12 py-2 disabled:opacity-50"
        >
          <Trash2 className="size-5" />
          {t("detail.delete")}
        </button>

        <button
          type="button"
          onClick={() => setRejectModalOpen(true)}
          className="border-primary-navy text-primary-navy flex items-center gap-3 rounded-md border-2 bg-white px-12 py-2"
        >
          <CircleXIcon className="size-5" />
          {t("detail.reject_confirm")}
        </button>

        <button
          type="button"
          onClick={() => setReReviewModalOpen(true)}
          disabled={reReviewMutation.isPending}
          className="border-primary-navy text-primary-navy flex items-center gap-3 rounded-md border-2 bg-white px-12 py-2 disabled:opacity-50"
        >
          {t("inbox.action.re_review")}
        </button>

        {isApproved ? (
          <button
            type="button"
            onClick={handleGoNext}
            className="border-primary-navy text-surface-100 flex items-center gap-3 rounded-md border-2 bg-gray-500 px-12 py-2 font-bold"
          >
            {t("detail.next_review")}
            <LineArrowRightIcon className="size-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setApproveModalOpen(true)}
            disabled={approveMutation.isPending}
            className="border-primary-navy text-surface-100 flex items-center gap-3 rounded-md border-2 bg-gray-500 px-12 py-2 font-bold disabled:opacity-50"
          >
            {t("detail.approve_next")}
            <LineArrowRightIcon className="size-5" />
          </button>
        )}
      </div>

      <InboxActionModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        actionType="delete"
      />

      <InboxActionModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApproveConfirm}
        actionType="approve"
      />

      <InboxActionModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        actionType="reject"
      />

      <InboxActionModal
        isOpen={reReviewModalOpen}
        onClose={() => setReReviewModalOpen(false)}
        onConfirm={handleReReviewConfirm}
        actionType="reReview"
      />
    </div>
  );
}

export default InboxDetailPage;
