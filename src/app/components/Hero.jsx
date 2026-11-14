import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const date = new Date().toLocaleDateString("bn-BD", { dateStyle: "full" });
const HeroPage = () => {
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 ">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <section className="rounded-3xl border border-gray-200 bg-[#f9fbf8] px-5 py-5 md:px-6">
          <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
            {/* Left: text */}
            <div className="flex-1">
              <p className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                {date}
              </p>

              <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                আজকের বাজারের দাম এক নজরে
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
                বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক
                জায়গায়।
              </p>

              <Link href="#all-products">
                <Button className="mt-6 rounded-lg bg-green-700 px-5 text-sm font-semibold text-white shadow-[0_3px_0_0_#14532d]">
                  সব পণ্য দেখুন
                </Button>
              </Link>
            </div>

            {/* Right: image */}
            <div className="shrink-0 md:pr-10">
              <Image
                src="/bazar-hero.png"
                width={200}
                height={200}
                alt="সবজি ও ফলের ঝুড়ি"
                priority
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeroPage;
