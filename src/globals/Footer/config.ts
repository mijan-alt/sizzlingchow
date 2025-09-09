import { link } from "@/fields/link";
import { revalidateGlobal } from "@/hooks/revalidateGlobal";

import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  label: "Footer",
  admin: {
    group: "Page Settings",
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      label: "Navigation Links",
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 10,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/globals/Footer/RowLabel#RowLabel",
        },
      },
    },
    {
      name: "attribution",
      type: "richText",
      label: "Attribution",
      localized: true,
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};
