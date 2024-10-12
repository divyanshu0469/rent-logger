"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGetUser } from "./api/queries";

const Home = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { data } = useGetUser();

  useEffect(() => {
    if (token) {
      if (data?.status === 401) {
        router.push("/login");
      } else {
        router.push("/home");
      }
    } else {
      router.push("/login");
    }
  }, [token, router]);

  return null;
};

export default Home;
