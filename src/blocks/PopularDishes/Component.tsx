// blocks/PopularDishes/Component.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";

import { Media } from "@/components/Media";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import type { PopularDishes } from "@/payload-types";

export const PopularDishesBlock = (props: PopularDishes) => {
  const { heading, dishes } = props;

  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // Only apply Intersection Observer on mobile devices (max-width: 768px)
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            const id = target.dataset.id;
            if (id) {
              setVisibleCards((prev) => ({
                ...prev,
                [id]: entry.isIntersecting,
              }));
            }
          });
        },
        {
          root: null, // Use the viewport as the root
          threshold: 0.8, // Trigger when 80% of the card is visible
        },
      );

      Object.values(cardRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => {
        Object.values(cardRefs.current).forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      };
    }
  }, []);

  // Uncomment and properly type this function when you need it
  // const handleOrderClick = (dish: PopularDishes['dishes'][0]) => {
  //   if (dish.orderUrl) {
  //     window.open(dish.orderUrl, '_blank');
  //   } else {
  //     // Default action - could be a modal, navigation, etc.
  //     console.log(`Order ${dish.title}`);
  //   }
  // };

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-fixed bg-center py-16"
      style={{
        backgroundImage: `url('https://cdn.pixabay.com/photo/2021/02/08/12/40/lasagna-5994612_1280.jpg')`,
      }}
    >
      {/* White Overlay */}
      <div className="absolute inset-0 z-0 bg-white/70" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Header Section */}
        <div className="mb-12 flex flex-col items-start justify-between lg:flex-row lg:items-center">
          {/* Left Side - Title */}
          <div className="mb-8 lg:mb-0">
            <h3
              className="font-script mb-2 text-2xl text-orange-400"
              style={{ fontFamily: "Brush Script MT, cursive" }}
            >
              {heading?.subtitle}
            </h3>
            <h2 className="text-4xl font-bold text-gray-800 lg:text-5xl">{heading?.title}</h2>
          </div>

          {/* Right Side - Description */}
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed">{heading?.description}</p>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="relative">
          <Carousel
            className="w-full"
            opts={{
              align: "start",
              loop: true,
              dragFree: true, // Allows smooth dragging
            }}
          >
            <CarouselContent className="-ml-4" style={{ scrollBehavior: "smooth" }}>
              {dishes?.map((dish, index) => {
                const dishId = dish.id ?? `dish-${index}`;
                return (
                  <CarouselItem key={dishId} className="flex-shrink-0 basis-[280px] pl-4 md:basis-[275px]">
                    <Card
                      className="group aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl border-0 p-0 transition-all duration-300 hover:shadow-2xl"
                      onMouseEnter={() =>
                        typeof window !== "undefined" &&
                        window.innerWidth > 768 &&
                        setVisibleCards({ [dishId]: true })
                      }
                      onMouseLeave={() =>
                        typeof window !== "undefined" &&
                        window.innerWidth > 768 &&
                        setVisibleCards({ [dishId]: false })
                      }
                      ref={(el) => {
                        cardRefs.current[dishId] = el;
                      }}
                      data-id={dishId}
                    >
                      <CardContent className="relative h-full p-0">
                        <div className="relative h-full w-full overflow-hidden rounded-2xl">
                          <Media
                            resource={dish.image}
                            className="h-full"
                            imgClassName={`h-full w-full object-cover transition-transform duration-300 ${
                              visibleCards[dishId] ? "scale-110" : "scale-100"
                            }`}
                          />

                          {/* Special Badge */}
                          {dish.isSpecial && (
                            <div className="absolute top-4 right-4 rounded-full bg-orange-400 px-3 py-1 text-sm font-medium text-white">
                              Special
                            </div>
                          )}

                          {/* Overlay for Mobile (Intersection Observer) and Desktop (Hover) */}
                          <div
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                              visibleCards[dishId] ? "bg-black/50" : "bg-opacity-0"
                            }`}
                          >
                            {visibleCards[dishId] && (
                              <div className="translate-y-0 transform text-center text-white transition-all duration-300">
                                <h3
                                  className="font-script mb-4 text-3xl"
                                  style={{
                                    fontFamily: "Brush Script MT, cursive",
                                  }}
                                >
                                  {dish.title}
                                </h3>
                                <Button
                                  className="rounded-none bg-orange-400 px-8 py-2 font-medium tracking-wider text-white hover:bg-orange-500"
                                  style={{ backgroundColor: "#D4A574" }}
                                  // onClick={() => handleOrderClick(dish)}
                                >
                                  Order Now
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Absolutely Positioned Navigation Buttons */}
            <CarouselPrevious className="absolute top-1/2 left-4 z-20 h-12 w-12 -translate-y-1/2 rounded-full border-0 bg-white/80 shadow-lg hover:bg-white" />
            <CarouselNext className="absolute top-1/2 right-4 z-20 h-12 w-12 -translate-y-1/2 rounded-full border-0 bg-white/80 shadow-lg hover:bg-white" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
