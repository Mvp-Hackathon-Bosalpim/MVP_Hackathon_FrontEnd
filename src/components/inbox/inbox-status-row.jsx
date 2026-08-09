import { useTranslation } from "react-i18next";
import LoadingIndicator from "@/assets/loading-indicator.svg?react";
import FileCircle from "@/assets/file-circle.svg?react";
import SearchCircle from "@/assets/search-circle.svg?react";
import AlertCircle from "@/assets/alert-circle.svg?react";
import { Link } from "react-router-dom";

function InboxStatusLoading() {
  const { t } = useTranslation();
  return (
    <InboxStatusRow>
      <LoadingIndicator className="animate-spin" />
      <p className="text-[22px] text-gray-300">{t("inbox.loading")}</p>
    </InboxStatusRow>
  );
}

function InboxStatusEmpty() {
  const { t } = useTranslation();
  return (
    <InboxStatusRow>
      <FileCircle />
      <div className="flex flex-col gap-3">
        <p>{t("inbox.empty_data")}</p>
        <Link
          to="/register"
          className="text-primary-navy border-primary-navy rounded-sm border px-2 py-3 text-center"
        >
          {t("dashboard.upload_new_file")}
        </Link>
      </div>
    </InboxStatusRow>
  );
}

function InboxStatusNoResult({ reset }) {
  const { t } = useTranslation();
  return (
    <InboxStatusRow>
      <SearchCircle />
      <div className="flex flex-col gap-3">
        <p>{t("inbox.no_result")}</p>
        <button
          onClick={reset}
          className="text-primary-navy border-primary-navy rounded-sm border px-2 py-3 text-center"
        >
          {t("common.reset_filter")}
        </button>
      </div>
    </InboxStatusRow>
  );
}

function InboxStatusError({ retry }) {
  const { t } = useTranslation();
  return (
    <InboxStatusRow>
      <AlertCircle />
      <div className="flex flex-col gap-3">
        <p>{t("inbox.load_error")}</p>
        <button
          onClick={retry}
          className="text-primary-navy border-primary-navy rounded-sm border px-2 py-3 text-center"
        >
          {t("common.retry")}
        </button>
      </div>
    </InboxStatusRow>
  );
}

function InboxStatusRow({ children }) {
  return (
    <tr>
      <td colSpan={10}>
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          {children}
        </div>
      </td>
    </tr>
  );
}

export default InboxStatusRow;
InboxStatusRow.Loading = InboxStatusLoading;
InboxStatusRow.Empty = InboxStatusEmpty;
InboxStatusRow.NoResult = InboxStatusNoResult;
InboxStatusRow.Error = InboxStatusError;
