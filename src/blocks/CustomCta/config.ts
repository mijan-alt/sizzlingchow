import { link } from "@/fields/link";

import type { Block } from "payload";


export const CustomCta: Block = {
  slug: "customCta",
  interfaceName:"customCta",
  labels: {
    singular: "CTA Block",
    plural: "CTA Blocks",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "subheading",
      type: "text",
    },
    {
      name: "backgroundImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    link({
      appearances: false, 
    }),
  ],
};
