import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveDocument } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * mutate({ id: number, body: { memo?: string } })
 */
const useApproveDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => approveDocument(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  });
};

export default useApproveDocument;
