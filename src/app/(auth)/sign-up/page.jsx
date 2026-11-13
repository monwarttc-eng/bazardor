"use client";
import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
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

export default function SignUpPage() {
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const { data: resData, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    toast("Sign in successful");
    router.push("/sign-in");
    console.log(resData, error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Check className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign up to get started with your account.
          </p>
        </div>

        {/* Form */}
        <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
          {/* Full Name */}
          <TextField isRequired name="name" type="text">
            <Label className="font-medium text-gray-700">Full Name</Label>
            <Input
              placeholder="John Doe"
              className="h-11 rounded-lg"
              autoComplete="name"
            />
            <FieldError />
          </TextField>

          {/* Email */}
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="font-medium text-gray-700">Email Address</Label>
            <Input
              placeholder="john@example.com"
              className="h-11 rounded-lg"
              autoComplete="email"
            />
            <FieldError />
          </TextField>

          {/* Password */}
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }

              if (!/[A-Z]/.test(value)) {
                return "Include at least one uppercase letter";
              }

              if (!/[0-9]/.test(value)) {
                return "Include at least one number";
              }

              return null;
            }}
          >
            <Label className="font-medium text-gray-700">Password</Label>
            <Input
              placeholder="Enter your password"
              className="h-11 rounded-lg"
              autoComplete="new-password"
            />
            <Description className="text-xs text-gray-400">
              Minimum 8 characters, 1 uppercase letter and 1 number.
            </Description>
            <FieldError />
          </TextField>

          {/* Buttons */}
          <div className="mt-2 flex w-full gap-3">
            <Button
              type="submit"
              className="h-11 flex-1 rounded-lg bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
            >
              <Check />
              Create Account
            </Button>

            <Button
              type="reset"
              variant="secondary"
              className="h-11 rounded-lg px-6"
            >
              Reset
            </Button>
          </div>
        </Form>

        {/* Footer */}
        <div className="mt-7 border-t border-gray-100 pt-5 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
