"use client";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );

    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.danger(error.message || "সাইন ইন করা যায়নি");
      return;
    }

    toast.success("সফলভাবে সাইন ইন হয়েছে");

    router.push("/");
  };

  const handleSocial = (provider) =>
    authClient.signIn.social({ provider, callbackURL: "/" });

  const inputStyle = "h-11 rounded-lg";
  const labelStyle = "font-medium text-gray-800";

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#f1f5f0] px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">সাইন ইন</h1>
        <p className="mt-2 text-sm text-gray-600">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </header>

      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/70 p-6 sm:p-7">
        <Form className="flex flex-col gap-5" onSubmit={handleLogin}>
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
            <Label className={labelStyle}>ইমেইল</Label>
            <Input
              placeholder="you@example.com"
              className={inputStyle}
              autoComplete="email"
            />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            validate={(v) => (v ? null : "পাসওয়ার্ড দিন")}
          >
            <Label className={labelStyle}>পাসওয়ার্ড</Label>
            <Input
              placeholder="কমপক্ষে ৮ অক্ষর"
              className={inputStyle}
              autoComplete="current-password"
            />
            <FieldError />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading}
            className="h-11 w-full rounded-lg bg-green-700 font-semibold text-white shadow-md hover:bg-green-800"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
          </Button>
        </Form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-600">অথবা</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="my-5 flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-11 rounded-lg text-sm font-semibold"
            onPress={() => handleSocial("google")}
          >
            Google দিয়ে চালিয়ে যান
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-700">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-green-700 hover:text-green-900"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </section>

      <Link href="/" className="mt-8 text-sm text-gray-500 hover:text-gray-700">
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
