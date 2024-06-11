import { User } from "@prisma/client";
import { useQuery } from "react-query";
import { searchUsersRequest } from "../shared";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { AxiosError } from "axios";

export const useSearchUser = (query: string) => {
  const { data: session } = useSession();

  const {
    data: usersQueryResult,
    isLoading: isUsersQueryLoading,
    error: usersQueryError,
  } = useQuery<User[], AxiosError>({
    queryKey: ["userSearchQuery", query],
    queryFn: () => searchUsersRequest(session as Session, query),
    enabled: !!session && !!query && query.length > 3,
    refetchOnMount: false,
  });

  return { usersQueryResult, isUsersQueryLoading, usersQueryError };
};
