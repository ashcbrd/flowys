import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  processWebhookEvent,
  type DodoWebhookEvent,
} from "@/lib/payments";

/**
 * POST /api/webhooks/dodo
 *
 * Webhook endpoint for DodoPayments events.
 * Handles subscription lifecycle events and automatically updates user plans.
 *
 * Events handled:
 * - subscription.active: Subscription successfully activated
 * - subscription.renewed: Subscription renewed for next billing period
 * - subscription.on_hold: Payment failed, subscription on hold
 * - subscription.failed: Subscription creation failed
 * - subscription.cancelled: Subscription cancelled
 * - subscription.updated: Subscription modified (plan change, etc.)
 * - payment.succeeded: Payment completed (informational)
 * - payment.failed: Payment failed (informational)
 */
export async function POST(request: NextRequest) {
  console.log("=== DodoPayments webhook received ===");

  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    console.log("Raw body received, length:", rawBody.length);

    // Get Standard Webhooks headers
    const signature = request.headers.get("webhook-signature");
    const webhookId = request.headers.get("webhook-id");
    const timestamp = request.headers.get("webhook-timestamp");

    // Log headers for debugging
    console.log("Webhook headers:", {
      signature: signature ? `${signature.substring(0, 20)}...` : null,
      webhookId,
      timestamp,
      allHeaders: Object.fromEntries(request.headers.entries()),
    });

    if (!signature) {
      console.error("Missing webhook-signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Check for replay attacks (reject if timestamp is more than 5 minutes old)
    if (timestamp) {
      const timestampSeconds = parseInt(timestamp, 10);
      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - timestampSeconds) > 300) {
        console.error("Webhook timestamp too old, possible replay attack");
        return NextResponse.json(
          { error: "Timestamp expired" },
          { status: 401 }
        );
      }
    }

    // Verify webhook signature (uses Standard Webhooks format)
    let isValid: boolean;
    try {
      isValid = verifyWebhookSignature(rawBody, signature, webhookId || undefined, timestamp || undefined);
      console.log("Signature verification result:", isValid);
    } catch (configError) {
      console.error("Webhook configuration error:", configError);
      return NextResponse.json(
        { error: "Webhook not configured", details: "Webhook secret is missing from environment variables" },
        { status: 503 }
      );
    }

    if (!isValid) {
      console.error("Invalid webhook signature - verification failed");
      console.log("Raw body length:", rawBody.length);
      console.log("Raw body preview:", rawBody.substring(0, 200));
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the event
    let event: DodoWebhookEvent;
    try {
      event = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Failed to parse webhook payload:", parseError);
      console.error("Raw body:", rawBody);
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Log the event structure for debugging
    console.log("Webhook event received:", JSON.stringify(event, null, 2));

    // Validate event structure - be more flexible with the structure
    if (!event.type) {
      console.error("Invalid event structure - missing type:", event);
      return NextResponse.json(
        { error: "Invalid event structure" },
        { status: 400 }
      );
    }

    // Normalize the event structure if needed
    // DodoPayments might send data directly instead of nested in data.payload
    if (!event.data?.payload && event.data) {
      // @ts-expect-error - normalizing event structure
      event.data = { payload: event.data };
    }

    // Process the event asynchronously
    // We return 200 immediately to acknowledge receipt
    // Processing happens in the background
    processWebhookEvent(event).catch((error) => {
      console.error(`Error processing webhook event ${event.type}:`, error);
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/dodo
 * Health check for webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/webhooks/dodo",
    events: [
      "subscription.active",
      "subscription.renewed",
      "subscription.on_hold",
      "subscription.failed",
      "subscription.cancelled",
      "subscription.updated",
      "payment.succeeded",
      "payment.failed",
    ],
  });
}
