import { useQuery } from "@tanstack/react-query";
import { getDeletedItems } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

/** @param {{ enabled?: boolean }} [options] */
const useDeletedItems = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: inboxKeys.deletedItems(),
    queryFn: getDeletedItems,
    enabled,
  });

export default useDeletedItems;
