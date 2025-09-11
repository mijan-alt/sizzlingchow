import crypto from "crypto";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { getCachedGlobal } from "@/utilities/getGlobals";
import config from "@payload-config";

// Define Paystack event types for better type safety
type PaystackChargeSuccessData = {
  reference: string;
  metadata?: {
    order_id?: string;
  };
  status: string;
  amount?: number;
  id?: string;
};

type PaystackEvent = {
  event: string;
  data: PaystackChargeSuccessData;
};

export async function POST(req: Request) {
  try {
    console.log("hitting the webhook");
    const headersList = await headers();
    const signature = headersList.get("x-paystack-signature") ?? "";

    // Get Paystack configuration from global
    const { paystack: paystackOptions } = await getCachedGlobal("paywalls", "en", 1)();

    const webhookSecret = paystackOptions?.webhookSecret ?? "";

    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const rawBody = await req.text();

    // Verify Paystack webhook signature
    let event: PaystackEvent;

    try {
      // Verify the signature
      const hash = crypto.createHmac("sha512", webhookSecret).update(rawBody).digest("hex");

      if (hash !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }

      event = JSON.parse(rawBody) as PaystackEvent;
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
      }
      return NextResponse.json({ error: "Webhook Error: Unknown error" }, { status: 400 });
    }

    console.log("paystact event", event);

    // Handle different Paystack events
    switch (event.event) {
      case "charge.success": {
        const chargeData = event.data;
        const orderID = chargeData.metadata?.order_id ?? chargeData.reference.split("-")[0];
          console.log("order Id", orderID)
        if (chargeData.status === "success") {
          void payload.update({
            collection: "orders",
            id: orderID,
            data: {
              orderDetails: {
                status: "paid",
                transactionID: chargeData.id ?? chargeData.reference,
                amountPaid: chargeData.amount ? chargeData.amount / 100 : undefined,
              },
            },
          });

          console.log("order updated")
        }

        break;
      }

      case "charge.failed": {
        const chargeData = event.data;
        const orderID = chargeData.metadata?.order_id ?? chargeData.reference.split("-")[0];

        if (chargeData.status === "failed") {
          void payload.update({
            collection: "orders",
            id: orderID,
            data: {
              orderDetails: {
                status: "unpaid",
                transactionID: chargeData.id ?? chargeData.reference,
              },
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.event}`);
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Paystack webhook error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: "Webhook Error: Unknown error" }, { status: 400 });
  }
}
