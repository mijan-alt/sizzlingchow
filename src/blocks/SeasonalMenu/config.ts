import { link } from "@/fields/link";

import type { Block } from "payload";

export const SeasonalMenus: Block = {
  slug: "seasonalMenu",
  interfaceName: "seasonalMenu",
  labels: {
    singular: "Seasonal Menu",
    plural: "Seasonal Menus",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
      defaultValue: "Seasonal Menus",
    },
    {
      name: "subheading",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "ctaText",
      type: "text",
      defaultValue: "Shop Now",
    },
    {
      name: "menuItems",
      type: "array",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "buttonText",
          type: "text",
          defaultValue: "Order Now",
        },

        link({
          appearances: false,
        }),
      ],
    },
  ],
};
