import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";

// Clerk webhook endpoint.
//
// On `user.created`, copy the user's primary email address into
// `public_metadata.owner`. This is the code-based equivalent of Clerk's
// Enterprise "custom attribute" mapping (owneremail -> owner), which isn't
// available on our custom OAuth (non-enterprise) Agent ID connection.
//
// Requires CLERK_WEBHOOK_SIGNING_SECRET (from the Clerk Dashboard webhook
// endpoint) to be set in the environment. verifyWebhook() reads it by default.
export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("[clerk-webhook] signature verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, primary_email_address_id } = evt.data;

    const primary =
      email_addresses.find((e) => e.id === primary_email_address_id) ??
      email_addresses[0];
    const ownerEmail = primary?.email_address;

    if (!ownerEmail) {
      console.warn(`[clerk-webhook] user.created ${id} has no email; skipping`);
      return new Response("OK (no email)", { status: 200 });
    }

    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(id, {
        publicMetadata: { owner: ownerEmail },
      });
      console.log(`[clerk-webhook] set owner="${ownerEmail}" on user ${id}`);
    } catch (err) {
      console.error("[clerk-webhook] updateUserMetadata failed:", err);
      // Non-2xx makes Clerk retry the delivery.
      return new Response("Failed to update user metadata", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
