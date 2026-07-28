import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia",
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  const getUserIdFromCustomer = async (customerId: string): Promise<number | null> => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId));
    return user?.id || null;
  };

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await getUserIdFromCustomer(sub.customer as string);
      if (!userId) break;

      const isActive = sub.status === "active" || sub.status === "trialing";
      await db
        .update(users)
        .set({
          plan: isActive ? "pro" : "free",
          creditsLimit: isActive ? 300 : 5,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));

      const subData = {
        userId,
        stripeSubscriptionId: sub.id,
        stripePriceId: sub.items.data[0]?.price.id || "",
        status: sub.status as "active" | "canceled" | "past_due" | "trialing",
        currentPeriodStart: new Date((sub as unknown as { current_period_start: number }).current_period_start * 1000),
        currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        updatedAt: new Date(),
      };

      if (existing.length > 0) {
        await db
          .update(subscriptions)
          .set(subData)
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
      } else {
        await db.insert(subscriptions).values(subData);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await getUserIdFromCustomer(sub.customer as string);
      if (!userId) break;

      await db
        .update(users)
        .set({ plan: "free", creditsLimit: 5, updatedAt: new Date() })
        .where(eq(users.id, userId));

      await db
        .update(subscriptions)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
