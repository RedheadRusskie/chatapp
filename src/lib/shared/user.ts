import axios, { AxiosError } from "axios";
import axiosInstance from "@/utils/axios-instance";
import { User } from "@prisma/client";

export const fetchUserRequest = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get("/user");

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      throw new Error(axiosError.message);
    } else throw new Error("An unknown error occurred");
  }
};

export const postUserRequest = async () => {
  try {
    const response = await axiosInstance.post("/user", null);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      throw new Error(axiosError.message);
    } else throw new Error("An unknown error occurred");
  }
};

export const searchUsersRequest = async (
  query: string | null,
  page: number
): Promise<User[]> => {
  try {
    const response = await axiosInstance.get("/search-user", {
      params: { query, skip: page * 10, take: 10 },
    });

    return response.data.queryResult;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      throw new Error(axiosError.message);
    } else throw new Error("An unknown error occurred");
  }
};
