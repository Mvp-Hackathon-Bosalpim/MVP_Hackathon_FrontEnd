import { useQuery } from "@tanstack/react-query";
import { getExportHistory } from "@/services/api/export";
import { exportKeys } from "@/constants/query-keys";

/**
 * @param {{ page?: number, size?: number }} [params]
 */
const useExportHistory = (params) =>
  useQuery({
    queryKey: exportKeys.list(params),
    queryFn: () => getExportHistory(params),
  });

export default useExportHistory;
