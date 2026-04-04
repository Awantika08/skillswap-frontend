import { useQuery } from "@tanstack/react-query";
import { getMentorAvailability } from "../api/getMentorAvailability";

export const useMentorAvailability = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["mentorAvailability", id],
    queryFn: () => getMentorAvailability(id),
    enabled: options?.enabled !== false && !!id,
  });
};
