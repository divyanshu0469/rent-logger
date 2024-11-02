"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NavBar from "./NavBar";

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const router = useRouter();
  const { token, logout } = useAuth();
  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);
  return (
    <>
      <NavBar token={token} logout={logout} />
      {children}
    </>
  );
}
