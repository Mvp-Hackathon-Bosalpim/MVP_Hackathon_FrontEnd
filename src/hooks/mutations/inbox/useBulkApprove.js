import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkApprove } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/queryKeys";

/**
 * mutate({ ids: number[] })
 */
const useBulkApprove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => bulkApprove(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  });
};

export default useBulkApprove;
