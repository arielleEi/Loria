import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripe, PLANS } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { planId } = await req.json();
    const plan = PLANS[planId as keyof typeof PLANS];

    if (!plan) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    if (!plan.priceId) {
      return NextResponse.json(
        { error: "Prix Stripe non configuré. Ajoutez STRIPE_PRO_MONTHLY_PRICE_ID dans .env" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const [user] = await db.select().from(users).where(eq(users.id, session.userId));

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user.id) },
      });
      customerId = customer.id;
      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, user.id));
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?success=1`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { userId: String(user.id) },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
