import { useState, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 일시 미선택 상태(현재 연도 기준)
const currentYear = new Date().getFullYear();
const UNSELECTED_LABEL = `${currentYear}-00-00 ${currentYear}-00-00`;

const today = new Date();

function formatDate(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "2026-08-03" 같은 문자열을 Date로 변환, 형식이 안 맞으면 null
function parseDateInput(value) {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const valid =
    date.getFullYear() === Number(y) &&
    date.getMonth() === Number(m) - 1 &&
    date.getDate() === Number(d);
  return valid ? date : null;
}

function isSameDate(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDayDiff(start, end) {
  if (!start || !end) return null;
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // 시작일 포함
}

function buildCalendarWeeks(year, month) {
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(year, month, i - startOffset + 1);
    cells.push({ date, current: date.getMonth() === month });
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function ExportDateRangePicker({ range, onRangeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [draftRange, setDraftRange] = useState(range ?? { start: null, end: null });
  // 시작일/종료일 입력창(타이핑 반영용)
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      const initial = range ?? { start: null, end: null };
      setDraftRange(initial);
      setStartInput(formatDate(initial.start));
      setEndInput(formatDate(initial.end));
      if (initial.start) {
        setView({ year: initial.start.getFullYear(), month: initial.start.getMonth() });
      }
    }
  }, [isOpen, range]);

  const weeks = buildCalendarWeeks(view.year, view.month);

  const goToPrevMonth = () => {
    setView((prev) =>
      prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 },
    );
  };

  const goToNextMonth = () => {
    setView((prev) =>
      prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 },
    );
  };

  const applyDraft = (next) => {
    setDraftRange(next);
    setStartInput(formatDate(next.start));
    setEndInput(formatDate(next.end));
  };

  const handleDayClick = (date) => {
    if (!draftRange.start || draftRange.end) {
      applyDraft({ start: date, end: null });
    } else if (date < draftRange.start) {
      applyDraft({ start: date, end: draftRange.start });
    } else {
      applyDraft({ start: draftRange.start, end: date });
    }
  };

  const handleStartInputChange = (value) => {
    setStartInput(value);
    const parsed = parseDateInput(value);
    if (parsed) {
      setDraftRange((prev) => ({ ...prev, start: parsed }));
      setView({ year: parsed.getFullYear(), month: parsed.getMonth() });
    }
  };

  const handleEndInputChange = (value) => {
    setEndInput(value);
    const parsed = parseDateInput(value);
    if (parsed) {
      setDraftRange((prev) => ({ ...prev, end: parsed }));
    }
  };

  const handleReset = () => {
    applyDraft({ start: null, end: null });
  };

  const handleApply = () => {
    onRangeChange(draftRange);
    setIsOpen(false);
  };

  const dayDiff = getDayDiff(draftRange.start, draftRange.end);

  const label = range?.start
    ? `${formatDate(range.start)} ~ ${range.end ? formatDate(range.end) : "종료일 선택"}`
    : UNSELECTED_LABEL;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-64 items-center justify-between rounded border border-gray-100 px-3 py-2 text-sm whitespace-nowrap text-gray-500 transition-colors hover:bg-surface-100"
      >
        {label}
        <CalendarDays size={16} className="shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-[560px] overflow-hidden rounded-lg border border-surface-200 bg-surface-0 shadow-lg">
          <div className="flex">
            {/* 왼쪽: 달력 */}
            <div className="w-[320px] border-r border-surface-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToPrevMonth}
                  className="text-gray-500 transition-colors hover:text-gray-700"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-gray-700">
                  {view.year}년 {view.month + 1}월
                </span>
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="text-gray-500 transition-colors hover:text-gray-700"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="mb-1 grid grid-cols-7 text-center text-xs text-gray-300">
                {WEEKDAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {weeks.flat().map((cell, idx) => {
                  const isStart = isSameDate(cell.date, draftRange.start);
                  const isEnd = isSameDate(cell.date, draftRange.end);
                  const inRange =
                    draftRange.start &&
                    draftRange.end &&
                    cell.date > draftRange.start &&
                    cell.date < draftRange.end;
                  const hasRangeBg = draftRange.start && draftRange.end && (isStart || isEnd || inRange);

                  return (
                    <div key={idx} className="relative flex items-center justify-center py-1">
                      {/* 시작일~종료일 사이를 이어주는 연한 배경 (원형 버튼 뒤에 깔림) */}
                      {hasRangeBg && (
                        <div
                          className={`bg-primary-navy/10 absolute inset-y-1 ${isStart ? "left-1/2 right-0" : isEnd ? "left-0 right-1/2" : "left-0 right-0"
                            }`}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleDayClick(cell.date)}
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ${!cell.current
                          ? "text-gray-200 hover:bg-surface-100"
                          : isStart || isEnd
                            ? "bg-primary-navy font-semibold text-white"
                            : "text-gray-500 hover:bg-surface-100"
                          }`}
                      >
                        {cell.date.getDate()}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 오른쪽: 선택한 기간 요약 (입력 가능) */}
            <div className="w-[240px] p-4">
              <p className="mb-4 text-sm font-semibold text-gray-700">선택한 기간</p>

              <label className="mb-1 block text-xs text-gray-500">시작일</label>
              <div className="mb-4 flex items-center gap-2 rounded border border-gray-100 px-3 py-2">
                <input
                  type="text"
                  value={startInput}
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => handleStartInputChange(e.target.value)}
                  className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-300"
                />
                <CalendarDays size={14} className="shrink-0 text-gray-300" />
              </div>

              <label className="mb-1 block text-xs text-gray-500">종료일</label>
              <div className="mb-4 flex items-center gap-2 rounded border border-gray-100 px-3 py-2">
                <input
                  type="text"
                  value={endInput}
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => handleEndInputChange(e.target.value)}
                  className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-300"
                />
                <CalendarDays size={14} className="shrink-0 text-gray-300" />

              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="mb-1 text-xs text-gray-500">기간</p>
                <p className="text-sm text-gray-700">{dayDiff ? `${dayDiff}일` : "-"}</p>
              </div>
            </div>
          </div>

          {/* 하단: 초기화 / 적용 버튼 */}
          <div className="flex gap-2 border-t border-surface-200 p-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded border border-gray-100 py-2 text-sm text-gray-500 transition-colors hover:bg-surface-100"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="bg-primary-navy flex-1 rounded py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
