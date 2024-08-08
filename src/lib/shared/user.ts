import { User } from "@prisma/client";
import axios, { AxiosError } from "axios";

const baseEndpoint = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchUserRequest = async (): Promise<User> => {
  try {
    const response = await axios.get(`${baseEndpoint}/api/user`, {});
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

export const postUserRequest = async () => {
  try {
    const response = await axios.post(`${baseEndpoint}/api/user`, null, {});
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
  query: string,
  page: number
): Promise<User[]> => {
  try {
    const response = await axios.get(`${baseEndpoint}/api/search-user`, {
      params: { query, skip: page * 10, take: 10 },
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
