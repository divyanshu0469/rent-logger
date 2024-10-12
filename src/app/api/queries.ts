import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { QUERY } from "./queriesKeys";
import axios from "axios";

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
      if (response.data.status === 401) {
        logout();
      }
      if (response.data.status === 201) {
        return {
          email: response.data.email,
          message: response.data.message,
          status: response.data.status,
        };
      } else {
        return { message: response.data.message, status: response.data.status };
      }
    },
  });
  return {
    data: data,
    ...rest,
  };
};
