import { Card } from "@heroui/react";
import Link from "next/link";
const bn = (number) => Number(number).toLocaleString("bn-BD");
function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="rounded-2xl border border-separator">
        <Card.Content className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-default text-xl">
              {product.image}
            </div>
            <div>
              <p className="font-semibold">{product.nameBn}</p>
              <p className="text-xs text-muted">{product.unit}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted">আজকের দাম</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">
                {bn(product.today)}
                <span className="text-sm font-normal">টাকা</span>
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}
export default ProductCard;
