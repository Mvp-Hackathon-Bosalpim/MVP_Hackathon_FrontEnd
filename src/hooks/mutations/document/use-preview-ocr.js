import { useMutation } from "@tanstack/react-query";
import { previewOcr } from "@/services/api/ocr";

/**
 * mutate(file: File)
 */
const usePreviewOcr = () => {
  return useMutation({
    mutationFn: (file) => previewOcr(file),
  });
};

export default usePreviewOcr;
