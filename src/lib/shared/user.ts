import { User } from "@prisma/client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Session } from "next-auth";

const baseEndpoint = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchUserRequest = async (session: Session): Promise<User> => {
  const headers = {
    headers: {
      Authorization: `Bearer ${session.user}`,
    },
  };

  try {
    const response = await axios.get(`${baseEndpoint}/api/user`, headers);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      throw new Error(axiosError.message);
    } else throw new Error("An unknown error occurred");
  }
};

export const postUserRequest = async (session: Session) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${session.user}`,
    },
  };

  try {
    const response = await axios.post(`${baseEndpoint}/api/user`, headers);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      throw new Error(axiosError.message);
    } else throw new Error("An unknown error occurred");
  }
};
