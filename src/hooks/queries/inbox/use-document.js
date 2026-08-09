import { useQuery } from "@tanstack/react-query";
import { getDocument } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * @param {number | string} id
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
const useDocument = (id, options) =>
  useQuery({
    queryKey: inboxKeys.document(id),
    queryFn: () => getDocument(id),
    enabled: !!id,
    ...options,
  });

export default useDocument;
