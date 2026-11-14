import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Spinner size="xl" />
    </div>
  );
}
