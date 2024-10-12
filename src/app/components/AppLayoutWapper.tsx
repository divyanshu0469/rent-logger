"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  }, [token]);
  return (
    <>
      <div className="w-full h-20 bg-red-500 flex flex-row justify-around items-center">
        <Link href={"/"} className="font-semibold">
          RentLogger
        </Link>
        {token && (
          <Button variant={"outline"} onClick={logout}>
            Log Out
          </Button>
        )}
      </div>
      {children}
    </>
  );
}
