import { useQuery } from "@tanstack/react-query";
import { searchDocuments } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * @param {{ itemName?: string, supplierName?: string, startDate?: string, endDate?: string, page?: number, size?: number }} [params]
 */
const useSearchDocuments = (params) =>
  useQuery({
    queryKey: inboxKeys.search(params),
    queryFn: () => searchDocuments(params),
  });

export default useSearchDocuments;
