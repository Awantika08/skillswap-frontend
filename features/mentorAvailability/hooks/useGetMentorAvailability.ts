import { useQuery } from "@tanstack/react-query";
import { getMentorAvailability } from "../api/getMentorAvailability";

export const useGetMentorAvailability = () => {
  return useQuery({
    queryKey: ["mentorAvailability"],
    queryFn: getMentorAvailability,
  });
};
