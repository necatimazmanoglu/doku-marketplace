'use client';

import { useTransition } from 'react';
import { approveProduct } from '../actions';

export default function ApproveButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => approveProduct(productId))}
      disabled={isPending}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
    >
      {isPending ? 'Onaylanıyor...' : 'Onayla'}
    </button>
  );
}
