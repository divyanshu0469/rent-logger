"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGetUser } from "./api/queries";
import { redirect, useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { data } = useGetUser();

  useEffect(() => {
    if (token) {
      redirect("/home");
    } else {
      redirect("/login");
    }
  }, [token, data, router]);

  return null;
};

export default Home;
