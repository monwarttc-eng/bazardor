import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

async function ProfileContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-[#f1f6f1] px-4 py-12">
      <div className="mx-auto max-w-[560px] space-y-5">
        {/* Page Heading */}
        <div>
          <h1 className="text-2xl font-bold text-[#26332b]">আমার প্রোফাইল</h1>

          <p className="text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
          </p>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#e0e8e0] bg-white/80 p-5">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-gray-500">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate font-semibold text-[#26332b]">
              {user.name}
            </h2>

            <p className="truncate text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Profile Update Form */}
        <ProfileForm user={user} />
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f1f6f1]">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
