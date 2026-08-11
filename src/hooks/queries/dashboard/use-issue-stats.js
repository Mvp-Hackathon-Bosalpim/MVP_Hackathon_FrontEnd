import { useQuery } from "@tanstack/react-query";
import { getIssueStats } from "@/services/api/dashboard";
import { dashboardKeys } from "@/constants/query-keys";

const useIssueStats = () =>
  useQuery({
    queryKey: dashboardKeys.issueStats(),
    queryFn: getIssueStats,
  });

export default useIssueStats;
