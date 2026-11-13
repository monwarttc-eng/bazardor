"use client";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (error) {
      toast.danger(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
      return;
    }

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে");
    router.push("/sign-in");
  };

  const socialSignIn = (provider) =>
    authClient.signIn.social({ provider, callbackURL: "/" });

  const inputClass = "h-11 rounded-lg";
  const labelClass = "font-medium text-gray-800";

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f1f5f0] px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/70 p-6 sm:p-7">
        <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <TextField isRequired name="name" type="text">
            <Label className={labelClass}>নাম</Label>
            <Input
              placeholder="যেমন: রহিম উদ্দিন"
              className={inputClass}
              autoComplete="name"
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(v) =>
              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v)
                ? null
                : "সঠিক ইমেইল ঠিকানা দিন"
            }
          >
            <Label className={labelClass}>ইমেইল</Label>
            <Input
              placeholder="you@example.com"
              className={inputClass}
              autoComplete="email"
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            validate={(v) => {
              if (v.length < 8) return "কমপক্ষে ৮ অক্ষর দিন";
              if (!/[A-Z]/.test(v)) return "অন্তত একটি বড় হাতের অক্ষর দিন";
              if (!/[0-9]/.test(v)) return "অন্তত একটি সংখ্যা দিন";
              return null;
            }}
          >
            <Label className={labelClass}>পাসওয়ার্ড</Label>
            <Input
              placeholder="কমপক্ষে ৮ অক্ষর"
              className={inputClass}
              autoComplete="new-password"
            />
            <Description className="text-xs text-gray-500">
              ৮+ অক্ষর, ১টি বড় হাতের অক্ষর ও ১টি সংখ্যা।
            </Description>
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="confirmPassword"
            type="password"
            validate={(v) => (v === password ? null : "পাসওয়ার্ড মিলছে না")}
          >
            <Label className={labelClass}>পাসওয়ার্ড নিশ্চিত করুন</Label>
            <Input
              placeholder="আবার লিখুন"
              className={inputClass}
              autoComplete="new-password"
            />
            <FieldError />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading}
            className="h-11 w-full rounded-lg bg-green-700 font-semibold text-white shadow-md hover:bg-green-800"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </Button>
        </Form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-600">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-11 rounded-lg text-sm font-semibold"
            onPress={() => socialSignIn("google")}
          >
            Google দিয়ে চালিয়ে যান
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-700">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-green-700 hover:text-green-900"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <Link href="/" className="mt-8 text-sm text-gray-500 hover:text-gray-700">
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
