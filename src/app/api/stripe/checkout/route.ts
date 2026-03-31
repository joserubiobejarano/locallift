import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { getServerAppUrl } from "@/lib/env";
import { sql } from "@/lib/db/neon";

export async function POST(request: Request) {
  try {
    const priceId = process.env.STRIPE_STARTER_PRICE_ID;
    if (!priceId) return NextResponse.json({ error: "Stripe price ID not configured" }, { status: 500 });

    const appUrl = getServerAppUrl();

    const session = await auth();
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.redirect(new URL("/login", appUrl));
    }

    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 });
    const customer = customers.data[0] ?? (await stripe.customers.create({ email: session.user.email }));

    await sql`
      INSERT INTO public.user_billing (user_id, stripe_customer_id)
      VALUES (${session.user.id}, ${customer.id})
      ON CONFLICT (user_id) DO UPDATE SET
        stripe_customer_id = EXCLUDED.stripe_customer_id
    `;

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      client_reference_id: session.user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { user_id: session.user.id },
        trial_period_days: 7,
      },
      success_url: `${appUrl}/settings?success=1`,
      cancel_url: `${appUrl}/settings?canceled=1`,
      allow_promotion_codes: true,
    });

    if (!checkout.url) return NextResponse.json({ error: "Stripe checkout URL missing" }, { status: 500 });

    return NextResponse.redirect(checkout.url, { status: 303 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const runtime = "nodejs";
