import { useMutation } from "@tanstack/react-query";
import { deleteDocument } from "@/services/api/inbox";

/**
 * mutate(id: number)
 */
const useDeleteDocument = () => {
  return useMutation({
    mutationFn: (id) => deleteDocument(id),
  });
};

export default useDeleteDocument;
