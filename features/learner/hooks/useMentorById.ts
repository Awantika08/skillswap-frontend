import { useQuery } from "@tanstack/react-query";
import { getMentorById } from "../api/getMentorById";

export const useMentorById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["mentor", id],
    queryFn: () => getMentorById(id),
    enabled: options?.enabled !== false && !!id,
  });
};
