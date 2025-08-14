import { type PayloadRequest, type Payload, type CollectionSlug, type File } from "payload";

const collections: CollectionSlug[] = [
  "categories",
  "productCategories",
  "productSubCategories",
  "products",
  "productReviews",
  "customers",
  "orders",
  "media",
  "pages",
  "posts",
  "forms",
  "form-submissions",
  "search",
];

export const seed = async ({ req }: { req: PayloadRequest }): Promise<void> => {
  console.log("🌱 Starting database seeding...");

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is required");
  }

  if (!process.env.DATABASE_URI) {
    throw new Error("DATABASE_URI environment variable is required");
  }

  const payload = req.payload;

  payload.logger.info(`— Clearing collections and globals...`);

  await Promise.all(collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })));

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  );

  try {
    // Seed Categories and Subcategories
    await seedCategories(payload);

    // Seed Shop Settings
    await seedShopSettings(payload);

    // Seed Shop Layout
    await seedShopLayout(payload);

    // Seed Fulfilment
    await seedFulfilment(payload);

    // Seed Header & Footer
    await seedHeaderFooter(payload);

    // Seed Sample Products
    await seedProducts(payload);

    // Seed Sample Pages
    await seedPages(payload);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
};

async function seedCategories(payload: Payload) {
  console.log("📂 Creating product categories...");

  const categories = [
    {
      title: {
        en: "Shoes",
        pl: "Buty",
      },
      slug: "shoes",
      subcategories: [
        {
          title: {
            en: "Flip flops",
            pl: "Flip flops",
          },
          slug: "flip-flops",
        },
        {
          title: {
            en: "Sport shoes",
            pl: "Buty sportowe",
          },
          slug: "sport-shoes",
        },
        {
          title: {
            en: "Elegant Shoes",
            pl: "Buty eleganckie",
          },
          slug: "elegant-shoes",
        },
      ],
    },
    {
      title: {
        en: "Watches",
        pl: "Zegarki",
      },
      slug: "watches",
      subcategories: [
        {
          title: {
            en: "Sport watches",
            pl: "Zegarki sportowe",
          },
          slug: "sport-watches",
        },
        {
          title: {
            en: "Elegant watches",
            pl: "Zegarki eleganckie",
          },
          slug: "elegant-watches",
        },
      ],
    },
  ];

  for (const category of categories) {
    try {
      const createdCategory = await payload.create({
        collection: "productCategories",
        locale: "en",
        data: {
          slug: category.slug,
          title: category.title.en,
        },
      });

      await payload.update({
        collection: "productCategories",
        locale: "pl",
        id: createdCategory.id,
        data: {
          title: category.title.pl,
        },
      });

      console.log(`✅ Created category: ${category.title.en}`);

      // Create subcategories
      for (const subcategory of category.subcategories) {
        await payload.create({
          collection: "productSubCategories",
          locale: "en",
          data: {
            slug: subcategory.slug,
            title: subcategory.title.en,
            category: createdCategory.id,
          },
        });

        await payload.update({
          collection: "productSubCategories",
          locale: "pl",
          id: createdCategory.id,
          data: {
            title: subcategory.title.pl,
          },
        });
      }
    } catch (error) {
      console.log(`ℹ️ Category ${category.title.en} already exists or creation failed: ${error}`);
    }
  }
}

async function seedFulfilment(payload: Payload) {
  console.log("📦 Filling fulfilment data...");
  try {
    await payload.updateGlobal({
      slug: "fulfilment",
      data: {
        shopAddress: {
          address: "123 Main St",
          city: "Anytown",
          country: "gb",
          region: "Manchester",
          email: "hello@mandala.sh",
          name: "Mandala SH",
          phone: "+48123123123",
          postalCode: "00-000",
        },
      },
    });
    console.log("✅ Fulfilment data created");
  } catch (error) {
    console.log(`ℹ️ Fulfilment data already exist or creation failed: ${error}`);
  }
}

async function seedShopSettings(payload: Payload) {
  console.log("🏪 Creating shop settings...");

  try {
    await payload.updateGlobal({
      slug: "shopSettings",
      data: {
        enableOAuth: false,
        availableCurrencies: ["USD", "EUR", "PLN"],
        currencyValues: [
          { currency: "USD", value: 0.25 },
          { currency: "EUR", value: 0.23 },
          { currency: "PLN", value: 4.03 },
        ],
      },
    });
    console.log("✅ Shop settings created");
  } catch (error) {
    console.log(`ℹ️ Shop settings already exist or creation failed: ${error}`);
  }
}

async function seedShopLayout(payload: Payload) {
  console.log("🎨 Creating shop layout...");

  try {
    await payload.updateGlobal({
      slug: "shopLayout",
      locale: "en",
      data: {
        productDetails: {
          type: "WithImageGalleryExpandableDetails",
          reviewsEnabled: false,
        },
        productList: {
          filters: "withSidebar",
        },
        cartAndWishlist: {
          type: "slideOver",
        },
        checkout: {
          type: "OneStepWithSummary",
        },
        clientPanel: {
          type: "withSidebar",
          help: {
            content: {
              root: {
                children: [{ text: "Contact our support team for assistance." }],
              },
            },
            title: "Need Help?",
          },
        },
      },
    });

    await payload.updateGlobal({
      slug: "shopLayout",
      locale: "pl",
      data: {
        clientPanel: {
          type: "withSidebar",
          help: {
            content: {
              root: {
                children: [{ text: "Skontaktuj się z naszym zespołem." }],
              },
            },
            title: "Potrzebujesz pomocy?",
          },
        },
      },
    });

    console.log("✅ Shop layout created");
  } catch (error) {
    console.log(`ℹ️ Shop layout already exists or creation failed: ${error}`);
  }
}

async function seedHeaderFooter(payload: Payload) {
  console.log("🧭 Creating header and footer...");

  try {
    await payload.updateGlobal({
      slug: "header",
      locale: "en",
      data: {
        type: "default",
        hideOnScroll: false,
        background: "#000000",
        navItems: [
          {
            link: {
              type: "custom",
              url: "/",
              label: "Home",
            },
          },
        ],
      },
    });

    await payload.updateGlobal({
      slug: "header",
      locale: "pl",
      data: {
        navItems: [
          {
            link: {
              type: "custom",
              url: "/",
              label: "Strona główna",
            },
          },
        ],
      },
    });

    console.log("✅ Header and footer created");
  } catch (error) {
    console.log(`ℹ️ Header/footer already exist or creation failed: ${error}`);
  }
}

async function seedProducts(payload: Payload) {
  console.log("📦 Creating sample products...");

  const [flipFlopsMain, greenFlipFlopsMain, blueFlipFlopsMain, purpleFlipFlopsMain, redFlipFlopsMain] =
    await Promise.all([
      fetchFileByURL("https://ecommerce.mandala.sh/api/media/file/flip-flops.jpg"),
      fetchFileByURL("https://ecommerce.mandala.sh/api/media/file/green-flip-flops.jpg"),
      fetchFileByURL("https://ecommerce.mandala.sh/api/media/file/blue-flip-flops.jpg"),
      fetchFileByURL("https://ecommerce.mandala.sh/api/media/file/purple-flip-flops.jpg"),
      fetchFileByURL("https://ecommerce.mandala.sh/api/media/file/red-flip-flops.webp"),
    ]);

  const [
    flipFlopsMainDoc,
    greenFlipFlopsMainDoc,
    blueFlipFlopsMainDoc,
    purpleFlipFlopsMainDoc,
    redFlipFlopsMainDoc,
  ] = await Promise.all([
    payload.create({
      collection: "media",
      data: {
        alt: "Flip Flops",
      },
      file: flipFlopsMain,
    }),
    payload.create({
      collection: "media",
      data: {
        alt: "Flip Flops",
      },
      file: greenFlipFlopsMain,
    }),
    payload.create({
      collection: "media",
      data: {
        alt: "Flip Flops",
      },
      file: blueFlipFlopsMain,
    }),
    payload.create({
      collection: "media",
      data: {
        alt: "Flip Flops",
      },
      file: purpleFlipFlopsMain,
    }),
    payload.create({
      collection: "media",
      data: {
        alt: "Flip Flops",
      },
      file: redFlipFlopsMain,
    }),
  ]);

  const shoesCategory = (
    await payload.find({
      collection: "productCategories",
      where: {
        slug: {
          equals: "shoes",
        },
      },
    })
  ).docs[0];

  const flipFlopsSubcategory = (
    await payload.find({
      collection: "productSubCategories",
      where: {
        slug: {
          equals: "flip-flops",
        },
      },
    })
  ).docs[0];

  const flipFlops = {
    title: {
      en: "Flip flops",
      pl: "Klapki",
    },
    slug: "flip-flops",
    images: [flipFlopsMainDoc.id],
    slugLock: false,
    details: [
      {
        title: {
          en: "Size Chart",
          pl: "Tabela rozmiarów",
        },
        content: {
          en: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 1,
                      mode: "normal",
                      style: "",
                      text: "Men's sizes:",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "paragraph",
                  version: 1,
                  textFormat: 0,
                  textStyle: "",
                },
                {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "40 EU | 7 US | 25.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 1,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "41 EU | 8 US | 25.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 2,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "42 EU | 9 US | 26.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 3,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "43 EU | 10 US | 26.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 4,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "44 EU | 11 US | 27.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 5,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "45 EU | 12 US | 27.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 6,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "list",
                  version: 1,
                  listType: "bullet",
                  start: 1,
                  tag: "ul",
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 1,
                      mode: "normal",
                      style: "",
                      text: "Women's sizes:",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "paragraph",
                  version: 1,
                  textFormat: 0,
                  textStyle: "",
                },
                {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "36 EU | 6 US | 23.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 1,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "37 EU | 7 US | 23.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 2,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "38 EU | 8 US | 24.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 3,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "39 EU | 9 US | 24.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 4,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "40 EU | 10 US | 25.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 5,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "41 EU | 11 US | 25.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 6,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "list",
                  version: 1,
                  listType: "bullet",
                  start: 1,
                  tag: "ul",
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "root",
              version: 1,
              textFormat: 1,
            },
          },
          pl: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 1,
                      mode: "normal",
                      style: "",
                      text: "Rozmiary męskie:",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "paragraph",
                  version: 1,
                  textFormat: 0,
                  textStyle: "",
                },
                {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "40 EU | 7 US | 25.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 1,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "41 EU | 8 US | 25.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 2,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "42 EU | 9 US | 26.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 3,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "43 EU | 10 US | 26.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 4,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "44 EU | 11 US | 27.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 5,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "45 EU | 12 US | 27.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 6,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "list",
                  version: 1,
                  listType: "bullet",
                  start: 1,
                  tag: "ul",
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 1,
                      mode: "normal",
                      style: "",
                      text: "Rozmiary damskie:",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "paragraph",
                  version: 1,
                  textFormat: 0,
                  textStyle: "",
                },
                {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "36 EU | 6 US | 23.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 1,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "37 EU | 7 US | 23.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 2,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "38 EU | 8 US | 24.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 3,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "39 EU | 9 US | 24.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 4,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "40 EU | 10 US | 25.0 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 5,
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "41 EU | 11 US | 25.5 cm",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "start",
                      indent: 0,
                      type: "listitem",
                      version: 1,
                      value: 6,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "list",
                  version: 1,
                  listType: "bullet",
                  start: 1,
                  tag: "ul",
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "root",
              version: 1,
              textFormat: 1,
            },
          },
        },
      },
    ],
    categoriesArr: [
      {
        category: shoesCategory.id,
        subcategories: [flipFlopsSubcategory.id],
      },
    ],
    variantsType: "colorsAndSizes",
    colors: [
      {
        label: {
          en: "Colorful",
          pl: "Kolorowy",
        },
        slug: "colorful",
        colorValue: "linear-gradient(to top left,#ff75c3,#ffa647,#ffe83f,#9fff5b,#70e2ff,#cd93ff)",
      },
      {
        label: {
          en: "Green",
          pl: "Zielony",
        },
        slug: "green",
        colorValue: "#9fff5b",
      },
      {
        label: {
          en: "Blue",
          pl: "Niebieski",
        },
        slug: "blue",
        colorValue: "#70e2ff",
      },
      {
        label: {
          en: "Purple",
          pl: "Fioletowy",
        },
        slug: "purple",
        colorValue: "#cd93ff",
      },
      {
        label: {
          en: "Red",
          pl: "Czerwony",
        },
        slug: "red",
        colorValue: "linear-gradient(to top left,#F00000,#DC281E)",
      },
    ],
    sizes: [
      {
        label: {
          en: "38",
          pl: "38",
        },
        slug: "38",
      },
      {
        label: {
          en: "39",
          pl: "39",
        },
        slug: "39",
      },
      {
        label: {
          en: "40",
          pl: "40",
        },
        slug: "40",
      },
    ],
    variants: [
      {
        size: "38",
        color: "colorful",
        variantSlug: "colorful-38",
        image: null,
        stock: 0,
        weight: 0,
        pricing: [
          {
            value: 99,
            currency: "USD",
          },
          {
            value: 323.32,
            currency: "PLN",
          },
        ],
      },
      {
        size: "38",
        color: "green",
        variantSlug: "green-38",
        image: greenFlipFlopsMainDoc.id,
        stock: 0,
        weight: 0,
        pricing: [
          {
            value: 99,
            currency: "USD",
          },
          {
            value: 323.32,
            currency: "PLN",
          },
        ],
      },
      {
        size: "38",
        color: "blue",
        variantSlug: "blue-38",
        image: blueFlipFlopsMainDoc.id,
        stock: 0,
        weight: 0,
        pricing: [
          {
            value: 89,
            currency: "USD",
          },
          {
            value: 433,
            currency: "PLN",
          },
        ],
      },
      {
        size: "39",
        color: "blue",
        variantSlug: "blue-39",
        image: blueFlipFlopsMainDoc.id,
        stock: 0,
        weight: 0,
        pricing: [
          {
            value: 89,
            currency: "USD",
          },
          {
            value: 433,
            currency: "PLN",
          },
        ],
      },
      {
        size: "40",
        color: "purple",
        variantSlug: "purple-40",
        image: purpleFlipFlopsMainDoc.id,
        stock: 0,
        weight: 0,
        pricing: [
          {
            value: 79,
            currency: "USD",
          },
          {
            value: 240,
            currency: "PLN",
          },
        ],
      },
      {
        size: "38",
        color: "purple",
        variantSlug: "purple-38",
        image: purpleFlipFlopsMainDoc.id,
        stock: 3,
        weight: 0,
        pricing: [
          {
            value: 79,
            currency: "USD",
          },
          {
            value: 240,
            currency: "PLN",
          },
        ],
      },
      {
        size: "38",
        color: "red",
        variantSlug: "red-38",
        image: redFlipFlopsMainDoc.id,
        stock: 2,
        weight: 0,
        pricing: [
          {
            value: 85.99,
            currency: "USD",
          },
          {
            value: 145.5,
            currency: "PLN",
          },
        ],
      },
      {
        size: "39",
        color: "red",
        variantSlug: "red-39",
        image: redFlipFlopsMainDoc.id,
        stock: 9,
        weight: 0,
        pricing: [
          {
            value: 85.99,
            currency: "USD",
          },
          {
            value: 145.5,
            currency: "PLN",
          },
        ],
      },
      {
        size: "40",
        color: "red",
        variantSlug: "red-40",
        image: redFlipFlopsMainDoc.id,
        stock: 0,
        weight: 0,
        pricing: [
          {
            value: 85.99,
            currency: "USD",
          },
          {
            value: 145.5,
            currency: "PLN",
          },
        ],
      },
    ],
    stock: 0,
    weight: 300,
    pricing: [
      {
        value: 129,
        currency: "USD",
      },
    ],
    bought: 4,
    enableVariantPrices: false,
    enableVariants: true,
    enableVariantWeights: false,
    _status: "published",
    description: {
      en: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 1,
                  mode: "normal",
                  style: "",
                  text: "Multicolor flip flops",
                  type: "text",
                  version: 1,
                },
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: " are a perfect way to add energy and joy to summer styling. Made from lightweight, elastic material, they provide comfort during long walks on the beach or in the city. Vibrant, multicolor patterns make every step an expression of your personality and good mood.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "start",
              indent: 0,
              type: "paragraph",
              version: 1,
              textFormat: 0,
              textStyle: "",
            },
            {
              children: [
                {
                  detail: 0,
                  format: 1,
                  mode: "normal",
                  style: "",
                  text: "Colorful features:",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "start",
              indent: 0,
              type: "paragraph",
              version: 1,
              textFormat: 0,
              textStyle: "",
            },
            {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Vibrant multicolor patterns in various combinations",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "listitem",
                  version: 1,
                  value: 1,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Lightweight and elastic water-resistant material",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "listitem",
                  version: 1,
                  value: 2,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Anti-slip sole safe on wet surfaces",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "listitem",
                  version: 1,
                  value: 3,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Quick-dry material perfect for the beach",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "listitem",
                  version: 1,
                  value: 4,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "list",
              version: 1,
              listType: "bullet",
              start: 1,
              tag: "ul",
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "These flip flops are a summer must-have. Perfect for the pool, beach, vacation trips, and everyday summer activities. Add color to your day!",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "start",
              indent: 0,
              type: "paragraph",
              version: 1,
              textFormat: 0,
              textStyle: "",
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
          textFormat: 1,
        },
      },
      pl: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 1,
                  mode: "normal",
                  style: "",
                  text: "Kolorowe japonki",
                  type: "text",
                  version: 1,
                },
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: " to doskonały sposób na dodanie energii i radości do letnich stylizacji. Wykonane z lekkiego, elastycznego materiału, zapewniają komfort podczas długich spacerów po plaży czy w mieście. Żywe, wielokolorowe wzory sprawiają, że każdy krok staje się wyrazem Twojej osobowości i dobrego humoru.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "start",
              indent: 0,
              type: "paragraph",
              version: 1,
              textFormat: 0,
              textStyle: "",
            },
            {
              children: [
                {
                  detail: 0,
                  format: 1,
                  mode: "normal",
                  style: "",
                  text: "Cechy kolorowe:",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "start",
              indent: 0,
              type: "paragraph",
              version: 1,
              textFormat: 0,
              textStyle: "",
            },
            {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Żywe, wielokolorowe wzory w różnych kombinacjach",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "listitem",
                  version: 1,
                  value: 1,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Lekki i elastyczny materiał odporny na wodę",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "listitem",
                  version: 1,
                  value: 2,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Antypoślizgowa podeszwa bezpieczna na mokrych powierzchniach",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "listitem",
                  version: 1,
                  value: 3,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Szybkoschnący materiał idealny na plażę",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "start",
                  indent: 0,
                  type: "listitem",
                  version: 1,
                  value: 4,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "list",
              version: 1,
              listType: "bullet",
              start: 1,
              tag: "ul",
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Te japonki to must-have na lato. Idealne do basenu, plaży, wakacyjnych wyjazdów oraz codziennych letnich aktywności. Dodaj koloru do swojego dnia!",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "start",
              indent: 0,
              type: "paragraph",
              version: 1,
              textFormat: 0,
              textStyle: "",
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
          textFormat: 1,
        },
      },
    },
  };

  try {
    const productRecord = (await payload.db.create({
      collection: "products",
      data: flipFlops,
    })) as { id: string };

    await payload.update({
      collection: "products",
      id: productRecord.id,
      data: {
        slug: flipFlops.slug,
      },
    });

    console.log(`✅ Created product: ${flipFlops.title.en}`);
  } catch (error) {
    console.log(`ℹ️ Product ${flipFlops.title.en} already exists or creation failed: ${error}`);
  }
}

async function seedPages(payload: Payload) {
  console.log("📄 Creating sample pages...");

  const [heroImage, contentImage] = await Promise.all([
    fetchFileByURL(
      "https://ecommerce.mandala.sh/api/media/file/shoes-shop-hero-image-for-first-section-background%201.png",
    ),
    fetchFileByURL(
      "https://ecommerce.mandala.sh/api/media/file/-find-the-perfect-shoes-for-every-occasion--sectio.png",
    ),
  ]);

  const [heroImageDoc, contentImageDoc] = await Promise.all([
    payload.create({
      collection: "media",
      data: { alt: "Hero image" },
      file: heroImage,
    }),
    payload.create({
      collection: "media",
      data: { alt: "Content image" },
      file: contentImage,
    }),
  ]);

  const shoesCategory = (
    await payload.find({
      collection: "productCategories",
      where: {
        slug: {
          equals: "shoes",
        },
      },
    })
  ).docs[0];

  const homePage = {
    hero: {
      type: "highImpact",
      richText: {
        en: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 1,
                    mode: "normal",
                    style: "",
                    text: "Step in the right direction",
                    type: "text",
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "heading",
                version: 1,
                textFormat: 1,
                tag: "h1",
              },
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                    text: "Discover a collection of shoes that blend style with comfort. From casual sneakers to elegant dress shoes.",
                    type: "text",
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
                textFormat: 0,
                textStyle: "",
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1,
          },
        },
        pl: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 1,
                    mode: "normal",
                    style: "",
                    text: "Krok w dobrą stronę",
                    type: "text",
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "heading",
                version: 1,
                textFormat: 1,
                tag: "h1",
              },
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                    text: "Odkryj kolekcję butów, które łączą styl z komfortem. Od casualowych sneakersów po eleganckie buty wizytowe.",
                    type: "text",
                    version: 1,
                  },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
                textFormat: 0,
                textStyle: "",
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1,
          },
        },
      },
      links: [
        {
          link: {
            type: "custom",
            url: "/category/shoes",
            label: {
              en: "Shop collection",
              pl: "Zobacz kolekcję",
            },
            appearance: "default",
          },
        },
      ],
      media: heroImageDoc.id,
      reversed: false,
    },
    meta: {
      pl: {
        title: "Home | Payload Website Template",
      },
    },
    slugLock: false,
    _status: "published",
    layout: [
      {
        blockType: "content",
        columns: [
          {
            size: "oneThird",
            richText: {
              en: {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "Find the perfect shoes for every occasion!",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "left",
                      indent: 0,
                      type: "heading",
                      version: 1,
                      tag: "h2",
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "Whether you're looking for comfortable shoes for daily city walks, elegant models for the office that will emphasize your professionalism, or perhaps unique creations for special occasions like weddings, galas, or important business meetings - our extensive collection offers solutions tailored to every lifestyle and need. We make sure that every customer finds the perfect footwear with us that not only looks great, but also provides comfort throughout the day.",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "left",
                      indent: 0,
                      type: "paragraph",
                      version: 1,
                      textFormat: 0,
                      textStyle: "",
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "root",
                  version: 1,
                },
              },
              pl: {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "Znajdź idealne buty na każdą okazję!",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "left",
                      indent: 0,
                      type: "heading",
                      version: 1,
                      tag: "h2",
                    },
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "Niezależnie od tego, czy szukasz wygodnych butów na codzienne spacery po mieście, eleganckich modeli do biura, które podkreślą Twój profesjonalizm, czy może wyjątkowych kreacji na specjalne okazje jak wesela, gale czy ważne spotkania biznesowe - nasza szeroka kolekcja oferuje rozwiązania dopasowane do każdego stylu życia i potrzeb. Dbamy o to, aby każdy klient znalazł u nas idealne obuwie, które nie tylko świetnie wygląda, ale także zapewnia komfort przez cały dzień.",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "left",
                      indent: 0,
                      type: "paragraph",
                      version: 1,
                      textFormat: 0,
                      textStyle: "",
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "root",
                  version: 1,
                },
              },
            },
            enableProse: true,
            paddingBottom: "none",
            paddingTop: "medium",
            link: {
              type: "reference",
              appearance: "default",
            },
          },
          {
            size: "twoThirds",
            richText: {
              en: {
                root: {
                  children: [
                    {
                      type: "upload",
                      version: 3,
                      format: "",
                      fields: null,
                      relationTo: "media",
                      value: contentImageDoc.id,
                    },
                  ],
                  direction: null,
                  format: "",
                  indent: 0,
                  type: "root",
                  version: 1,
                },
              },
              pl: {
                root: {
                  children: [
                    {
                      type: "upload",
                      version: 3,
                      format: "",
                      fields: null,
                      relationTo: "media",
                      value: contentImageDoc.id,
                    },
                  ],
                  direction: null,
                  format: "",
                  indent: 0,
                  type: "root",
                  version: 1,
                },
              },
            },
            enableProse: true,
            paddingBottom: "none",
            paddingTop: "medium",
            link: {
              type: "reference",
              appearance: "default",
            },
          },
        ],
        alignment: "center",
        spacingBottom: "none",
        spacingTop: "none",
        paddingBottom: "medium",
        paddingTop: "medium",
        radius: false,
        specifiedRadius: false,
        radiusAll: "rounded-none",
        radiusTopLeft: "rounded-tl-none",
        radiusTopRight: "rounded-tr-none",
        radiusBottomLeft: "rounded-bl-none",
        radiusBottomRight: "rounded-br-none",
        background: "",

        blockName: "Layout text",
      },
      {
        blockType: "hotspotZone",
        title: {
          en: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Our bestsellers!",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "heading",
                  version: 1,
                  tag: "h2",
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Try it yourself and see why it's worth!",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "paragraph",
                  version: 1,
                  textFormat: 0,
                  textStyle: "",
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "root",
              version: 1,
            },
          },
          pl: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Nasze najlepsze produkty!",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "heading",
                  version: 1,
                  tag: "h2",
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Kup i przekonaj się sam, że warto!",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "paragraph",
                  version: 1,
                  textFormat: 0,
                  textStyle: "",
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "root",
              version: 1,
            },
          },
        },
        type: "category",
        category: shoesCategory.id,
        sort: "-createdAt",
        appearance: "slider",
        limit: 4,
        spacingBottom: "none",
        spacingTop: "none",
        paddingBottom: "medium",
        paddingTop: "medium",
      },
    ],
    slug: "home",
    title: {
      en: "Home",
      pl: "Home",
    },
  };

  try {
    const pageRecord = (await payload.db.create({
      collection: "pages",
      data: homePage,
    })) as { id: string };

    await payload.update({
      collection: "pages",
      id: pageRecord.id,
      data: {
        slug: homePage.slug,
      },
    });
    console.log(`✅ Created page: ${homePage.title.en}`);
  } catch (error) {
    console.log(`ℹ️ Page ${homePage.title.en} already exists or creation failed: ${error}`);
  }
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: "include",
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`);
  }

  const data = await res.arrayBuffer();

  // Lepsze określenie mimetype
  const extension = url.split(".").pop()?.toLowerCase();
  let mimetype = `image/${extension}`;

  if (extension === "jpg") {
    mimetype = "image/jpeg";
  } else if (extension === "svg") {
    mimetype = "image/svg+xml";
  }

  return {
    name: url.split("/").pop() ?? `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype,
    size: data.byteLength,
  };
}
