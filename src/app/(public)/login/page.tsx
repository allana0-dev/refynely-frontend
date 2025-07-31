// src/app/(public)/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });


  const onGoogle = async () => {
    const t = toast.loading("Signing in with Google…");
    try {
      await loginWithGoogle();
      toast.success("Welcome back!", { id: t });
      router.replace("/presentations/me");
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed.", { id: t });
    }
  };

  const onEmail = async (data: LoginData) => {
    const t = toast.loading("Signing you in…");
    try {
      await login(data.email, data.password);
      toast.success("Logged in!", { id: t });
      router.replace("/presentations/me");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        toast.error("No account found; please sign up first.", { id: t });
        router.replace("/signup");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.", { id: t });
      } else {
        toast.error(err.message || "Login failed.", { id: t });
      }
    }
  };

  return (
    <div className="min-h-screen lg:flex">
      <div className="lg:w-1/2 flex flex-col justify-center px-6 lg:px-24 py-12 bg-white">
        <div className="max-w-md w-full mx-auto space-y-8">
          <h1 className="text-4xl font-bold">Log in</h1>
          <p className="text-gray-600">
            Welcome back! Log in and let's get refyning.
          </p>

          <Button
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-center space-x-3"
            onClick={onGoogle}
            disabled={isSubmitting}
          >
            <Image src="/icons/google-icon.svg" alt="" width={20} height={20} />
            <span>Continue with Google</span>
          </Button>

          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <form onSubmit={handleSubmit(onEmail)} className="space-y-4">
            <div>
              <Input
                {...register("email")}
                type="email"
                placeholder="Email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("password")}
                type="password"
                placeholder="Password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              disabled={isSubmitting}
            >
              Log in
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-xs text-gray-400 text-center">
            <Link href="/forgot-password" className="underline">
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>

      {/* Right: illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr items-center justify-center p-12">
        <Image
          src="/signup-image.png"
          alt="AI powered deck illustration"
          width={500}
          height={500}
          className="object-cover w-full rounded-2xl"
          priority
        />
      </div>
    </div>
  );
}
