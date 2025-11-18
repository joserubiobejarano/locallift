import { NextResponse, NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Raw body is required for Stripe signature verification
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const admin = supabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const stripeCustomerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Map Stripe customer -> our user_id
        const { data: mapping, error: mapErr } = await admin
          .from("user_billing")
          .select("user_id")
          .eq("stripe_customer_id", stripeCustomerId)
          .single();

        if (mapErr || !mapping) break;

        const user_id = mapping.user_id as string;

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const price_id = subscription.items?.data?.[0]?.price?.id ?? null;
        const current_period_end = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;
        const status = subscription.status as string;

        // Update subscriptions table
        const subPayload = {
          id: subscription.id,
          user_id,
          status,
          price_id,
          current_period_end,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertErr } = await admin
          .from("subscriptions")
          .upsert(subPayload, { onConflict: "id" });

        if (upsertErr) throw upsertErr;

        // Update profiles table with plan info
        const { error: profileErr } = await admin
          .from("profiles")
          .update({
            plan_type: "starter",
            plan_status: status,
            plan_current_period_end: current_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user_id);

        if (profileErr) throw profileErr;
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const stripeCustomerId = sub.customer as string;

        // Map Stripe customer -> our user_id
        const { data: mapping, error: mapErr } = await admin
          .from("user_billing")
          .select("user_id")
          .eq("stripe_customer_id", stripeCustomerId)
          .single();

        if (mapErr || !mapping) break;

        const user_id = mapping.user_id as string;

        const price_id = sub.items?.data?.[0]?.price?.id ?? null;
        const current_period_end = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;
        const status = sub.status as string;

        // Update subscriptions table
        const payload = {
          id: sub.id as string,
          user_id,
          status,
          price_id,
          current_period_end,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertErr } = await admin
          .from("subscriptions")
          .upsert(payload, { onConflict: "id" });

        if (upsertErr) throw upsertErr;

        // Update profiles table with plan info
        const { error: profileErr } = await admin
          .from("profiles")
          .update({
            plan_type: status === "canceled" || status === "unpaid" ? "free" : "starter",
            plan_status: status,
            plan_current_period_end: current_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user_id);

        if (profileErr) throw profileErr;
        break;
      }
      default:
        // ignore other events for now
        break;
    }
  } catch (err: any) {
    return new NextResponse(`Webhook handler error: ${err.message}`, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

