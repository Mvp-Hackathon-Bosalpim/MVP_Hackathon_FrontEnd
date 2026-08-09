import { useQuery } from "@tanstack/react-query";
import { searchDocuments } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * @param {{
 *   body: { item_names?: string[], supplier_names?: string[], start_date?: string, end_date?: string },
 *   params: { page?: number, size?: number }
 * }} args
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
const useSearchDocuments = ({ body, params }, options) =>
  useQuery({
    queryKey: inboxKeys.search({ body, params }),
    queryFn: () => searchDocuments(body, params),
    ...options,
  });

export default useSearchDocuments;
