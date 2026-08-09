import { useMutation } from "@tanstack/react-query";
import { exportDocuments } from "@/services/api/export";

/**
 * mutate({ format: 'JSON' | 'CSV', file_name: string })
 */
const useExportDocuments = () => {
  return useMutation({
    mutationFn: (body) => exportDocuments(body),
  });
};

export default useExportDocuments;
