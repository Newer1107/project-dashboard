"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap, Loader2, AlertCircle, CheckCircle2, Monitor } from "lucide-react";
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

// ─── Schema (unchanged) ──────────────────────────────────────────────────────
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

// ─── Design tokens ───────────────────────────────────────────────────────────
const NAVY = "#0B2458";
const GOLD = "#D97706";

// ─── Left branding panel ─────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div
      className="hidden lg:flex lg:flex-col lg:w-[260px] xl:w-[300px] flex-shrink-0 relative overflow-hidden"
      style={{ background: NAVY, color: "#fff", padding: "44px 32px" }}
    >
      {/* Hex grid background pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.05 }}
        viewBox="0 0 300 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="hexgrid" x="0" y="0" width="50" height="57" patternUnits="userSpaceOnUse">
            <polygon
              points="25,3 47,15 47,42 25,54 3,42 3,15"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="300" height="700" fill="url(#hexgrid)" />
      </svg>

      {/* Gold accent bar */}
      <div style={{ width: 36, height: 3, background: GOLD, borderRadius: 2, marginBottom: 28 }} />

      {/* Logo */}
      <div
        style={{
          width: 52,
          height: 52,
          background: `linear-gradient(135deg, ${GOLD}, #F59E0B)`,
          borderRadius: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          boxShadow: `0 6px 20px rgba(217,119,6,0.35)`,
        }}
      >
        <GraduationCap className="text-white" style={{ width: 28, height: 28, color: NAVY }} />
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>
        TCET Mumbai
      </p>
      <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 10 }}>
        Thakur College of Engineering &amp; Technology
      </h2>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 44 }}>
        Empowering minds.<br />Engineering futures.
      </p>

      {/* Feature list */}
      {[
        "Institutional email verification for every account",
        "Separate role-based access for students & teachers",
        "Trusted by 10,000+ members of the TCET community",
      ].map((text, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0, marginTop: 6 }} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.6, margin: 0 }}>{text}</p>
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 20,
          borderTop: "0.5px solid rgba(255,255,255,0.1)",
          fontSize: 10,
          color: "rgba(255,255,255,0.28)",
        }}
      >
        © 2025 Thakur College of Engineering &amp; Technology
      </div>
    </div>
  );
}

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div
        style={{
          height: 8,
          width: step === 1 ? 22 : 8,
          borderRadius: 4,
          background: step === 1 ? GOLD : "#10B981",
          transition: "all 0.3s",
        }}
      />
      <div
        style={{
          height: 8,
          width: step === 2 ? 22 : 8,
          borderRadius: 4,
          background: step === 2 ? GOLD : "var(--border)",
          transition: "all 0.3s",
        }}
      />
      <span className="text-xs text-muted-foreground ml-1 font-medium">
        Step {step} of 2
      </span>
    </div>
  );
}

// ─── Role toggle cards ────────────────────────────────────────────────────────
function RoleToggle({
  value,
  onChange,
}: {
  value: "STUDENT" | "TEACHER";
  onChange: (v: "STUDENT" | "TEACHER") => void;
}) {
  const roles: { key: "STUDENT" | "TEACHER"; label: string; hint: string; icon: React.ReactNode }[] = [
    {
      key: "STUDENT",
      label: "Student",
      hint: "Instant access",
      icon: (
        <GraduationCap
          style={{ width: 16, height: 16, color: value === "STUDENT" ? GOLD : "var(--muted-foreground)" }}
        />
      ),
    },
    {
      key: "TEACHER",
      label: "Teacher",
      hint: "Pending approval",
      icon: (
        <Monitor
          style={{ width: 16, height: 16, color: value === "TEACHER" ? GOLD : "var(--muted-foreground)" }}
        />
      ),
    },
  ];

  return (
    <div className="flex gap-3">
      {roles.map(({ key, label, hint, icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="flex-1 flex items-center gap-3 rounded-lg border text-left transition-all duration-150"
            style={{
              padding: "11px 14px",
              border: active ? `2px solid ${GOLD}` : "0.5px solid var(--border)",
              background: active ? "rgba(217,119,6,0.05)" : "var(--card)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: active ? "rgba(217,119,6,0.14)" : "var(--muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              {icon}
            </div>
            <div>
              <div className="text-sm font-medium leading-none mb-1">{label}</div>
              <div className="text-xs text-muted-foreground">{hint}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── OTP digit boxes ──────────────────────────────────────────────────────────
function OTPBoxes({
  digits,
  onChange,
  onKeyDown,
  onPaste,
  refs,
}: {
  digits: string[];
  onChange: (i: number, v: string) => void;
  onKeyDown: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}) {
  return (
    <div className="flex gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => onChange(i, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={i === 0 ? onPaste : undefined}
          className="text-center text-xl font-semibold border rounded-lg transition-all duration-150 outline-none focus:ring-0"
          style={{
            width: 46,
            height: 54,
            fontSize: 22,
            border: d ? `1.5px solid #10B981` : "0.5px solid var(--border)",
            background: d ? "rgba(16,185,129,0.05)" : "var(--muted)",
            color: "var(--foreground)",
            borderRadius: 8,
            transition: "border-color 0.15s, background 0.15s",
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.border = `2px solid ${NAVY}`;
            (e.target as HTMLInputElement).style.background = "var(--card)";
          }}
          onBlur={(e) => {
            const val = (e.target as HTMLInputElement).value;
            (e.target as HTMLInputElement).style.border = val ? `1.5px solid #10B981` : "0.5px solid var(--border)";
            (e.target as HTMLInputElement).style.background = val ? "rgba(16,185,129,0.05)" : "var(--muted)";
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
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

  // OTP digit UI state (drives `otp` string above)
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync digits → otp string (used by all original logic)
  useEffect(() => {
    setOtp(digits.join(""));
  }, [digits]);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "STUDENT" },
  });

  const selectedRole = watch("role");

  // Cooldown timer (unchanged)
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  // ── OTP digit handlers ──────────────────────────────────────────────────────
  const handleDigitChange = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleDigitKey = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setDigits(paste.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Original server logic (UNCHANGED) ──────────────────────────────────────
  async function sendOtpFlow(email: string) {
    const response = await requestOTP({ email });
    if (!response.ok) throw new Error(response.message);
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

  async function onVerifyAndRegister(values: RegisterValues) {
    if (otp.length !== 6) {
      setErrorMessage("Enter a valid 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await completeRegistration({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        otp,
      });
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      const user = result.user;
      if (user.role === "TEACHER" && !user.isActive) {
        setSuccessMessage("Registration submitted. Your teacher account is pending admin approval.");
        setStep(1);
        setOtp("");
        setDigits(["", "", "", "", "", ""]);
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

  async function onFormSubmit(values: RegisterValues) {
    if (step === 1) {
      await onSubmit(values);
      return;
    }
    await onVerifyAndRegister(values);
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
  // ── End original logic ──────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* ── Left branding panel ── */}
      <BrandPanel />

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo (shown only when left panel is hidden) */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              style={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${GOLD}, #F59E0B)`,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GraduationCap className="w-5 h-5" style={{ color: NAVY }} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>TCET Mumbai</p>
              <p className="text-sm font-semibold text-foreground leading-tight">Thakur College of Engineering</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-card rounded-2xl border shadow-sm p-8">
            <StepIndicator step={step} />

            <h1 className="text-xl font-semibold mb-1">
              {step === 1 ? "Create your account" : "Check your inbox"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {step === 1
                ? "Use your TCET institutional email to register."
                : `We sent a 6-digit code to ${getValues("email")}.`}
            </p>

            {/* Alerts */}
            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive mb-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm text-emerald-600 dark:text-emerald-400 mb-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Full name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Full name
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Your full name"
                      className="h-10 text-sm"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Institutional email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="you@tcetmumbai.in"
                      className="h-10 text-sm"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Role toggle */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      I am a
                    </Label>
                    <RoleToggle
                      value={selectedRole}
                      onChange={(v) => setValue("role", v)}
                    />
                    {/* Hidden input to satisfy react-hook-form registration */}
                    <input type="hidden" {...register("role")} />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Min. 6 characters"
                        className="h-10 text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="Re-enter your password"
                        className="h-10 text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        background: isLoading ? "#B45309" : GOLD,
                      }}
                      onMouseEnter={(e) => { if (!isLoading) (e.target as HTMLElement).style.background = "#B45309"; }}
                      onMouseLeave={(e) => { if (!isLoading) (e.target as HTMLElement).style.background = GOLD; }}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {isLoading ? "Sending OTP..." : "Send OTP →"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Info box */}
                  <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground leading-relaxed">
                    The code was sent to{" "}
                    <strong className="text-foreground font-medium">{getValues("email")}</strong>.
                    Check your inbox (and spam folder) and enter the 6-digit code below.
                  </div>

                  {/* OTP boxes */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Verification code
                    </Label>
                    <OTPBoxes
                      digits={digits}
                      onChange={handleDigitChange}
                      onKeyDown={handleDigitKey}
                      onPaste={handleDigitPaste}
                      refs={otpRefs}
                    />
                  </div>

                  {/* Resend row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {cooldown > 0
                        ? `Resend available in ${cooldown}s`
                        : otpRequestedAt
                        ? "You can request a new code."
                        : ""}
                    </span>
                    <button
                      type="button"
                      onClick={onResendOtp}
                      disabled={cooldown > 0 || isLoading}
                      className="font-medium transition-opacity disabled:opacity-40"
                      style={{ color: NAVY, background: "none", border: "none", cursor: "pointer" }}
                    >
                      Resend code
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 h-11 rounded-lg border text-sm font-medium transition-colors hover:bg-muted"
                      style={{ background: "transparent", cursor: "pointer" }}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="flex-[2] h-11 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ background: otp.length === 6 && !isLoading ? GOLD : "#B45309" }}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {isLoading ? "Verifying..." : "Verify & create account"}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Sign in link */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: NAVY }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>  
  );
}