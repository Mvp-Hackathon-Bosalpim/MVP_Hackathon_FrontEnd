import { useQuery } from "@tanstack/react-query";
import { getNormalizedItemNames } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/query-keys";

const useNormalizedItemNames = () =>
  useQuery({
    queryKey: inboxKeys.normalizedItemNames(),
    queryFn: getNormalizedItemNames,
  });

export default useNormalizedItemNames;
