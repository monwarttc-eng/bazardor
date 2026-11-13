"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfileForm({ user }) {
  const router = useRouter();

  const [name, setName] = useState(user.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { error } = await authClient.updateUser({
        name: name,
      });

      if (error) {
        setMessage(error.message || "Profile update failed!");
        return;
      }

      setMessage("Profile updated successfully!");

      router.refresh();
    } catch (error) {
      setMessage("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-[#e0e8e0] bg-white/80 p-6">
      <h2 className="font-semibold text-[#26332b]">তথ্য</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            নাম
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম লিখুন"
            required
            className="h-10 w-full rounded-lg border border-[#dfe8df] bg-transparent px-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-10 w-full rounded-lg bg-green-700 text-sm font-semibold text-white shadow-md transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Updating..." : "আপডেট"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}
      </form>
    </div>
  );
}
