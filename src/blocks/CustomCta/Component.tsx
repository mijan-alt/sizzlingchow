"use client";
import React from "react";

import { CMSLink } from "@/components/Link";
import { Media } from "@/components/Media";

import type { CustomCta } from "@/payload-types";

export const CustomCtaBlock = ({ heading, subheading, backgroundImage, link }: CustomCta) => {
  return (
    <section className="">
      <div className="">
        <div className="relative h-[300px] overflow-hidden md:h-[500px]">
          {/* Background Image */}
          <Media
            resource={backgroundImage}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover object-bottom"
          />
          {/* Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/30 p-6 text-center">
            {subheading && <h3 className="text-primary text-lg font-medium md:text-xl">{subheading}</h3>}
            <h2 className="text-2xl font-semibold text-white md:text-4xl">{heading}</h2>
            {link && (
              <CMSLink
                {...link}
                appearance="default" // or "secondary", "outline", "ghost", etc.
                size="default" // or "sm", "lg", etc.
                className="bg-primary hover:bg-secondary rounded-none px-6 py-2 font-medium tracking-wider text-white transition-all duration-300"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
