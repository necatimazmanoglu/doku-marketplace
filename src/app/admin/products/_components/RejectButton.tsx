'use client';

import { useTransition } from 'react';
import { rejectProduct } from '../actions';

export default function RejectButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => rejectProduct(productId))}
      disabled={isPending}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {isPending ? 'Reddediliyor...' : 'Reddet'}
    </button>
  );
}
