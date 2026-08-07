import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { formatNumber } from "@/lib/utils";

const PAGE_SIZES = [20, 50, 100];
const TOTAL_COUNT = 12345;
const TOTAL_PAGES = 126;

const visiblePages = [1, 2, 3, 4, 5];

function InboxResultFooter() {
  return (
    <>
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <span className="text-[20px] text-gray-500">
          총 {formatNumber(TOTAL_COUNT)}건
        </span>

        <Pagination className="w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious text="" />
            </PaginationItem>
            {visiblePages.map((p, idx) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={idx === 0}>{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{TOTAL_PAGES}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext text="" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <select
          value={[20, 50, 100]}
          className="rounded-md border border-gray-200 px-3 py-2 text-[18px] text-gray-600 outline-none"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}개씩 보기
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 px-4 pb-4">
        <button className="text-surface-100 flex w-40 items-center justify-center rounded-sm bg-[#2C5691] p-0 py-3 text-[22px] font-bold">
          재검토
        </button>
        <button className="text-surface-100 bg-primary-navy flex w-40 items-center justify-center rounded-sm p-0 py-3 text-[22px] font-bold">
          일괄 승인
        </button>
        <button className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px]">
          선택 항목 승인
        </button>
        <button className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px]">
          일괄 반려
        </button>
        <button className="bg-surface-100 border-primary-navy text-primary-navy flex w-40 items-center justify-center rounded-sm border p-0 py-3 text-[22px]">
          선택 항목 반려
        </button>
      </div>
    </>
  );
}

export default InboxResultFooter;
