import { useQuery } from "@tanstack/react-query";
import { getDocumentStatusCounts } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/queryKeys";

const useDocumentStatusCounts = () =>
  useQuery({
    queryKey: inboxKeys.statusCounts(),
    queryFn: getDocumentStatusCounts,
  });

export default useDocumentStatusCounts;
