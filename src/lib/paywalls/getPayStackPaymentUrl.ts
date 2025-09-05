import axios from "axios";

import { type Locale } from "@/i18n/config";
import { type Customer } from "@/payload-types";
import { type Currency } from "@/stores/Currency/types";

import { type FilledProduct } from "../getFilledProducts";

// Define interface for Paystack response
type PaystackInitializeResponse= {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

type PaystackVerifyResponse= {
  status: boolean;
  message: string;
  data: {
    reference: string;
    status: string;
    
  };
}

export const getPaystackPaymentURL = async ({
  filledProducts,

  shippingCost,
  currency,
  locale,
  secretKey,
  orderID,
  customerEmail,
  customerName,
  total,
  client,
}: {
  filledProducts: FilledProduct[];
  shippingCost: number;
  currency: Currency;
  locale: Locale;
  publicKey: string;
  secretKey: string;
  orderID: string;
  customerEmail: string;
  customerName?: string;
  total: number;
  client?: Customer;
}) => {
  try {
    // Convert amount to kobo (smallest currency unit for NGN) or cents for other currencies
    const amountInSmallestUnit = total * 100;

    // Prepare line items for metadata
    const lineItems = filledProducts.map((product) => {
      const productPrice = product.enableVariantPrices
        ? product.variant?.pricing?.find((price) => price.currency === currency)?.value
        : product.pricing?.find((price) => price.currency === currency)?.value;

      const description = [
        product.enableVariants && product.variant?.color?.label,
        product.enableVariants && product.variant?.size?.label,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        name: product.title,
        description: description,
        price: productPrice,
        quantity: product.quantity,
        total: (productPrice ?? 0) * (product.quantity ?? 0),
      };
    });

    // Create transaction initialization payload
    const transactionData = {
      email: customerEmail,
      amount: amountInSmallestUnit,
      currency: currency,
      reference: `${orderID}-${Date.now()}`,
      callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/order/${orderID}`,
      channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      metadata: {
        order_id: orderID,
        locale: locale,
        customer_id: client?.id,
        customer_name: customerName ?? customerEmail,
        line_items: lineItems,
        shipping_cost: shippingCost,
        custom_fields: [
          {
            display_name: "Order ID",
            variable_name: "order_id",
            value: orderID,
          },
          {
            display_name: "Shipping Cost",
            variable_name: "shipping_cost",
            value: shippingCost.toString(),
          },
        ],
      },
    };

    // Initialize transaction with Paystack
    const response = await axios.post<PaystackInitializeResponse>(
      "https://api.paystack.co/transaction/initialize",
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Now TypeScript knows the structure of response.data
    if (response.data.status && response.data.data.authorization_url) {
      return response.data.data.authorization_url;
    } else {
      throw new Error("Failed to initialize Paystack transaction");
    }
  } catch (error) {
    console.error("Paystack payment URL generation error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Paystack API response:", error.response?.data);
    }
    throw new Error(`Paystack payment initialization failed: ${error}`);
  }
};

// Utility function to verify payment (to be used in webhook or verification endpoint)
export const verifyPaystackPayment = async (reference: string, secretKey: string) => {
  try {
    const response = await axios.get<PaystackVerifyResponse>(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Paystack payment verification error:", error);
    throw new Error(`Payment verification failed: ${error}`);
  };
};