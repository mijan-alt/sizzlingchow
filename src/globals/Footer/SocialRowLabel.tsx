"use client";
import { useRowLabel } from "@payloadcms/ui";

import { type Footer } from "@/payload-types";

export const SocialRowLabel = () => {
  const data = useRowLabel<NonNullable<Footer["socialLinks"]>[number]>();
  const label = data?.data?.platform && data?.data?.url
    ? `${data.data.platform.charAt(0).toUpperCase() + data.data.platform.slice(1)} - ${data.data.url}`
    : `Social Link ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}`;
  
  return <div>{label}</div>;
};