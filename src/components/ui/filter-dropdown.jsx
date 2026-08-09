import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "./checkbox";

/**
 * @typedef {Object} FilterDropdownProps
 * @property {string} placeholder
 * @property {string} searchPlaceholder
 * @property {string[]} options
 * @property {string} value - comma-separated selected values
 * @property {(value: string) => void} onChange
 * @property {boolean} [isLoading]
 */

/** @param {FilterDropdownProps} props */
export default function FilterDropdown({
  placeholder,
  searchPlaceholder,
  options,
  value,
  onChange,
  isLoading = false,
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState([]);
  const ref = useRef(null);

  const selected = value ? value.split(",").filter(Boolean) : [];

  const handleOpen = () => {
    setDraft(selected);
    setSearchQuery("");
    setIsOpen(true);
  };

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handleClose();
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, handleClose]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isAllSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((opt) => draft.includes(opt));

  const toggleAll = () => {
    setDraft(isAllSelected ? [] : [...filteredOptions]);
  };

  const toggleItem = (item) => {
    setDraft((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleApply = () => {
    onChange(draft.join(","));
    handleClose();
  };

  const handleReset = () => setDraft([]);

  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : t("common.n_selected", { count: selected.length });

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={isOpen ? handleClose : handleOpen}
        disabled={isLoading}
        className="hover:bg-surface-100 flex w-56 items-center justify-between rounded border border-gray-100 bg-white px-4 py-2 text-sm text-gray-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selected.length > 0 ? "text-gray-700" : ""}>
          {isLoading ? t("common.loading") : triggerLabel}
        </span>
        <ChevronDown size={16} className="shrink-0 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-150 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex">
            {/* 왼쪽: 검색 + 카테고리 */}
            <div className="w-45 border-r border-gray-100">
              <div className="p-3">
                <div className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2">
                  <Search size={14} className="shrink-0 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>
              <ul>
                <li className="text-primary-gold bg-primary-gold/10 cursor-default px-4 py-2.5 text-sm font-medium">
                  {t("common.all")}
                </li>
              </ul>
            </div>

            {/* 오른쪽: 체크박스 목록 */}
            <div className="flex-1">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                <span className="text-sm font-semibold text-gray-700">
                  {t("common.all")}
                </span>
                <span className="text-sm text-gray-500">
                  {t("common.total_count_n", { count: filteredOptions.length })}
                </span>
              </div>

              <div className="px-4 py-2">
                <label
                  onClick={toggleAll}
                  className="mb-2 flex cursor-pointer items-center gap-2 border-b border-gray-100 pb-2 text-base text-gray-700"
                >
                  <Checkbox
                    checked={isAllSelected}
                    className="size-5 border-gray-700 data-checked:bg-gray-700"
                  />
                  {t("common.select_all")}
                </label>

                {filteredOptions.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-300">
                    {t("common.no_items")}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-1">
                    {filteredOptions.map((opt) => (
                      <label
                        key={opt}
                        onClick={() => toggleItem(opt)}
                        className="flex cursor-pointer items-center gap-2 text-base text-gray-700"
                      >
                        <Checkbox
                          checked={draft.includes(opt)}
                          className="size-5 border-gray-700 data-checked:bg-gray-700"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={handleReset}
              className="hover:bg-surface-100 flex-1 rounded border border-gray-200 py-2 text-sm text-gray-500 transition-colors"
            >
              {t("common.reset")}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="bg-primary-navy flex-1 rounded py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t("common.apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
