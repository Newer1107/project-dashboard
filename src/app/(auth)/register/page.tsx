"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { completeRegistration, requestOTP } from "@/server/actions/auth";
import { signIn } from "next-auth/react";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    role: z.enum(["STUDENT", "TEACHER"]),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [otpRequestedAt, setOtpRequestedAt] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function sendOtpFlow(email: string) {
    const response = await requestOTP({ email });
    setCooldown(response.resendAfterSeconds ?? 60);
    setOtpRequestedAt(Date.now());
    setSuccessMessage(response.message);
    setStep(2);
  }

  async function onSubmit(values: RegisterValues) {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await sendOtpFlow(values.email);
    } catch (error: any) {
      setErrorMessage(error?.message || "Could not send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerifyAndRegister() {
    const values = getValues();

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const user = await completeRegistration({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        otp,
      });

      if (user.role === "TEACHER" && !user.isActive) {
        setSuccessMessage("Registration submitted. Your teacher account is pending admin approval.");
        setStep(1);
        setOtp("");
        setCooldown(0);
        router.push("/login?message=teacher_pending_approval");
        return;
      }

      const authResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (authResult?.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onResendOtp() {
    const values = getValues();
    if (!values.email) {
      setErrorMessage("Enter your email first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await sendOtpFlow(values.email);
    } catch (error: any) {
      setErrorMessage(error?.message || "Could not resend OTP.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100/80 via-background to-cyan-100/70 px-6 py-8 dark:from-indigo-900/20 dark:to-cyan-900/20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Register with an allowed institutional email.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-500">
              {successMessage}
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" {...register("name")} placeholder="Your full name" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} placeholder="you@tcetmumbai.in" />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="STUDENT" onValueChange={(value) => setValue("role", value as "STUDENT" | "TEACHER") }>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                OTP sent to {getValues("email")}. Enter the 6-digit code to complete your registration.
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {cooldown > 0
                    ? `Resend available in ${cooldown}s`
                    : otpRequestedAt
                    ? "You can request a new OTP now"
                    : ""}
                </span>
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={cooldown > 0 || isLoading}
                  className="text-primary disabled:text-muted-foreground"
                >
                  Resend OTP
                </button>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" className="w-full" disabled={isLoading || otp.length !== 6} onClick={onVerifyAndRegister}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Verify & Create Account
                </Button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
