import { MessageData } from "@/interfaces";
import axios, { AxiosError } from "axios";

const baseEndpoint = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchCurrentMessagesRequest = async (
  conversationId: string,
  page: number
): Promise<MessageData[]> => {
  try {
    const response = await axios.get(
      `${baseEndpoint}/api/messages/${conversationId}`,
      {
        params: { skip: page * 10, take: 10 },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      throw new Error(axiosError.message);
    } else throw new Error("An unknown error occurred");
  }
};
