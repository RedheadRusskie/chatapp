import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import { User } from "@prisma/client";
import {
  fetchUserRequest,
  postUserRequest,
  searchUsersRequest,
} from "../shared";

const userQueryKeys = {
  user: "user",
  userSearchQuery: "userSearchQuery",
};

export const useUser = (searchQuery?: string | null) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: [userQueryKeys.user],
    queryFn: () => fetchUserRequest(),
    enabled: !!session,
    refetchOnMount: false,
  });

  const {
    data: searchResults,
    isLoading: userQueryLoading,
    error: userQueryError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<User[], AxiosError>(
    [userQueryKeys.userSearchQuery, searchQuery],
    ({ pageParam = 0 }) => searchUsersRequest(searchQuery || "", pageParam),
    {
      enabled: !!session && !!searchQuery && searchQuery.length > 3,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage || lastPage.length < 10) return undefined;
        return allPages.length;
      },
    }
  );

  const postMutation = useMutation(() => postUserRequest(), {
    onSuccess: () => {
      queryClient.invalidateQueries([userQueryKeys.user]);
    },
    onError: (error) => {
      if (
        error instanceof Error ||
        (error instanceof AxiosError && error.message)
      ) {
        throw new Error("Error posting user: " + error.message);
      }
    },
  });

  return {
    user,
    isUserLoading,
    postMutation,
    usersQueryResult: searchResults?.pages.flat() || [],
    userQueryLoading,
    userQueryError,
    fetchNextPage,
    hasNextPage,
  };
};
