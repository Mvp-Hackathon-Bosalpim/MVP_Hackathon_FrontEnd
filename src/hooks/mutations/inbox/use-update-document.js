import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDocument } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * mutate({ id: number, body: import('@/services/api/inbox').ItemUpdateRequestDto })
 */
const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => updateDocument(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.document(id) });
    },
  });
};

export default useUpdateDocument;
