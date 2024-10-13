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

export const useAddTenant = () => {
  const { token } = useAuth();

  const { data, ...rest } = useMutation<
    { message: string; status: number },
    Error,
    {
      email: string;
      name: string;
      rent: number | null;
      lastReading: number | null;
      waterBill: number | null;
      lastNotes: string | null;
    }
  >({
    mutationKey: [MUTATION.addTenant],
    mutationFn: async ({
      email,
      name,
      rent,
      lastReading,
      waterBill,
      lastNotes,
    }) => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      } else if (!token) {
        return { message: "No token Found", status: 401 };
      }

      const response = await axios.post(
        `${apiBaseUrl}/protected/add-tenant`,
        {
          email,
          name,
          rent,
          lastReading,
          waterBill,
          lastNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data: { message: string; status: number } = response.data;

      return {
        message: data.message,
        status: data.status,
      };
    },
  });

  return {
    data,
    ...rest,
  };
};

export const useAddRent = () => {
  const { token } = useAuth();

  const { data, ...rest } = useMutation<
    { message: string; status: number },
    Error,
    {
      tenantId: string;
      totalBill: number;
      notes: string | null;
      reading: number;
      readingDifference: number;
    }
  >({
    mutationKey: [MUTATION.addTenant],
    mutationFn: async ({
      tenantId,
      totalBill,
      notes,
      reading,
      readingDifference,
    }) => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      } else if (!token) {
        return { message: "No token Found", status: 401 };
      }

      const response = await axios.post(
        `${apiBaseUrl}/protected/add-rent`,
        { tenantId, totalBill, notes, reading, readingDifference },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data: { message: string; status: number } = response.data;

      return {
        message: data.message,
        status: data.status,
      };
    },
  });

  return {
    data,
    ...rest,
  };
};
