import { useQuery } from "@tanstack/react-query";
import {
  getAvailableMentors,
  GetAvailableMentorsParams,
} from "../api/getAvailableMentors";

export const useAvailableMentors = (params?: GetAvailableMentorsParams) => {
  return useQuery({
    queryKey: ["availableMentors", params],
    queryFn: () => getAvailableMentors(params),
    placeholderData: (previousData) => previousData,
  });
};
