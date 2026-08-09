import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocument } from "@/services/api/document";
import { inboxKeys } from "@/constants/query-keys";

/**
 * mutate(file: File)
 */
const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => uploadDocument(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inboxKeys.all }),
  });
};

export default useUploadDocument;
