import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exportDocuments } from "@/services/api/export";
import { dashboardKeys } from "@/constants/query-keys";

/**
 * mutate({ format: 'JSON' | 'CSV', file_name: string })
 */
const useExportDocuments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => exportDocuments(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
};

export default useExportDocuments;
