"use client";
import React, { useState, useEffect, useRef } from "react";

import { CMSLink } from "@/components/Link";
import { Media } from "@/components/Media";
import { Button } from "@/components/ui/button";

import type { SeasonalMenu } from "@/payload-types";

export const SeasonalMenuBlock = (props: SeasonalMenu) => {
  const { heading, subheading, description, ctaText, menuItems } = props;
  const [visibleCards, setVisibleCards] = useState<Record<number, boolean>>({});
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          if (id) {
            setVisibleCards((prev) => ({
              ...prev,
              [parseInt(id)]: entry.isIntersecting,
            }));
          }
        });
      },
      { threshold: 0.5 },
    );

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(cardRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="w-full bg-gradient-to-br py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="mb-8 lg:mb-0 lg:w-1/3 lg:pr-8">
            {subheading && <h3 className="font-script text-primary mb-2 text-2xl">{subheading}</h3>}
            <h2 className="mb-6 text-4xl leading-tight font-bold lg:text-5xl">{heading}</h2>
            {description && <p className="mb-6 text-lg leading-relaxed">{description}</p>}
            {ctaText && (
              <Button className="bg-primary hover:bg-secondary text-primary-foreground rounded-none px-8 py-3 font-medium tracking-wider transition-all duration-300">
                {ctaText}
              </Button>
            )}
          </div>

          {/* Right Grid */}
          <div className="lg:w-2/3">
            {/* Desktop Grid */}
            <div className="hidden h-[600px] md:grid md:grid-cols-3 md:grid-rows-2">
              {menuItems.map((item, i) => (
                <div
                  key={i}
                  className="group relative cursor-pointer overflow-hidden"
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setVisibleCards({ [i]: true })}
                  onMouseLeave={() => setVisibleCards({ [i]: false })}
                >
                  <Media
                    resource={item.image}
                    className="h-full"
                    imgClassName={`w-full h-full object-cover transition-transform duration-500 ${
                      visibleCards[i] ? "scale-100" : "scale-110"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      visibleCards[i] ? "bg-black/70" : "bg-opacity-0"
                    }`}
                  >
                    {visibleCards[i] && (
                      <div className="text-center text-white">
                        <h3 className="font-script mb-4 text-2xl">{item.title}</h3>
                        {item.link ? (
                          <CMSLink
                            {...item.link}
                            className="bg-primary hover:bg-secondary rounded-none px-6 py-2 font-medium tracking-wider text-white transition-all duration-300"
                          />
                        ) : (
                          <Button className="bg-primary hover:bg-secondary rounded-none px-6 py-2 text-white">
                            {item.buttonText ?? "Order Now"}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Stack */}
            <div className="flex flex-col md:hidden">
              {menuItems.map((item, i) => (
                <div
                  key={i}
                  data-id={i.toString()}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="group relative aspect-square cursor-pointer overflow-hidden"
                >
                  <Media
                    resource={item.image}
                    className="h-full"
                    imgClassName={`w-full h-full object-cover transition-transform duration-500 ${
                      visibleCards[i] ? "scale-110" : "scale-100"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      visibleCards[i] ? "bg-black/70" : "bg-opacity-0"
                    }`}
                  >
                    {visibleCards[i] && (
                      <div className="text-center text-white">
                        <h3 className="font-script mb-3 text-xl">{item.title}</h3>
                        {item.link ? (
                          <CMSLink {...item.link}>
                            <Button className="bg-primary hover:bg-secondary rounded-none px-5 py-2 text-sm text-white">
                              {item.buttonText ?? "Order Now"}
                            </Button>
                          </CMSLink>
                        ) : (
                          <Button className="bg-primary hover:bg-secondary rounded-none px-5 py-2 text-sm text-white">
                            {item.buttonText ?? "Order Now"}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
