// hooks/useBackgroundRemoval.ts
import { ApiHandler } from "@/api/ApiHandler";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { useMutation } from "@tanstack/react-query";

export function useBackgroundRemoval() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (imgUri: string) => {
      const api = new ApiHandler(dispatch);
      await api.backgroundRemoval(imgUri);
    },
  });
}
