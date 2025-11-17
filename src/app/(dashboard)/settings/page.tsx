import Link from "next/link";

import { Button } from "@/components/ui/button";
import DisconnectGoogleButton from "@/components/DisconnectGoogleButton";

import { supabaseServer } from "@/lib/supabase/server";

export default async function SettingsPage() {

  const supabase = await supabaseServer();

  const { data: { session } } = await supabase.auth.getSession();

  const userId = session?.user?.id || null;

  if (!userId) {

    return (

      <div className="max-w-xl space-y-4">

        <h1 className="text-2xl font-semibold">Settings</h1>

        <p className="text-sm text-muted-foreground">

          You’re not signed in. Please <Link href="/login" className="underline">log in</Link> to manage your account.

        </p>

        <Link href="/login"><Button>Go to login</Button></Link>

      </div>

    );

  }

  // Load profile, plan, google connection and locations (all best-effort)

  const [{ data: profile }, { data: plan }, { data: conn }, { data: locations }] = await Promise.all([

    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),

    supabase.from("v_user_plan").select("*").eq("user_id", userId).maybeSingle(),

    supabase.from("gbp_connections").select("user_id").eq("user_id", userId).maybeSingle(),

    supabase.from("gbp_locations").select("*").eq("user_id", userId).order("title"),

  ]);

  return (

    <div className="max-w-2xl space-y-8">

      <section>

        <h1 className="text-2xl font-semibold mb-2">Settings</h1>

        <p className="text-muted-foreground">Update your profile and connections.</p>

      </section>

      <section className="space-y-2">

        <h2 className="text-lg font-medium">Profile</h2>

        <div className="text-sm">

          <div><span className="font-medium">Name:</span> {profile?.full_name ?? "—"}</div>

          <div><span className="font-medium">Business:</span> {profile?.business_name ?? "—"}</div>

          <div><span className="font-medium">City:</span> {profile?.city ?? "—"}</div>

          <div><span className="font-medium">Country:</span> {profile?.country ?? "—"}</div>

        </div>

      </section>

      <section className="space-y-2">

        <h2 className="text-lg font-medium">Plan & Billing</h2>

        <p className="text-sm text-muted-foreground">

          Current: <span className="font-medium">{plan?.status ? "Paid" : (profile?.plan ?? "free")}</span>

        </p>

        <div className="flex gap-3">

          <form action="/api/stripe/checkout" method="post">

            <input type="hidden" name="priceId" value={process.env.STRIPE_PRICE_STARTER ?? ""} />

            <Button type="submit">Upgrade</Button>

          </form>

          <form action="/api/stripe/portal" method="post">

            <Button type="submit" variant="secondary">Manage Billing</Button>

          </form>

        </div>

      </section>

      <section className="space-y-2">

        <h2 className="text-lg font-medium">Google Business Profile</h2>

        {!conn ? (

          <div className="space-y-2">

            <p className="text-sm text-muted-foreground">Connect your Google account to manage locations and reviews.</p>

            <form action="/api/google/oauth/start" method="get">

              <Button type="submit">Connect Google</Button>

            </form>

          </div>

        ) : (

          <div className="space-y-3">

            <div className="flex items-center gap-3">

              <span className="text-sm">Connected ✅</span>

              <form action="/api/google/locations/sync" method="post">

                <Button type="submit" variant="secondary">Sync Locations</Button>

              </form>

              <DisconnectGoogleButton />

            </div>

            <div className="border rounded">

              <div className="p-2 text-sm font-medium border-b">Locations</div>

              <ul className="max-h-60 overflow-auto text-sm">

                {Array.isArray(locations) && locations.length > 0 ? locations.map((l: any) => (

                  <li key={l.id} className="p-2 border-b last:border-b-0">

                    <div className="font-medium">{l.title || l.location_id}</div>

                    <div className="text-muted-foreground text-xs">{l.location_id}</div>

                  </li>

                )) : <li className="p-2 text-muted-foreground">No locations yet. Click "Sync Locations".</li>}

              </ul>

            </div>

          </div>

        )}

      </section>

    </div>

  );

}
