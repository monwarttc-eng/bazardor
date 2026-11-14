import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@heroui/react";

const bn = (n) => Number(n).toLocaleString("bn-BD");
const bnPct = (n) =>
  Number(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const unitBn = { kg: "কেজি", litre: "লিটার", dozen: "ডজন", piece: "পিস" };

function SummaryCard({ title, value, note, valueClass = "" }) {
  return (
    <Card className="rounded-xl border border-separator">
      <Card.Content className="flex flex-col gap-1">
        <p className="text-xs text-muted">{title}</p>
        <p className={`text-2xl font-bold ${valueClass}`}>
          {bn(value)} <span className="text-sm font-medium">টাকা</span>
        </p>
        <p className="text-xs text-muted">{note}</p>
      </Card.Content>
    </Card>
  );
}

async function ProductContent({ params }) {
  const { id } = await params;

  const res = await fetch(
    `https://openapi.programming-hero.com/api/bazardor/products/${id}`,
  );
  if (!res.ok) notFound();

  const result = await res.json();
  const p = result.data || result;
  const markets = p.markets || [];
  const unit = unitBn[p.unit] || p.unit;

  // হিসাব
  const rows = markets.map((m) => ({
    ...m,
    avg: Math.round((m.min + m.max) / 2),
  }));
  const minMarket = rows.reduce((a, b) => (b.min < a.min ? b : a), rows[0]);
  const maxMarket = rows.reduce((a, b) => (b.max > a.max ? b : a), rows[0]);
  const overallAvg = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.avg, 0) / rows.length)
    : 0;

  const diff = p.today - p.yesterday;
  const diffText =
    diff > 0
      ? `গতকালের চেয়ে ${bn(diff)} টাকা বেশি`
      : diff < 0
        ? `গতকালের চেয়ে ${bn(Math.abs(diff))} টাকা কম`
        : "গতকালের দামের সমান";

  const dir = p.change?.dir;
  const changeColor =
    dir === "up"
      ? "text-danger"
      : dir === "down"
        ? "text-success"
        : "text-muted";
  const changeSymbol = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link href="/" className="hover:text-accent">
          হোম
        </Link>
        <span>›</span>
        <Link href={`/category/${p.category}`} className="hover:text-accent">
          {p.categoryNameBn}
        </Link>
        <span>›</span>
        <span className="text-foreground">{p.nameBn}</span>
      </nav>

      {/* Header */}
      <Card className="rounded-2xl border border-separator">
        <Card.Content className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-default text-3xl">
              {p.image}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{p.nameBn}</h1>
              <p className="text-xs text-muted">
                প্রতি {unit} · {p.categoryNameBn}
              </p>
              <p className="mt-1 text-sm text-muted">{diffText}</p>
            </div>
          </div>

          <div className="w-full rounded-xl bg-default px-5 py-3 text-center sm:w-auto">
            <p className="text-xs text-muted">আজকের দাম</p>
            <p className="text-3xl font-bold">{bn(p.today)}</p>
            <p className="text-xs text-muted">টাকা / {unit}</p>
            <p className={`mt-1 text-sm font-semibold ${changeColor}`}>
              {changeSymbol} {bnPct(Math.abs(p.change?.pct ?? 0))}%
            </p>
          </div>
        </Card.Content>
      </Card>

      {/* Summary */}
      <Card className="rounded-2xl border border-separator">
        <Card.Content className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">দামের সারসংক্ষেপ</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard
              title="সর্বনিম্ন দাম"
              value={minMarket?.min ?? 0}
              valueClass="text-success"
              note={`${minMarket?.market}, ${minMarket?.division}`}
            />
            <SummaryCard
              title="সর্বোচ্চ দাম"
              value={maxMarket?.max ?? 0}
              valueClass="text-danger"
              note={`${maxMarket?.market}, ${maxMarket?.division}`}
            />
            <SummaryCard
              title="গড় দাম"
              value={overallAvg}
              note={`${bn(rows.length)}টি বাজারের গড়`}
            />
          </div>

          {/* Market table */}
          <h2 className="mt-2 text-lg font-bold">বাজারভিত্তিক আজকের দাম</h2>
          <div className="overflow-x-auto rounded-xl border border-separator">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="bg-default text-left text-xs text-muted">
                  <th className="px-4 py-3 font-medium">বাজার</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    বিভাগ
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th className="px-4 py-3 text-right font-medium">সর্বোচ্চ</th>
                  <th className="px-4 py-3 text-right font-medium">গড়</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={`${r.market}-${r.division}`}
                    className="border-t border-separator even:bg-default/40"
                  >
                    <td className="px-4 py-3 font-medium">
                      {r.market}
                      {/* মোবাইলে বিভাগ নামের নিচে */}
                      <span className="block text-xs font-normal text-muted sm:hidden">
                        {r.division}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted sm:table-cell">
                      {r.division}
                    </td>
                    <td className="px-4 py-3 text-right">{bn(r.min)} টাকা</td>
                    <td className="px-4 py-3 text-right">{bn(r.max)} টাকা</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {bn(r.avg)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

export default function ProductDetailsPage({ params }) {
  return (
    <Suspense fallback={<p className="px-6 py-6 text-muted">লোড হচ্ছে...</p>}>
      <ProductContent params={params} />
    </Suspense>
  );
}
