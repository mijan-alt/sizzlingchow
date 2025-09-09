import { Heart, ArrowRight } from "lucide-react";
// import { useTranslations } from "next-intl";
import { type ReactNode } from "react";

import { PriceClient } from "@/components/(ecommerce)/PriceClient";
import { Media } from "@/components/Media";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { type Product } from "@/payload-types";
import { getPriceRange } from "@/utilities/getPriceRange";

export const WithInlinePrice = ({ products }: { products: Product[] }) => {
  // const t = useTranslations("ProductList");
  return (
    <>
      {products.map((product) => {
        if (typeof product.images[0] !== "string") {
          const priceRange = getPriceRange(product.variants, product.enableVariantPrices ?? false);

          let pricingComponent: ReactNode;

          if (priceRange?.length === 2) {
            pricingComponent = (
              <>
                <PriceClient pricing={priceRange[0]} />
                <span className="mx-1">-</span>
                <PriceClient pricing={priceRange[1]} />
              </>
            );
          } else if (priceRange?.length === 1) {
            pricingComponent = <PriceClient pricing={priceRange[0]} />;
          } else if (!product.enableVariantPrices && product.pricing) {
            pricingComponent = <PriceClient pricing={product.pricing} />;
          }

          return (
            // <div key={product.id} className="group relative">
            //   <Media
            //     resource={product.images[0]}
            //     className="aspect-square w-full overflow-clip rounded-md object-cover group-hover:opacity-75 lg:max-h-80"
            //   />
            //   <div className="mt-4 flex justify-between">
            //     <div className="w-3/5">
            //       <h3 className="text-sm text-gray-700">
            //         <Link href={`/product/${product.slug}`}>
            //           <span aria-hidden="true" className="absolute inset-0" />
            //           {product.title}
            //         </Link>
            //       </h3>

            //       <p className="mt-1 text-sm text-gray-500">
            //         {product.enableVariants && product.variants
            //           ? `${product.variants.length} ${product.variants.length > 1 ? t("variants-plural") : t("variants-singular")}`
            //           : ""}
            //       </p>
            //     </div>
            //     <p className="flex w-2/5 flex-wrap justify-end text-sm font-medium text-gray-900">
            //       {pricingComponent}
            //     </p>
            //   </div>
            // </div>

            <Card key={product.id} className="bg-muted/60 relative flex flex-col rounded-4xl p-2">
              <CardContent className="p-0">
                <div className="relative z-20 overflow-hidden rounded-lg">
                  <Media
                    resource={product.images[0]}
                    className="h-full"
                    imgClassName="h-72 w-full rounded-3xl object-cover"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 px-2 pb-3">
                  <div>
                    <p className="text-muted-foreground text-sm tracking-tighter">{product.title}</p>
                    <h3 className="text-2xl font-semibold tracking-tight">{pricingComponent}</h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-muted-foreground/10 hover:bg-muted-foreground/20 flex size-12 items-center justify-center gap-2 rounded-full text-sm transition-all duration-300"
                  >
                    <Link href={`/product/${product.slug}`}>
                      <ArrowRight className="size-7 -rotate-45 stroke-1" />
                    </Link>
                  </Button>
                </div>

                <div className="absolute top-4 right-4 z-20">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/30 text-background hover:bg-background/50 flex size-12 items-center justify-center gap-2 rounded-full text-sm transition-all duration-300"
                  >
                    <Heart className="size-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }
      })}
    </>
  );
};
