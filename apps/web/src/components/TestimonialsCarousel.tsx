"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { STUDENT_TESTIMONIALS } from "@/data/testimonials";

export default function TestimonialsCarousel() {
  // Current index points to the starting item of the 2-item sliding window:
  // e.g., index 0 shows [0, 1] (cards 1 & 2), next -> index 1 shows [1, 2] (cards 2 & 3), next -> index 2 shows [2, 3] (cards 3 & 4), etc.
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const total = STUDENT_TESTIMONIALS.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Autoplay swipe every 6 seconds if not hovered/paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [startIndex, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setStartIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setStartIndex((prev) => (prev - 1 + total) % total);
  };

  // Determine the 2 visible items for desktop, or 1 item for mobile
  const visibleItems = isMobile
    ? [STUDENT_TESTIMONIALS[startIndex % total]]
    : [
        STUDENT_TESTIMONIALS[startIndex % total],
        STUDENT_TESTIMONIALS[(startIndex + 1) % total],
      ];

  return (
    <section 
      aria-label="What Our Students Say About Us"
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="text-amber-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
          Testimonials & Reviews
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mt-2 mb-3">
          What Our Students Say About Us
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-200 mx-auto rounded-full" />
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrow Prev - Fixed at a standard position */}
        <button
          onClick={handlePrev}
          aria-label="Previous Testimonials"
          className="absolute -left-2 sm:-left-6 top-[130px] z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-amber-400/30 hover:border-amber-400 text-amber-300 flex items-center justify-center backdrop-blur-md shadow-2xl transition-all cursor-pointer pop-hover"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Navigation Arrow Next - Fixed at a standard position */}
        <button
          onClick={handleNext}
          aria-label="Next Testimonials"
          className="absolute -right-2 sm:-right-6 top-[130px] z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-amber-400/30 hover:border-amber-400 text-amber-300 flex items-center justify-center backdrop-blur-md shadow-2xl transition-all cursor-pointer pop-hover"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slides Track with Smooth Sliding Animation and standardized min-height */}
        <div className="overflow-hidden px-2 sm:px-6 min-h-[300px] sm:min-h-[280px]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={startIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-2"
              } gap-6 md:gap-8 items-stretch`}
            >
              {visibleItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="glass-container rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-amber-400/30 transition-all shadow-xl pop-hover group relative overflow-hidden min-h-[260px] sm:min-h-[270px]"
                >

                  {/* Decorative background quote mark */}
                  <Quote className="absolute -top-3 -right-3 w-20 h-20 text-white/5 pointer-events-none group-hover:text-amber-400/10 transition-colors" />

                  {/* Stars Rating */}
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>

                    {/* Testimonial Quote Bubble */}
                    <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed italic mb-6">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author / Student Details */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-bold text-sm shadow-md">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </h4>
                      {item.relation && (
                        <p className="text-xs text-emerald-200/60 font-medium">
                          {item.relation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Swipe Indicators / Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {STUDENT_TESTIMONIALS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => {
                setDirection(dotIdx > startIndex ? 1 : -1);
                setStartIndex(dotIdx);
              }}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                startIndex === dotIdx
                  ? "w-8 bg-amber-400 shadow-md shadow-amber-400/30"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
