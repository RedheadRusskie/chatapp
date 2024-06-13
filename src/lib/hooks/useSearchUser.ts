import { useInfiniteQuery } from "react-query";
import { searchUsersRequest } from "../shared";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { AxiosError } from "axios";
import { Session } from "next-auth";

export const useSearchUser = (query: string) => {
  const { data: session } = useSession();

  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery<User[], AxiosError>(
      ["userSearchQuery", query],
      ({ pageParam = 0 }) =>
        searchUsersRequest(session as Session, query, pageParam),
      {
        enabled: !!session && !!query && query.length > 3,
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.length < 10) return undefined;

          return allPages.length;
        },
      }
    );

  return {
    usersQueryResult: data?.pages.flat() || [],
    isUsersQueryLoading: isLoading,
    usersQueryError: error,
    fetchNextPage,
    hasNextPage,
  };
};
