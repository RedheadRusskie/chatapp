import axios, { AxiosError, AxiosResponse } from "axios";
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "react-query";

const userQueryKeys = {
  user: "user",
};

export const useUser = () => {
  const baseEndpoint = process.env.NEXT_PUBLIC_BASE_URL;
  const queryClient = useQueryClient();

  const fetchUserRequest = async (): Promise<User> =>
    await axios
      .get(`${baseEndpoint}/api/user`)
      .then((res: AxiosResponse) => res.data);

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: [userQueryKeys.user],
    queryFn: fetchUserRequest,
  });

  const postUserRequest = async (): Promise<User> =>
    await axios
      .post(`${baseEndpoint}/api/user`)
      .then((res: AxiosResponse) => res.data);

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
