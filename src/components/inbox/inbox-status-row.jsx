import LoadingIndicator from "@/assets/loading-indicator.svg?react";
import FileCircle from "@/assets/file-circle.svg?react";
import SearchCircle from "@/assets/search-circle.svg?react";
import AlertCircle from "@/assets/alert-circle.svg?react";
import { Link } from "react-router-dom";

function InboxStatusLoading() {
  return (
    <InboxStatusRow>
      <LoadingIndicator className="animate-spin" />
      <p className="text-[22px] text-gray-300">데이터를 불러오는 중입니다...</p>
    </InboxStatusRow>
  );
}

function InboxStatusEmpty() {
  return (
    <InboxStatusRow>
      <FileCircle />
      <div className="flex flex-col gap-3">
        <p>등록된 데이터가 없습니다.</p>
        <Link
          to="/register"
          className="text-primary-navy border-primary-navy rounded-sm border px-2 py-3 text-center"
        >
          신규 파일 업로드
        </Link>
      </div>
    </InboxStatusRow>
  );
}

function InboxStatusNoResult({ reset }) {
  return (
    <InboxStatusRow>
      <SearchCircle />
      <div className="flex flex-col gap-3">
        <p>검색 결과가 없습니다.</p>
        <button
          onClick={reset}
          className="text-primary-navy border-primary-navy rounded-sm border px-2 py-3 text-center"
        >
          필터 초기화
        </button>
      </div>
    </InboxStatusRow>
  );
}

function InboxStatusError({ retry }) {
  return (
    <InboxStatusRow>
      <AlertCircle />
      <div className="flex flex-col gap-3">
        <p>데이터를 불러오지 못했습니다.</p>
        <button
          onClick={retry}
          className="text-primary-navy border-primary-navy rounded-sm border px-2 py-3 text-center"
        >
          다시시도
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
