import { User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";

const baseEndpoint = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeaders = (session: Session) => ({
  Authorization: `Bearer ${session.user}`,
});

export const fetchUserRequest = async (session: Session): Promise<User> => {
  try {
    const response = await axios.get(`${baseEndpoint}/api/user`, {
      headers: getAuthHeaders(session),
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      throw new Error(axiosError.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const postUserRequest = async (session: Session) => {
  try {
    const response = await axios.post(`${baseEndpoint}/api/user`, null, {
      headers: getAuthHeaders(session),
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      throw new Error(axiosError.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const searchUsersRequest = async (
  session: Session,
  query: string,
  page: number
): Promise<User[]> => {
  try {
    const response = await axios.get(`${baseEndpoint}/api/search-user`, {
      params: { query, skip: page * 10, take: 10 },
      headers: getAuthHeaders(session),
    });
    return response.data.queryResult;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      throw new Error(axiosError.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
