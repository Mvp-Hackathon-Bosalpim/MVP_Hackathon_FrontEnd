import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * @param {{ page?: number, size?: number }} [params]
 */
const useDocuments = (params) =>
  useQuery({
    queryKey: inboxKeys.documents(params),
    queryFn: () => getDocuments(params),
  });

export default useDocuments;
