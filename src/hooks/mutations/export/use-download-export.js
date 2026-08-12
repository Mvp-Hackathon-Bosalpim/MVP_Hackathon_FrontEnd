import { useMutation } from "@tanstack/react-query";
import { getExportDownloadUrl } from "@/services/api/export";

/**
 * mutate(exportHistoryId: number)
 */
const useDownloadExport = () => {
  return useMutation({
    mutationFn: (exportHistoryId) => getExportDownloadUrl(exportHistoryId),
  });
};

export default useDownloadExport;
