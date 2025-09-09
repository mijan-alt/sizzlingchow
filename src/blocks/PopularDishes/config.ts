// blocks/PopularDishes/config.ts
import type { Block } from "payload";

export const PopularDishes: Block = {
  slug: "popularDishes",
  interfaceName: "popularDishes",
  labels: {
    singular: "Popular Dishes Section",
    plural: "Popular Dishes Sections",
  },
  fields: [
    {
      name: "heading",
      type: "group",
      label: "Section Heading",
      fields: [
        {
          name: "subtitle",
          type: "text",
          label: "Subtitle",
          defaultValue: "Popular Dishes Of",
          required: true,
        },
        {
          name: "title",
          type: "text",
          label: "Main Title",
          defaultValue: "Our Restaurant",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          defaultValue:
            "Commodo Sed Egestas Egestas Fringilla Phasellus Faucibus Scelerisque Eleifend Donec. Porttitor Massa Id Neque Aliquam Vestibulum Morbi Blandit Cursus Risus. Orci Ac Auctor Augue Mauris Augue Neque Gravida In Aliquam.",
          required: true,
        },
      ],
    },
    {
      name: "backgroundImage",
      type: "upload",
      relationTo: "media",
      label: "Background Image",
      required: true,
    },
    {
      name: "dishes",
      type: "array",
      label: "Dishes",
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Dish Image",
          required: true,
        },
        {
          name: "title",
          type: "text",
          label: "Dish Title",
          required: true,
        },

        {
          name: "isSpecial",
          type: "checkbox",
          label: "Mark as Special",
          defaultValue: false,
        },
        {
          name: "orderUrl",
          type: "text",
          label: "Order URL (optional)",
          admin: {
            description: "URL for the Order Now button",
          },
        },
      ],
    },
  ],
};
