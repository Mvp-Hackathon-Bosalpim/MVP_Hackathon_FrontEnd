import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmOcr } from "@/services/api/ocr";
import { inboxKeys, dashboardKeys } from "@/constants/query-keys";

/**
 * mutate({ filename: string, ocrItems: OcrPreviewItemDto[] })
 */
const useConfirmOcr = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ filename, ocrItems }) => confirmOcr(filename, ocrItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
};

export default useConfirmOcr;
