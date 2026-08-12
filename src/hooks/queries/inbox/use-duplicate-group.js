import { useQuery } from "@tanstack/react-query";
import { getDuplicateItems } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/**
 * @param {number | null | undefined} groupId - duplicate_group ID
 * @param {{ page?: number, size?: number }} [params]
 */
const useDuplicateGroup = (groupId, params) => {
  return useQuery({
    queryKey: inboxKeys.duplicateGroup(groupId, params),
    queryFn: () => getDuplicateItems(groupId, params),
    enabled: groupId != null,
  });
};

export default useDuplicateGroup;
