"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useHeaderTheme } from "@/providers/HeaderTheme";



// import type { Page } from "@/payload-types";

export const HighImpactHero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { setHeaderTheme } = useHeaderTheme();
 

  useEffect(() => {
    setHeaderTheme("dark");
  });




  const slides = [
    {
      id: 1,
      image: "https://cdn.pixabay.com/photo/2021/02/08/12/40/lasagna-5994612_1280.jpg",
      title: "Healthy, Hot and Spicy Thai foods",
      subtitle:
        "Aliquam phasellus torquatos nec eu, vis detraxit periculis ex, nihil expetendis in mei. Meianje icula euripidis partem.",
      buttonText: "Order Now",
    },
    {
      id: 2,
      image: "https://cdn.pixabay.com/photo/2021/02/08/12/40/lasagna-5994612_1280.jpg",
      title: "Special Offers On Fresh Meals",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
      buttonText: "Shop Now",
    },
    {
      id: 3,
      image: "https://cdn.pixabay.com/photo/2021/02/08/12/40/lasagna-5994612_1280.jpg",
      title: "Healthy Eats At Unbeatable Prices",
      subtitle:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
      buttonText: "Order Now",
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
      }, 10000);
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
      setTimeout(startAutoScroll, 10000);
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
  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
  <section className="w-full min-h-screen relative overflow-hidden">
      <Carousel
        className="w-full h-screen"
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          dragFree: false,
        }}
      >
        <CarouselContent className="h-screen">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="basis-full h-screen relative">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40" />
              </div>
              
              {/* Content Overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4 max-w-4xl mx-auto">
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {slide.title}
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
                  {slide.subtitle}
                </p>
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-none font-semibold tracking-wider text-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: "#D4A574" }}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                current === index 
                  ? "bg-yellow-600 scale-110" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

    
    </section>
  );
};
