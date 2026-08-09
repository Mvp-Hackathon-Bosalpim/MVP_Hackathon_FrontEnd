import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * @param {{ page?: number, size?: number }} [params]
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
const useDocuments = (params, options) =>
  useQuery({
    queryKey: inboxKeys.documents(params),
    queryFn: () => getDocuments(params),
    ...options,
  });

export default useDocuments;
