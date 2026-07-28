import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "your_stripe_secret_key_here") {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

export const PLANS = {
  pro_monthly: {
    name: "Pro Mensuel",
    price: 7.9,
    currency: "eur",
    interval: "month" as const,
    credits: 300,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
  },
  pro_yearly: {
    name: "Pro Annuel",
    price: 79,
    currency: "eur",
    interval: "year" as const,
    credits: 300,
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
  },
};
