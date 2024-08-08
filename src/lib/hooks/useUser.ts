import { AxiosError } from "axios";
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchUserRequest, postUserRequest } from "../shared";
import { useSession } from "next-auth/react";

const userQueryKeys = {
  user: "user",
};

export const useUser = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: [userQueryKeys.user],
    queryFn: () => fetchUserRequest(),
    enabled: !!session,
    refetchOnMount: false,
  });

  const postMutation = useMutation(() => postUserRequest(), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userQueryKeys.user] });
    },
    onError: (error) => {
      if (
        error instanceof Error ||
        (error instanceof AxiosError && error.message)
      )
        throw new Error("Error posting user: " + error.message);
    },
  });

  return { user, isUserLoading, postMutation };
};
