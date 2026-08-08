import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkReject } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * mutate({ ids: number[] })
 */
const useBulkReject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => bulkReject(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  });
};

export default useBulkReject;
