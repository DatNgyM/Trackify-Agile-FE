"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button, Input, Label } from "@/components/ui";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import { getApiErrorMessage, loginAndStoreTokens, registerUser } from "@/lib/api";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export default function RegisterPage() {
  const [imgError, setImgError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    setSubmitError(null);
    const email = data.email.trim().toLowerCase();
    try {
      await registerUser(data.fullName.trim(), email, data.password);
      await loginAndStoreTokens(email, data.password);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setSubmitError(getApiErrorMessage(err, "Đăng ký thất bại."));
    }
  };

  return (
    <div className="min-h-screen flex">
      <motion.div
        className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-background px-8 py-12 lg:px-16 shadow-lg"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <div className="w-full max-w-sm flex flex-col gap-6">
          <motion.h1 className="text-3xl font-bold text-foreground" variants={fadeInUp}>
            Đăng ký
          </motion.h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label htmlFor="register-fullName">Họ tên</Label>
              <Input
                id="register-fullName"
                type="text"
                placeholder="Họ tên"
                className="h-12 rounded-xl"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="Email"
                className="h-12 rounded-xl"
                error={errors.email?.message}
                {...register("email")}
              />
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label htmlFor="register-password">Mật khẩu</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Mật khẩu (tối thiểu 8 ký tự, theo yêu cầu BE)"
                className="h-12 rounded-xl"
                error={errors.password?.message}
                {...register("password")}
              />
            </motion.div>
            {submitError && (
              <p className="text-sm text-destructive" role="alert">
                {submitError}
              </p>
            )}
            <motion.div variants={fadeInUp}>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </motion.div>
          </form>

          <motion.p className="text-sm text-muted-foreground text-center" variants={fadeInUp}>
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline underline-offset-2"
            >
              Đăng nhập
            </Link>
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="hidden lg:flex lg:w-1/2 relative bg-foreground items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative w-full h-full min-h-[500px]">
          {!imgError ? (
            <img
              src="/hero-image.png"
              alt="Laptop with code editor"
              className="absolute inset-0 h-full w-full object-cover object-center"
              onError={() => setImgError(true)}
            />
          ) : null}
          <div
            className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground"
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  );
}
