import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkApprove } from "@/services/api/inbox";
import { inboxKeys, dashboardKeys } from "@/constants/query-keys";

/**
 * mutate({ ids: number[] })
 */
const useBulkApprove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => bulkApprove(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
};

export default useBulkApprove;
