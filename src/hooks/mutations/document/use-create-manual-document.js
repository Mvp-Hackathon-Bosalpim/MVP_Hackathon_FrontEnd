import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createManualDocument } from "@/services/api/document";
import { inboxKeys } from "@/constants/query-keys";

/**
 * mutate(items: ManualDocumentItem[])
 */
const useCreateManualDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items) => createManualDocument(items),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  });
};

export default useCreateManualDocument;
