const COLUMNS = ["파일명", "형식", "내보내기 일시", "생성 건수", "요청자", "상태", "다운로드"];

export default function ExportFileTable({ records = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            {COLUMNS.map((col) => (
              <th key={col} className="bg-surface-200 px-3 py-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200">
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.id}>
                <td className="px-3 py-4 text-gray-700">{record.fileName}</td>
                <td className="px-3 py-4 text-gray-500">{record.format}</td>
                <td className="px-3 py-4 whitespace-nowrap text-gray-500">{record.exportedAt}</td>
                <td className="px-3 py-4 text-gray-500">{record.count}</td>
                <td className="px-3 py-4 text-gray-500">{record.requestedBy}</td>
                <td className="px-3 py-4">
                  {record.status === "완료" ? (
                    <span className="inline-block rounded bg-state-success px-2 py-0.5 text-xs font-medium text-white">
                      완료
                    </span>
                  ) : (
                    <span className="text-gray-500">{record.status}</span>
                  )}
                </td>
                <td className="px-3 py-4">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="rounded border border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-surface-100"
                  >
                    다운로드
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={COLUMNS.length} className="py-10 text-center text-gray-300">
                최근 데이터가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
