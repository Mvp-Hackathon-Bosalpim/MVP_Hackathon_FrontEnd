import { BarChart, Bar, XAxis, YAxis, Cell, LabelList, ResponsiveContainer } from "recharts";

const AXIS_TICKS = [0, 20, 40, 60, 80];

function ValueLabel({ x, y, width, height, value, percent }) {
  return (
    <text x={x + width + 8} y={y + height / 2} dy={4} className="fill-gray-700 text-sm font-medium">
      {value}건 ({percent}%)
    </text>
  );
}

export default function PriorityIssueBarChart({ issues = [], totalErrorCount, totalDataCount }) {
  const errorRatio = totalErrorCount && totalDataCount ? ((totalErrorCount / totalDataCount) * 100).toFixed(1) : null;

  return (
    <div className="flex-1 flex items-center gap-6 px-4 py-4">
      <div className="shrink-0 w-36">
        <p className="text-sm text-gray-500">총 오류 건수</p>
        <p className="text-3xl font-bold text-gray-700">
          {totalErrorCount ?? "-"} <span className="text-base font-normal text-gray-500">건</span>
        </p>
        <p className="mt-1 text-sm text-gray-500">전체 데이터 중 {errorRatio ?? "-"}%</p>
      </div>

      <div className="flex-1 h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={issues}
            layout="vertical"
            margin={{ top: 4, right: 56, left: 0, bottom: 0 }}
            barCategoryGap="30%"
          >
            <XAxis type="number" domain={[0, 80]} ticks={AXIS_TICKS} tick={{ fontSize: 12, fill: "var(--color-gray-300)" }} axisLine={{ stroke: "var(--color-gray-200)" }} tickLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              width={88}
              tick={{ fontSize: 13, fill: "var(--color-gray-500)" }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
              {issues.map((issue) => (
                <Cell key={issue.issue_type} style={{ fill: `var(--color-${issue.color})` }} />
              ))}
              <LabelList
                dataKey="count"
                content={(props) => (
                  <ValueLabel
                    {...props}
                    percent={totalErrorCount ? ((props.value / totalErrorCount) * 100).toFixed(1) : "-"}
                  />
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
