import { useMutation } from "@tanstack/react-query";
import { deleteDocument } from "@/services/api/inbox";

/**
 * mutate({ id: number, body?: { memo?: string } })
 */
const useDeleteDocument = () => {
  return useMutation({
    mutationFn: ({ id, body }) => deleteDocument(id, body),
  });
};

export default useDeleteDocument;
