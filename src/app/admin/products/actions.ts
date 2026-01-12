'use server';

import { prisma } from '@/lib/prismaClient';
import { revalidatePath } from 'next/cache';

export async function approveProduct(productId: string) {
  await prisma.product.update({
    where: { id: productId },
    data: { isApproved: true },
  });

  revalidatePath('/admin/products');
}

export async function rejectProduct(productId: string) {
  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath('/admin/products');
}
