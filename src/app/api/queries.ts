"use client";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { QUERY } from "./queriesKeys";
import axios from "axios";
import { Rent, Tenant } from "../lib/schema";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useGetUser = () => {
  const { token, logout } = useAuth();
  const { data, ...rest } = useQuery({
    queryKey: [QUERY.getUser],
    queryFn: async () => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      } else if (!token) {
        return { message: "No token Found", status: 401 };
      }
      const response = await axios.get(`${apiBaseUrl}/protected/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: { status: number; email: string | null; message: string } =
        response.data;
      if (data.status === 401) {
        logout();
      }
      if (data.status === 201) {
        return {
          email: data.email,
          message: data.message,
          status: data.status,
        };
      } else {
        return { message: data.message, status: data.status };
      }
    },
  });
  return {
    data: data,
    ...rest,
  };
};

export const useGetTenants = () => {
  const { token, logout } = useAuth();
  const { data, ...rest } = useQuery({
    queryKey: [QUERY.getTenants],
    queryFn: async () => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      } else if (!token) {
        return { message: "No token Found", status: 401 };
      }
      const response = await axios.get(`${apiBaseUrl}/protected/get-tenants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: {
        status: number;
        tenants: Tenant[] | null;
        message: string;
      } = response.data;
      if (data.status === 401) {
        logout();
      }
      if (data.status === 201) {
        return {
          tenants: data.tenants,
          message: data.message,
          status: data.status,
        };
      } else {
        return { message: data.message, status: data.status };
      }
    },
  });
  return {
    data: data,
    ...rest,
  };
};

export const useGetSingleTenant = (tenantId: string) => {
  const { token, logout } = useAuth();
  const { data, ...rest } = useQuery({
    queryKey: [QUERY.getSingleTenant],
    queryFn: async () => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      } else if (!token) {
        return { message: "No token Found", status: 401 };
      }
      const response = await axios.post(
        `${apiBaseUrl}/protected/get-single-tenant`,
        { tenantId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data: {
        status: number;
        tenant: Tenant | null;
        message: string;
      } = response.data;
      if (data.status === 401) {
        logout();
      }
      if (data.status === 201) {
        return {
          tenant: data.tenant,
          message: data.message,
          status: data.status,
        };
      } else {
        return { message: data.message, status: data.status };
      }
    },
  });
  return {
    data: data,
    ...rest,
  };
};

export const useGetRents = () => {
  const { token, logout } = useAuth();
  const { data, ...rest } = useQuery({
    queryKey: [QUERY.getRents],
    queryFn: async () => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      } else if (!token) {
        return { message: "No token Found", status: 401 };
      }
      const response = await axios.get(`${apiBaseUrl}/protected/get-rents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: {
        status: number;
        rents: Rent[] | null;
        tenants: Tenant[] | null;
        message: string;
      } = response.data;
      if (data.status === 401) {
        logout();
      }
      if (data.status === 201) {
        return {
          rents: data.rents,
          tenants: data.tenants,
          message: data.message,
          status: data.status,
        };
      } else {
        return { message: data.message, status: data.status };
      }
    },
  });
  return {
    data: data,
    ...rest,
  };
};

export const useGetSingleRent = (rentId: string) => {
  const { token, logout } = useAuth();
  const { data, ...rest } = useQuery({
    queryKey: [QUERY.getSingleRent],
    queryFn: async () => {
      if (!apiBaseUrl) {
        throw new Error("API Base URL is not defined.");
      } else if (!token) {
        return { message: "No token Found", status: 401 };
      }
      const response = await axios.post(
        `${apiBaseUrl}/protected/get-single-rent`,
        { rentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data: {
        status: number;
        tenant: Tenant | null;
        rent: Rent | null;
        message: string;
      } = response.data;
      if (data.status === 401) {
        logout();
      }
      if (data.status === 201) {
        return {
          tenant: data.tenant,
          rent: data.rent,
          message: data.message,
          status: data.status,
        };
      } else {
        return { message: data.message, status: data.status };
      }
    },
  });
  return {
    data: data,
    ...rest,
  };
};
