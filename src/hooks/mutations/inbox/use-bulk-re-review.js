import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkReReview } from "@/services/api/inbox";
import { inboxKeys, dashboardKeys } from "@/constants/query-keys";

/**
 * mutate({ ids: number[] })
 */
const useBulkReReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => bulkReReview(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
};

export default useBulkReReview;
