"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsUser } from "../api/mutations";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { mutateAsync: isUser } = useIsUser();

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
      } catch (error: any) {
        console.log("error during login", error);
        toast({
          description: `${error?.response?.data?.message}`,
        });
      }

      setEmail("");
      setPassword("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg flex flex-1 flex-col justify-center items-center"
    >
      <h2 className="text-2xl font-bold text-center text-foreground">Login</h2>
      <div className="space-y-2 w-full">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          placeholder="Enter your email"
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
        <Label htmlFor="password">Password</Label>
        <div className="flex items-center gap-1">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-5/6"
          />
          <div
            className={`w-1/6 hover:outline hover:outline-2 p-2 select-none rounded-md text-center ${
              showPassword ? "bg-primary text-white" : "bg-white text-black"
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
      <Button type="submit" className="w-full">
        Login
      </Button>
      <Button className="w-full">
        <Link href={"/signup"}>Sign Up</Link>
      </Button>
    </form>
  );
}
