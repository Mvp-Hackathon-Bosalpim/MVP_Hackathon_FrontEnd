import client from "@/services/instance";

/** @returns {Promise<DashboardSummaryResponseDto>} */
export const getDashboardSummary = async () => {
  const response = await client.get("/api/v1/dashboard/summary");
  return response.data;
};

/** @returns {Promise<{ stats: { issue_type: string, count: number }[] }>} */
export const getIssueStats = async () => {
  const response = await client.get("/api/v1/dashboard/issue-stats");
  return response.data;
};
