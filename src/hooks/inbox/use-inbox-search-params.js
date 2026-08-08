import { useSearchParams } from "react-router-dom";
import useDocuments from "@/hooks/queries/inbox/use-documents";
import useSearchDocuments from "@/hooks/queries/inbox/use-search-documents";

/**
 * @param {{ onNavigate?: () => void }} [options]
 */
export default function useInboxSearchParams({ onNavigate } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const size = Number(searchParams.get("size") ?? 20);
  const itemName = searchParams.get("itemName") ?? "";
  const supplierName = searchParams.get("supplierName") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  const hasFilter = !!(itemName || supplierName || startDate || endDate);

  const {
    data: docData,
    isPending: isDocPending,
    isError: isDocError,
    refetch: docRefetch,
  } = useDocuments({ page, size }, { enabled: !hasFilter });

  const {
    data: searchData,
    isPending: isSearchPending,
    isError: isSearchError,
    refetch: searchRefetch,
  } = useSearchDocuments(
    {
      body: {
        item_names: itemName ? itemName.split(",") : [],
        supplier_names: supplierName ? supplierName.split(",") : [],
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      },
      params: { page, size },
    },
    { enabled: hasFilter },
  );

  const data = hasFilter ? searchData : docData;
  const isPending = hasFilter ? isSearchPending : isDocPending;
  const isError = hasFilter ? isSearchError : isDocError;
  const refetch = hasFilter ? searchRefetch : docRefetch;

  const handlePageChange = (newPage) => {
    onNavigate?.();
    setSearchParams((prev) => {
      prev.set("page", newPage - 1);
      return prev;
    });
  };

  const handlePageSizeChange = (newSize) => {
    onNavigate?.();
    setSearchParams((prev) => {
      prev.set("size", newSize);
      prev.set("page", 0);
      return prev;
    });
  };

  const handleFilterReset = () => {
    onNavigate?.();
    setSearchParams((prev) => {
      ["itemName", "supplierName", "startDate", "endDate"].forEach((key) =>
        prev.delete(key),
      );
      prev.set("page", 0);
      prev.set("size", 20);
      return prev;
    });
  };

  return {
    page,
    size,
    hasFilter,
    data,
    isPending,
    isError,
    refetch,
    handlePageChange,
    handlePageSizeChange,
    handleFilterReset,
  };
}
