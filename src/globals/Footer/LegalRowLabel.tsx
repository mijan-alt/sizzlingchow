"use client";
import { useRowLabel } from "@payloadcms/ui";

import { type Footer } from "@/payload-types";

export const LegalRowLabel = () => {
  const data = useRowLabel<NonNullable<Footer["legalLinks"]>[number]>();
  const label = data?.data?.link?.label
    ? `Legal Link ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}: ${data.data.link.label}`
    : `Legal Link ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}`;

  return <div>{label}</div>;
};
