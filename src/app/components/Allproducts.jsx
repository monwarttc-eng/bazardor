"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

const UNIT_BN = { kg: "কেজি", litre: "লিটার", dozen: "ডজন", piece: "পিস" };

const toBn = (n, digits = 1) =>
  Number(n).toLocaleString("bn-BD", { maximumFractionDigits: digits });

const CHANGE_STYLE = {
  up: { icon: "▲", cls: "bg-red-50 text-red-600" },
  down: { icon: "▼", cls: "bg-green-50 text-green-600" },
  flat: { icon: "━", cls: "bg-gray-100 text-gray-600" },
};

const AllProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
        setError("তথ্য লোড করা যায়নি");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ক্যাটাগরি তালিকা ও প্রতিটির পণ্য সংখ্যা
  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const entry = map.get(p.category) || { name: p.categoryNameBn, count: 0 };
      entry.count += 1;
      map.set(p.category, entry);
    });
    return [...map].map(([key, v]) => ({ key, ...v }));
  }, [products]);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section
      id="all-products"
      className="mx-auto w-full max-w-[1200px] px-4 py-8"
    >
      {/* Heading + count */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
        <p className="text-sm text-gray-600">
          মোট{" "}
          <span className="font-semibold text-gray-900">
            {toBn(products.length, 0)}
          </span>
          টি পণ্যের মধ্যে{" "}
          <span className="font-semibold text-green-700">
            {toBn(filtered.length, 0)}
          </span>
          টি দেখানো হচ্ছে
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === "all"
              ? "border-green-700 bg-green-700 text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          সব ({toBn(products.length, 0)})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === cat.key
                ? "border-green-700 bg-green-700 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat.name} ({toBn(cat.count, 0)})
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const style = CHANGE_STYLE[item.change.dir] || CHANGE_STYLE.flat;

          return (
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
                <span
                  className={`rounded-full px-2 py-1 text-sm font-semibold ${style.cls}`}
                >
                  {style.icon} {toBn(Math.abs(item.change.pct))}%
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                গতকাল: ৳{toBn(item.yesterday, 0)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default AllProductsSection;
