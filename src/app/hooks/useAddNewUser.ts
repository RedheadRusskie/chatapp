import { useEffect } from "react";
import { useUser } from "./useUser";

export const useAddNewUser = async () => {
  const { isUserLoading, postMutation } = useUser();

  useEffect(() => {
    const userAdded = sessionStorage.getItem("user");

    if (userAdded) return;

    const addUser = async () => {
      const newUserResponse = await postMutation.mutateAsync();

      return sessionStorage.setItem("user", JSON.stringify(newUserResponse!));
    };

    {
      !isUserLoading && addUser();
    }
  }, [postMutation, isUserLoading]);
};
