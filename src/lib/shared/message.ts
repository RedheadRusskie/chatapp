import axios, { AxiosError } from "axios";
import { MessageResponse } from "@/interfaces";

export const fetchCurrentMessagesRequest = async (
  conversationId: string,
  page: number
): Promise<MessageResponse> => {
  try {
    const response = await axios.get(`/api/messages/${conversationId}`, {
      params: { skip: page * 10, take: 10 },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      throw new Error(axiosError.message);
    } else throw new Error("An unknown error occurred");
  }
};
