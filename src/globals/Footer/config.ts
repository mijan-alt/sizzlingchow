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
      name: "title",
      type: "text",
      label: "Footer Title",
      admin: {
        description: "Optional title to display next to the logo"
      }
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      admin: {
        description: "Brief description about your company/service"
      }
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Social Media Links",
      fields: [
        {
          name: "platform",
          type: "select",
          label: "Platform",
          options: [
            {
              label: "Instagram",
              value: "instagram"
            },
            {
              label: "Facebook", 
              value: "facebook"
            },
            {
              label: "Twitter",
              value: "twitter"
            },
            {
              label: "LinkedIn",
              value: "linkedin"
            }
          ],
          required: true
        },
        {
          name: "url",
          type: "text",
          label: "URL",
          required: true
        }
      ],
      maxRows: 10,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/globals/Footer/SocialRowLabel#SocialRowLabel",
        },
      },
    },
    {
      name: "navItems",
      type: "array",
      label: "Navigation Sections",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Section Title",
          required: true
        },
        {
          name: "links",
          type: "array",
          label: "Links",
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 10,
        }
      ],
      maxRows: 3,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/globals/Footer/RowLabel#NavRowLabel",
        },
      },
    },
    {
      name: "legalLinks",
      type: "array",
      label: "Legal Links",
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 5,
      admin: {
        initCollapsed: true,
        description: "Links like Terms and Conditions, Privacy Policy, etc.",
        components: {
          RowLabel: "@/globals/Footer/LegalRowLabel#LegalRowLabel",
        },
      },
    },
    {
      name: "attribution",
      type: "richText",
      label: "Copyright/Attribution",
      localized: true,
      admin: {
        description: "Copyright notice or custom attribution text"
      }
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
};