import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveDocument } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

const useApproveDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => approveDocument(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  });
};

export default useApproveDocument;
