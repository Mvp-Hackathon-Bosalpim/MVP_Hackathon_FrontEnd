import InboxDetailHeader from "@/components/inbox/detail/inbox-detail-header";
import MappingEditCard from "@/components/inbox/detail/mapping-edit-card";
import SourceDataCard from "@/components/inbox/detail/source-data-card";
import AuditLogCard from "@/components/inbox/detail/audit-log-card";
import data from "@/pages/inbox/inbox-document-data-mock.json";

import CircleXIcon from "@/assets/icons/circle-x-icon.svg?react";
import FileOutlineIcon from "@/assets/icons/file-outline-icon.svg?react";
import LineArrowRightIcon from "@/assets/icons/line-arrow-right-icon.svg?react";
function InboxDetailPage() {
  return (
    <div className="px-20 py-10">
      <InboxDetailHeader data={data.data} />
      <div className="flex items-stretch gap-4">
        <SourceDataCard data={data.data} />
        <MappingEditCard data={data.data} onSubmit={() => {}} />
      </div>
      <AuditLogCard changeLog={data.data.change_log} />
      <div className="flex items-center justify-end gap-4 pt-6">
        <button className="border-primary-navy text-primary-navy flex items-center gap-3 rounded-md border-2 bg-white px-12 py-2">
          <CircleXIcon className="size-5" />
          반려
        </button>

        <button className="border-primary-navy text-primary-navy flex items-center gap-3 rounded-md border-2 bg-white px-12 py-2">
          <FileOutlineIcon className="size-5" />
          임시 저장
        </button>

        <button className="border-primary-navy text-surface-100 flex items-center gap-3 rounded-md border-2 bg-gray-500 px-12 py-2 font-bold">
          승인 및 다음건 검수
          <LineArrowRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default InboxDetailPage;
