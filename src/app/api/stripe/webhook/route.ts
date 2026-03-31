import { NextResponse, NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db/neon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const sess = event.data.object as {
          customer: string;
          subscription: string;
        };
        const stripeCustomerId = sess.customer;
        const subscriptionId = sess.subscription;

        const mapRows = await sql`
          SELECT user_id FROM public.user_billing
          WHERE stripe_customer_id = ${stripeCustomerId}
          LIMIT 1
        `;
        const mapping = mapRows[0] as { user_id: string } | undefined;
        if (!mapping) break;

        const user_id = mapping.user_id;

        const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as {
          items?: { data?: { price?: { id?: string } }[] };
          current_period_end?: number;
          status?: string;
        };
        const price_id = subscription.items?.data?.[0]?.price?.id ?? null;
        const current_period_end = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;
        const status = subscription.status as string;

        await sql`
          INSERT INTO public.subscriptions (id, user_id, status, price_id, current_period_end, updated_at)
          VALUES (${subscriptionId}, ${user_id}, ${status}, ${price_id}, ${current_period_end}, now())
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            status = EXCLUDED.status,
            price_id = EXCLUDED.price_id,
            current_period_end = EXCLUDED.current_period_end,
            updated_at = now()
        `;

        await sql`
          UPDATE public.profiles
          SET
            plan_type = 'starter',
            plan_status = ${status},
            plan_current_period_end = ${current_period_end},
            updated_at = now()
          WHERE id = ${user_id}
        `;
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as {
          id: string;
          customer: string;
          items?: { data?: { price?: { id?: string } }[] };
          current_period_end?: number;
          status?: string;
        };
        const stripeCustomerId = sub.customer;

        const mapRows = await sql`
          SELECT user_id FROM public.user_billing
          WHERE stripe_customer_id = ${stripeCustomerId}
          LIMIT 1
        `;
        const mapping = mapRows[0] as { user_id: string } | undefined;
        if (!mapping) break;

        const user_id = mapping.user_id;

        const price_id = sub.items?.data?.[0]?.price?.id ?? null;
        const current_period_end = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;
        const status = sub.status as string;

        await sql`
          INSERT INTO public.subscriptions (id, user_id, status, price_id, current_period_end, updated_at)
          VALUES (${sub.id}, ${user_id}, ${status}, ${price_id}, ${current_period_end}, now())
          ON CONFLICT (id) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            status = EXCLUDED.status,
            price_id = EXCLUDED.price_id,
            current_period_end = EXCLUDED.current_period_end,
            updated_at = now()
        `;

        const planType =
          status === "canceled" || status === "unpaid" ? "free" : "starter";

        await sql`
          UPDATE public.profiles
          SET
            plan_type = ${planType},
            plan_status = ${status},
            plan_current_period_end = ${current_period_end},
            updated_at = now()
          WHERE id = ${user_id}
        `;
        break;
      }
      default:
        break;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    return new NextResponse(`Webhook handler error: ${message}`, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
