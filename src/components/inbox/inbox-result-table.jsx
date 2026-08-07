import { useState } from "react";

import { INBOX_TABLE_THEAD } from "./inbox-table-config";
import MOCK from "@/pages/inbox/mock-data.json";

import InboxRow from "./inbox-row";
import InboxResultFooter from "./inbox-result-footer";
import InboxStatusRow from "./inbox-status-row";

function InboxResultTable() {
  const [selectedIds, setSelectedIds] = useState([]);

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="h-14 px-10" />
              {INBOX_TABLE_THEAD.map((thead) => (
                <th
                  key={thead}
                  className="h-14 px-4 text-left text-[22px] font-bold text-gray-500"
                >
                  {thead}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* <InboxStatusRow.Empty /> */}
            <InboxRow
              item={MOCK}
              selectedIds={selectedIds}
              onSelect={setSelectedIds}
            />
          </tbody>
        </table>

        <InboxResultFooter />
      </div>
    </div>
  );
}

export default InboxResultTable;
