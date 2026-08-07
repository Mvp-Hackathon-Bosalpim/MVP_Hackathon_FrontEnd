import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const UNSELECTED_LABEL = "2026-00-00 2026-00-00";

const today = new Date();

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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

  const handleDayClick = (date) => {
    // 첫 클릭은 시작일시, 두 번째 클릭은 종료일시로 지정
    if (!range.start || range.end) {
      onRangeChange({ start: date, end: null });
    } else if (date < range.start) {
      onRangeChange({ start: date, end: range.start });
    } else {
      onRangeChange({ start: range.start, end: date });
    }
  };

  const label = range.start
    ? `${formatDate(range.start)} ~ ${range.end ? formatDate(range.end) : "종료일 선택"}`
    : UNSELECTED_LABEL;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-64 items-center gap-2 rounded border border-gray-100 px-3 py-2 text-sm whitespace-nowrap text-gray-500 transition-colors hover:bg-surface-100"
      >
        <CalendarDays size={16} />
        {label}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-72 rounded-lg border border-surface-200 bg-surface-0 p-4 shadow-lg">
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

          <div className="grid grid-cols-7 gap-y-1">
            {weeks.flat().map((cell, idx) => {
              const isEdge = isSameDate(cell.date, range.start) || isSameDate(cell.date, range.end);
              const inRange =
                range.start && range.end && cell.date > range.start && cell.date < range.end;

              return (
                <div key={idx} className="flex items-center justify-center py-1">
                  <button
                    type="button"
                    onClick={() => handleDayClick(cell.date)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${!cell.current
                        ? "text-gray-200 hover:bg-surface-100"
                        : isEdge
                          ? "bg-primary-navy font-semibold text-white"
                          : inRange
                            ? "bg-primary-navy/10 text-gray-700"
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
      )}
    </div>
  );
}
