"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
const date = new Date().toLocaleDateString("bn-BD", { dateStyle: "full" });

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Logout
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsMenuOpen(false);
          toast.success("সফলভাবে সাইন আউট হয়েছে");
          router.push("/");
          router.refresh();
        },
        onError: () => toast.error("সাইন আউট ব্যর্থ হয়েছে"),
      },
    });
  };

  // Fetch categories (API returns a plain array)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories",
        );
        if (!res.ok) throw new Error("Failed to fetch categories");

        const result = await res.json();
        setCategories(Array.isArray(result) ? result : result.data || []);
      } catch (error) {
        toast.error("Category fetching error:", error);
      }
    };

    fetchCategories();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  // Reusable category links
  const categoryLinks = categories.map((cat) => {
    const isActive = pathname === `/category/${cat.slug}`;
    return (
      <li key={cat.id}>
        <Link
          href={`/category/${cat.slug}`}
          className={
            isActive ? "font-semibold text-accent" : "hover:text-accent"
          }
          onClick={closeMenu}
        >
          {cat.icon} {cat.nameBn}
        </Link>
      </li>
    );
  });

  const authLinks = (
    <>
      <Link href="/sign-in" className="block py-2" onClick={closeMenu}>
        Login
      </Link>
      <Link href="/sign-up" onClick={closeMenu}>
        <Button>Sign Up</Button>
      </Link>
    </>
  );

  const authSection = isPending ? (
    <p>Loading...</p>
  ) : data?.user ? (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar size="sm">
          <Avatar.Image
            src={data.user.image || undefined}
            alt={data.user.name || "user"}
          />
          <Avatar.Fallback>
            {data.user.name?.[0]?.toUpperCase() || "U"}
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <p className="truncate text-sm font-medium">{data.user.name}</p>
          <p className="truncate text-xs text-muted">{data.user.email}</p>
        </div>

        <Dropdown.Menu
          onAction={(key) => {
            if (key === "profile") {
              closeMenu();
              router.push("/profile");
            }
            if (key === "logout") handleLogout();
          }}
        >
          <Dropdown.Item id="profile" textValue="Profile">
            <Label>👤 আমার প্রোফাইল</Label>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Logout" variant="danger">
            <Label>Logout</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  ) : (
    authLinks
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      {/* FIRST ROW */}
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                className="h-10 w-10 rounded-lg bg-green-700 px-5 text-sm font-semibold text-white shadow-[0_3px_0_0_#14532d]"
                src="/logo-icon.png"
                alt="bazar logo"
                width={10}
                height={10}
              />
            </Link>
            <div>
              <p className="mt-3 text-xl font-bold text-gray-900 md:text-xl">
                বাজার দর
              </p>
              <p>{date}</p>
            </div>
          </div>
        </div>

        {/* Desktop nav */}

        {/* Desktop auth */}
        <div className="hidden items-center gap-4 md:flex">{authSection}</div>
      </header>

      {/* SECOND ROW: CATEGORIES (desktop only) */}
      <div className="hidden border-t border-separator px-6 py-3 md:block">
        <ul className="mx-auto flex max-w-5xl flex-wrap gap-5">
          {categoryLinks}
        </ul>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
          <ul className="flex flex-col gap-3 p-4">{navLinks}</ul>

          <div className="border-t border-separator p-4">
            <p className="mb-3 font-semibold">Categories</p>
            <ul className="flex flex-col gap-3">{categoryLinks}</ul>
          </div>

          <div className="border-t border-separator p-4">{authSection}</div>
        </div>
      )}
    </nav>
  );
}
