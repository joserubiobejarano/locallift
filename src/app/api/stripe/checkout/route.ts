import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase/server";
import { getServerAppUrl } from "@/lib/env";

export async function POST(request: Request) {
  try {
    // Use LocalLift Starter price ID from environment
    const priceId = process.env.STRIPE_STARTER_PRICE_ID;
    if (!priceId) return NextResponse.json({ error: "Stripe price ID not configured" }, { status: 500 });

    const appUrl = getServerAppUrl();

    const supabase = await supabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.email) return NextResponse.redirect(new URL("/login", appUrl));

    // Ensure a Stripe customer for this email
    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 });
    const customer = customers.data[0] ?? (await stripe.customers.create({ email: session.user.email }));

    // Insert or update user_billing mapping
    const { error: billingUpsertError } = await supabase.from("user_billing").upsert({
      user_id: session.user.id,
      stripe_customer_id: customer.id,
    });

    if (billingUpsertError) throw billingUpsertError;

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      client_reference_id: session.user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { user_id: session.user.id },
        trial_period_days: 7, // 7-day free trial
      },
      success_url: `${appUrl}/settings?success=1`,
      cancel_url: `${appUrl}/settings?canceled=1`,
      allow_promotion_codes: true,
    });

    if (!checkout.url) return NextResponse.json({ error: "Stripe checkout URL missing" }, { status: 500 });

    return NextResponse.redirect(checkout.url, { status: 303 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const runtime = "nodejs";

