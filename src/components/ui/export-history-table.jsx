const COLUMNS = ["파일명", "형식", "내보내기 일시", "생성 건수", "요청자", "상태", "다운로드"];

export default function ExportHistoryTable({ records = [] }) {
  const placeholderRows =
    records.length === 0
      ? [
          { id: "placeholder-1", isEmpty: false },
          { id: "placeholder-2", isEmpty: true },
        ]
      : [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-gray-500">
            {COLUMNS.map((col) => (
              <th key={col} className="py-3 px-3 font-semibold bg-surface-200 ">
                {col}
            </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200">
          {records.length > 0
            ? records.map((record) => (
                <tr key={record.id}>
                  <td className="py-5 px-3 text-gray-700">{record.fileName}</td>
                  <td className="py-5 px-3 text-gray-500">{record.format}</td>
                  <td className="py-5 px-3 text-gray-500">{record.exportedAt}</td>
                  <td className="py-5 px-3 text-gray-500">{record.count}</td>
                  <td className="py-5 px-3 text-gray-500">{record.requestedBy}</td>
                  <td className="py-5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs bg-primary-navy text-white">
                      {record.status}
                    </span>
                  </td>
                  <td className="py-5 px-3">
                    <button
                      type="button"
                      onClick={() => {}}
                      className="text-xs font-medium border border-gray-100 rounded px-3 py-1.5 hover:bg-surface-100 transition-colors"
                    >
                      다운로드
                    </button>
                  </td>
                </tr>
              ))
            : placeholderRows.map((row) => (
                <tr key={row.id}>
                  {COLUMNS.map((col) => (
                    <td key={col} className="py-5 px-3 text-gray-500">
                      {row.isEmpty ? "" : "-"}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}