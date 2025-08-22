"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsUser } from "../api/mutations";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function LoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { mutateAsync: isUser, isPending } = useIsUser();

  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const validateEmail = (email: string) => {
    const regex =
      /^[a-zA-Z]{1,}[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      try {
        const { exists } = await isUser({ email, password });
        if (exists) {
          toast({
            description: `Login Successful`,
          });
        } else if (exists === false) {
          toast({
            description: `User Not Found`,
          });
        }
      } catch (error) {
        console.log("error during SignUp", error);

        if (error instanceof AxiosError && error.response) {
          const msg = error.response.data?.message;
          toast({
            description: `${msg}`,
          });
        }
      }

      setEmail("");
      setPassword("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md h-full mx-auto p-6 pt-32 bg-card rounded-b-3xl shadow-lg flex flex-grow flex-1 flex-col justify-center items-center"
    >
      <h2 className="text-3xl pt-8 font-normal w-full">
        Log in to your account
      </h2>
      <div className="w-full pb-8 border-b font-bold">
        <span className="text-black">Don&apos;t have an account ? </span>
        <Link href={"/signup"} className="text-blue-600">
          Sign Up
        </Link>
      </div>
      <div className="space-y-2 w-full">
        <Label htmlFor="email" className="text-sm text-slate-900">
          Email Address
        </Label>
        <Input
          disabled={isPending}
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && (
          <p className="text-destructive text-sm flex items-center mt-1">
            <AlertCircle className="w-1/6 mr-1" />
            <span className="w-5/6">{emailError}</span>
          </p>
        )}
      </div>
      <div className="space-y-2 w-full">
        <Label htmlFor="password" className="text-sm text-slate-900">
          Password
        </Label>
        <div className="flex items-center gap-1">
          <Input
            disabled={isPending}
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-5/6"
          />
          <div
            className={`w-1/6 hover:outline hover:outline-2 p-2 select-none rounded-md text-center ${
              showPassword
                ? "bg-green-800 text-white"
                : "bg-white text-green-800"
            }`}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            Show
          </div>
        </div>
        {passwordError && (
          <p className="text-destructive text-sm flex items-center mt-1">
            <AlertCircle className="w-1/6 mr-1" />
            <span className="w-5/6">{passwordError}</span>
          </p>
        )}
      </div>
      <Button
        disabled={isPending || email.length === 0 || password.length === 0}
        type="submit"
        className="w-full"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
