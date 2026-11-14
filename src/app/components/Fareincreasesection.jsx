"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

const UNIT_BN = { kg: "কেজি", litre: "লিটার", dozen: "ডজন", piece: "পিস" };

const toBn = (n, digits = 1) =>
  Number(n).toLocaleString("bn-BD", { maximumFractionDigits: digits });

const FareIncreaseSection = () => {
  const [increaseFare, setIncreaseFare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        const filterData = data
          .filter((item) => item.change.dir === "up")
          .sort((a, b) => b.change.pct - a.change.pct)
          .slice(0, 6);

        setIncreaseFare(filterData);
      } catch (err) {
        console.error(err);
        setError("তথ্য লোড করা যায়নি");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8">
      <h2 className="mb-5 text-2xl font-bold text-gray-900">
        ▲ আজ যেসব পণ্যের দাম বেড়েছে
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {increaseFare.map((item) => (
          <Link
            href={`/product/${item.id}`}
            key={item.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{item.image}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{item.nameBn}</h3>
                <p className="text-xs text-gray-500">{item.categoryNameBn}</p>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xl font-bold text-gray-900">
                ৳{toBn(item.today, 0)}
                <span className="ml-1 text-xs font-normal text-gray-500">
                  /{UNIT_BN[item.unit] || item.unit}
                </span>
              </p>
              <span className="rounded-full bg-red-50 px-2 py-1 text-sm font-semibold text-red-600">
                ▲ {toBn(item.change.pct)}%
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              গতকাল: ৳{toBn(item.yesterday, 0)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FareIncreaseSection;
