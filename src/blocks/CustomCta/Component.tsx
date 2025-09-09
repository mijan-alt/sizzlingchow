"use client";

import { ChevronRight } from "lucide-react";
import React from "react";

import { CMSLink } from "@/components/Link";
import { Media } from "@/components/Media";
import { Button } from "@/components/ui/button";

import type { CustomCta } from "@/payload-types";

export const CustomCtaBlock = ({ heading, subheading, backgroundImage, link }: CustomCta) => {
  return (
    <section className="">
      <div className="container mx-auto">
        <div className="relative h-[300px] overflow-hidden md:h-[500px]">
          {/* Background Image */}
          <Media
            resource={backgroundImage}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover object-bottom"
          />

          {/* Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/30 p-6 text-center">
            {subheading && <h3 className="text-lg font-medium text-orange-200 md:text-xl">{subheading}</h3>}
            <h2 className="text-2xl font-semibold text-white md:text-4xl">{heading}</h2>

            {link && (
              <CMSLink {...link}>
                <Button className="h-10 rounded-md px-6 text-sm font-medium">
                  {link?.label ?? "Grab your offer"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CMSLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
