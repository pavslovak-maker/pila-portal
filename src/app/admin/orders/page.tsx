import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { OrderTable } from "./OrderTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const rows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));

  // Nacti polozky pro kazkou objednavku
  const ordersWithItems = await Promise.all(
    rows.map(async (order) => {
      const items = await db
        .select({
          productName: orderItems.productName,
          unitPrice: orderItems.unitPrice,
          quantity: orderItems.quantity,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    })
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Objednavky</h1>
      <OrderTable rows={ordersWithItems} />
    </div>
  );
}
