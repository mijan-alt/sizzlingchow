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
      image: "/assets/chef1.jpg",
      title: "Tasty and Bity Healthy foods",
      description: "Crafted to nourish your body while delighting your taste buds..",
      buttonText: "Explore",
    },
    {
      id: 2,
      image: "/assets/chef2.jpg",
      title: "Spicy Dinner",
      description: "Served hot with bold flavors that ignite your senses.",
      buttonText: "Explore",
    },
    {
      id: 3,
      image: "/assets/chef4.jpg",
      title: "Eco-Friendly Cooking",
      description: "Using fresh, sustainable ingredients straight from nature.",
      buttonText: "Explore",
    },
    {
      id: 4,
      image: "/assets/chef1.jpg",
      title: "Custom Menus",
      description: "Designed to match your unique taste and lifestyle.",
      buttonText: "Explore",
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

  // const goToSlide = (index: number) => {
  //   if (api) {
  //     api.scrollTo(index);
  //   }
  // };

  return (
    <section className="relative mx-auto w-full">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          dragFree: false,
        }}
      >
        <CarouselContent className="">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="basis-full pl-4 md:basis-[100%]">
              <div className="">
                <div className="bg-muted relative flex h-96 flex-col items-end justify-between overflow-hidden rounded-lg p-8 md:h-[600px]">
                  {/* Background Image */}
                  <div className="pointer-events-none absolute top-0 left-0 h-full w-full">
                    <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/50" />
                  </div>

                  {/* Content */}
                  <div className="align-start z-10 mt-16 text-white md:mt-42">
                    <h1 className="font-tangerine text-primary max-w-lg text-start text-3xl leading-tight font-medium md:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="text-bold my-4 max-w-lg text-start text-3xl">{slide.description}</p>
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
      <div className="absolute bottom-4 z-10 mt-6 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              current === index ? "bg-primary w-6" : "hover:bg-primary bg-gray-400"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      {/* Navigation Dots */}
    </section>
  );
};
