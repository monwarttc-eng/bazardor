"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const UNIT_BN = { kg: "কেজি", litre: "লিটার", dozen: "ডজন", piece: "পিস" };

const toBn = (n, digits = 1) =>
  Number(n).toLocaleString("bn-BD", { maximumFractionDigits: digits });

const ProductItem = ({ product }) => {
  const up = product.change.dir === "up";

  return (
    <Link
      href={`/product/${product.id}`}
      className="flex items-center gap-2 border-r border-gray-200 px-5 whitespace-nowrap transition hover:bg-gray-50"
    >
      <span className="text-lg">{product.image}</span>
      <span className="font-semibold text-gray-800">{product.nameBn}</span>
      <span className="text-sm text-gray-600">
        ৳{toBn(product.today, 0)} টাকা/{UNIT_BN[product.unit] || product.unit}
      </span>
      <span
        className={`text-sm font-semibold ${
          up ? "text-red-600" : "text-green-600"
        }`}
      >
        {up ? "▲" : "▼"} {toBn(Math.abs(product.change.pct))}%
      </span>
    </Link>
  );
};

const Marque = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products",
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const res = await response.json();
        setProducts(Array.isArray(res) ? res : res.data || []);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <div className="h-11 border-y border-gray-200 bg-white" />;

  const increased = products
    .filter((p) => p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 10);

  const decreased = products
    .filter((p) => p.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 10);

  const items = [];
  for (let i = 0; i < Math.max(increased.length, decreased.length); i++) {
    if (increased[i]) items.push(increased[i]);
    if (decreased[i]) items.push(decreased[i]);
  }

  return (
    <div className="border-y border-gray-200 bg-white py-2">
      <Marquee speed={50} pauseOnHover gradient={false}>
        {items.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </Marquee>
    </div>
  );
};

export default Marque;
