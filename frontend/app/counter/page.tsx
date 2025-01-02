'use client'

import Counter from "@/components/counter"; // Ensure the correct import path

export default function CounterPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Vote on this Article</h1>
      <Counter />
    </div>
  );
}
