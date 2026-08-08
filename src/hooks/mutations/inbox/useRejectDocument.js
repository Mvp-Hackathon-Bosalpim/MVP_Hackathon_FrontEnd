import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectDocument } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/queryKeys";

/**
 * mutate({ id: number, body: { memo?: string } })
 */
const useRejectDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => rejectDocument(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  });
};

export default useRejectDocument;
