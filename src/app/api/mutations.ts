"use client";
import { useMutation } from "@tanstack/react-query";
import { MUTATION } from "./mutationKeys";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useAddUser = () => {
  const { login } = useAuth();

  const { data, ...rest } = useMutation<
    { message: string; status: number },
    Error,
    { email: string; password: string }
  >({
    mutationKey: [MUTATION.addUser],
    mutationFn: async ({ email, password }) => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      }

      const response = await axios.post(`${apiBaseUrl}/auth/register`, {
        email,
        password,
      });

      if (response.status === 201) {
        login(response.data?.token);
      }

      return {
        message: response?.data?.message,
        status: response?.data?.status,
      };
    },
  });

  return {
    data,
    ...rest,
  };
};

export const useIsUser = () => {
  const { login } = useAuth();

  const { data, ...rest } = useMutation<
    { exists: boolean; message: string; status: number },
    Error,
    { email: string; password: string }
  >({
    mutationKey: [MUTATION.isUser],
    mutationFn: async ({ email, password }) => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      }

      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        email,
        password,
      });

      console.log("Mutation isUser", response);

      if (response.data?.status === 201) {
        login(response.data?.token);
      }

      return {
        exists: response.data?.exists,
        message: response.data?.message,
        status: response.data?.status,
      };
    },
  });

  return {
    data,
    ...rest,
  };
};
