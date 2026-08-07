const COLUMNS = ["일시", "변경자", "변경 항목", "변경 전", "변경 후", "사유"];

export default function ExportChangeLogTable({ records = [] }) {
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
                <td className="px-3 py-4 whitespace-nowrap text-gray-500">{record.changedAt}</td>
                <td className="px-3 py-4 text-gray-700">{record.changedBy}</td>
                <td className="px-3 py-4 text-gray-700">{record.item}</td>
                <td className="px-3 py-4 text-gray-500">{record.before}</td>
                <td className="px-3 py-4 text-gray-500">{record.after}</td>
                <td className="px-3 py-4 text-gray-500">{record.reason}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={COLUMNS.length} className="py-10 text-center text-gray-300">
                내보내기 이력이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
