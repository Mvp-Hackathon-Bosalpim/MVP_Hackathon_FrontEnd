import { useQuery } from "@tanstack/react-query";
import { getSupplierNames } from "@/services/api/inbox";
import { inboxKeys } from "@/constants/queryKeys";

const useSupplierNames = () =>
  useQuery({
    queryKey: inboxKeys.supplierNames(),
    queryFn: getSupplierNames,
  });

export default useSupplierNames;
