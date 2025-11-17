"use client";

import { Button } from "@/components/ui/button";

export default function DisconnectGoogleButton() {
  async function handleDisconnect() {
    const r = await fetch("/api/google/disconnect", { method: "POST" });
    if (r.ok) window.location.reload();
    else alert("Failed to disconnect");
  }

  return (
    <Button type="button" variant="secondary" onClick={handleDisconnect}>
      Disconnect
    </Button>
  );
}

