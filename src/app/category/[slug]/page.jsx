import ProductCard from "@/app/components/Productcard";
import { Card } from "@heroui/react";

const bn = (number) => Number(number).toLocaleString("bn-BD");

const CategoryDetailsPage = async ({ params }) => {
  const { slug } = await params;

  const res = await fetch(
    `https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch category products");
  }

  const result = await res.json();
  const products = Array.isArray(result) ? result : result.data || [];

  const first = products[0];

  if (!first) {
    return <div>No products found in this category.</div>;
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 ">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5">
        <Card className="rounded-2xl border border-separator">
          <Card.Content className="flex flex-row items-center gap-4">
            <span className="text-4xl">{first.categoryIcon}</span>

            <div>
              <h1 className="text-2xl font-bold">{first.categoryNameBn}</h1>
              <p className="text-sm text-muted">
                {bn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </div>
          </Card.Content>
        </Card>

        <p className="text-sm text-muted">
          মোট {bn(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
