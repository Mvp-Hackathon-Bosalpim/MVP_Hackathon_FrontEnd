import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkDeleteDocuments } from "@/services/api/inbox";
import { inboxKeys, dashboardKeys } from "@/constants/query-keys";

/**
 * mutate({ ids: number[] })
 */
const useBulkDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => bulkDeleteDocuments(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
};

export default useBulkDelete;
