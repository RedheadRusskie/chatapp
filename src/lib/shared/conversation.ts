import axios, { AxiosError } from "axios";

import { ConversationData, ConversationPayload } from "@/interfaces";

const baseEndpoint = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchConversationsRequest =
  async (): Promise<ConversationData> => {
    try {
      const response = await axios.get(`${baseEndpoint}/api/conversation`);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;

        throw new Error(axiosError.message);
      } else throw new Error("An unknown error occurred");
    }
  };

export const createConversationMutationFunction = async (
  conversationData: ConversationPayload
) => {
  try {
    const response = await axios.post(
      `${baseEndpoint}/api/conversation`,
      conversationData
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      throw new Error(axiosError.message);
    } else throw new Error("An unknown error occurred");
  }
};
