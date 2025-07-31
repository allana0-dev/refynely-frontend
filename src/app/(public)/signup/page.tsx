"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { setToken } from "../../../lib/useSetToken";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const signupSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onGoogle = async () => {
    const t = toast.loading("Signing in with Google…");
    try {
      await loginWithGoogle();
      const token = await (
        await import("../../../lib/firebase")
      ).auth.currentUser!.getIdToken();
      await setToken(token);
      toast.success("Welcome back!", { id: t });
      router.replace("/presentations/me");
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed", { id: t });
    }
  };

  const onEmail = async (data: SignupData) => {
    const t = toast.loading("Creating your account…");
    try {
      await signup(data.firstName, data.lastName, data.email, data.password);
      const token = await (
        await import("../../../lib/firebase")
      ).auth.currentUser!.getIdToken();
      await setToken(token);
      toast.success("Account created!", { id: t });
      router.replace("/presentations/me");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email in use – please log in instead.", { id: t });
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else if (err.code === "auth/weak-password") {
        toast.error("Password is too weak.", { id: t });
      } else {
        toast.error(err.message || "Sign-up failed.", { id: t });
      }
    }
  };

  return (
    <div className="min-h-screen lg:flex">
      <div className="lg:w-1/2 flex flex-col justify-center px-6 lg:px-24 py-12 bg-white">
        <div className="max-w-md w-full mx-auto space-y-8">
          <h1 className="text-4xl font-bold">Sign up</h1>
          <p className="text-gray-600">
            Create an account and start generating and refyning AI-powered
            decks.
          </p>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input {...register("firstName")} placeholder="First name" />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Input {...register("lastName")} placeholder="Last name" />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Input {...register("email")} type="email" placeholder="Email" />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                {...register("password")}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
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
              Sign up
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

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
