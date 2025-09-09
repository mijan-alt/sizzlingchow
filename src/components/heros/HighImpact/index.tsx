"use client";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useHeaderTheme } from "@/providers/HeaderTheme";

// import type { Page } from "@/payload-types";

type Slide = {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
};

export const HighImpactHero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme("dark");
  });

  const slides: Slide[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      title: "Build Your Dream Home with us",
      description: "More than homes — we build dreams.",
      buttonText: "Try it for free",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      title: "Smart Homes",
      description: "Intelligent living spaces for the future",
      buttonText: "Try it for free",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      title: "Eco Friendly",
      description: "Sustainable and environmentally conscious homes",
      buttonText: "Try it for free",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
      title: "Custom Builds",
      description: "Tailored solutions for your unique vision",
      buttonText: "Try it for free",
    },
  ];
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (api) {
          api.scrollNext();
        }
      }, 50000);
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const onPointerDown = () => {
      stopAutoScroll();
    };

    const onSettle = () => {
      setTimeout(startAutoScroll, 50000);
    };

    api.on("select", onSelect);
    api.on("pointerDown", onPointerDown);
    api.on("settle", onSettle);

    startAutoScroll();

    return () => {
      stopAutoScroll();
      api.off("select", onSelect);
      api.off("pointerDown", onPointerDown);
      api.off("settle", onSettle);
    };
  }, [api]);

  // Manual dot navigation
  // const goToSlide = (index: number) => {
  //   if (api) {
  //     api.scrollTo(index);
  //   }
  // };

  return (
    <section className="mx-auto w-full">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          dragFree: false,
        }}
      >
        <CarouselContent className="-ml-4">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="basis-full pl-4 md:basis-[91%]">
              <div className="p-1">
                <div className="bg-muted relative flex h-96 flex-col items-end justify-between overflow-hidden rounded-lg p-8 md:h-[600px]">
                  {/* Background Image */}
                  <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
                    <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30" />
                  </div>

                  {/* Content */}
                  <div className="z-10 mt-16 text-white md:mt-42">
                    <h1 className="max-w-lg text-right text-3xl leading-tight font-medium tracking-tight md:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="my-4 max-w-lg text-right text-base md:my-6 md:text-lg">
                      {slide.description}
                    </p>
                  </div>

                  {/* Button */}
                  <div className="z-10 flex w-full justify-end">
                    <Button
                      variant="outline"
                      className="group flex w-fit items-center justify-center gap-2 rounded-full border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white md:text-base"
                    >
                      {slide.buttonText}
                      <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              current === index ? "w-6 bg-gray-800" : "bg-gray-400 hover:bg-gray-600"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
