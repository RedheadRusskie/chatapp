import axios, { AxiosError } from "axios";
import axiosInstance from "@/utils/axios-instance";

import { ConversationData, ConversationPayload } from "@/interfaces";

export const fetchConversationsRequest =
  async (): Promise<ConversationData> => {
    try {
      const response = await axiosInstance.get("/conversation");

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
    const response = await axiosInstance.post(
      "/conversation",
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
