import axios, { AxiosError } from "axios";
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchUserRequest, postUserRequest } from "../shared";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const userQueryKeys = {
  user: "user",
};

export const useUser = () => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: [userQueryKeys.user],
    queryFn: () => fetchUserRequest(session.data as Session),
  });

  const postMutation = useMutation(
    () => postUserRequest(session.data as Session),
    {
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
    }
  );

  return { user, isUserLoading, postMutation };
};
