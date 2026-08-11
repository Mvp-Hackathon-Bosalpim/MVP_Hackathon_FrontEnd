import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/services/api/dashboard";
import { dashboardKeys } from "@/constants/query-keys";

const useDashboardSummary = () =>
  useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
  });

export default useDashboardSummary;
