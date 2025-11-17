import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase/server";
import { getServerAppUrl } from "@/lib/env";

export async function POST() {
  try {
    const appUrl = getServerAppUrl();

    const supabase = await supabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.email) return NextResponse.redirect(new URL("/login", appUrl));

    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 });
    const customer = customers.data[0] ?? (await stripe.customers.create({ email: session.user.email }));

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${appUrl}/settings`,
    });

    if (!portal.url) return NextResponse.json({ error: "Stripe portal URL missing" }, { status: 500 });

    return NextResponse.redirect(portal.url, { status: 303 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const runtime = "nodejs";

