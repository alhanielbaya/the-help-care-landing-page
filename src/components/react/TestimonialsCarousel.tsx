import { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hasMoreThanThree = testimonials.length > 3;

  // Update scroll state and active index
  const updateScrollState = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const currentScroll = container.scrollLeft;

    // Check if we can scroll left (not at the beginning)
    setCanScrollLeft(currentScroll > 5);

    // Check if we can scroll right (not at the end)
    setCanScrollRight(currentScroll < maxScroll - 5);

    // Calculate active index
    const cardWidth = container.children[0]?.getBoundingClientRect().width || 0;
    const gap = 24;
    const newIndex = Math.round(currentScroll / (cardWidth + gap));
    setActiveIndex(Math.min(newIndex, testimonials.length - 1));
  }, [testimonials.length]);

  // Handle scroll to update active dot and button states
  useEffect(() => {
    if (!hasMoreThanThree) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check
    updateScrollState();

    // Add scroll listener
    container.addEventListener("scroll", updateScrollState, { passive: true });

    // Also check on resize
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", handleResize);
    };
  }, [hasMoreThanThree, updateScrollState]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasMoreThanThree) return;
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !hasMoreThanThree) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMoreThanThree) return;
    setStartX(
      e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0),
    );
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasMoreThanThree) return;
    const x =
      e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Arrow navigation
  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current || !hasMoreThanThree) return;
    const cardWidth =
      scrollContainerRef.current.children[0]?.getBoundingClientRect().width ||
      0;
    const gap = 24;
    const maxIndex = testimonials.length - 1;
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));

    scrollContainerRef.current.scrollTo({
      left: clampedIndex * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    scrollToIndex(activeIndex - 1);
  };

  const scrollNext = () => {
    scrollToIndex(activeIndex + 1);
  };

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => (
    <div
      key={index}
      className={`${hasMoreThanThree ? "flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start" : ""}`}
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col">
        {/* Quote Icon */}
        <div className="mb-4 flex-shrink-0">
          <Icon
            icon="ph:quotes"
            width={32}
            height={32}
            className="text-[#00c9ff] opacity-50"
          />
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-4 flex-shrink-0">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Icon
              key={i}
              icon="ph:star-fill"
              width={16}
              height={16}
              className="text-yellow-400"
            />
          ))}
        </div>

        {/* Quote - with overflow handling */}
        <div className="flex-grow mb-6 overflow-hidden">
          <p className="text-gray-700 leading-relaxed text-sm line-clamp-6">
            "{testimonial.quote}"
          </p>
        </div>

        {/* Author - always at bottom */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 flex-shrink-0 mt-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00c9ff] to-[#92fe9d] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {testimonial.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {testimonial.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Static grid for 3 or fewer testimonials
  if (!hasMoreThanThree) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) =>
          renderTestimonialCard(testimonial, index),
        )}
      </div>
    );
  }

  // Carousel for more than 3 testimonials
  return (
    <div className="relative">
      {/* Left Arrow - positioned outside the content area */}
      <button
        onClick={scrollPrev}
        className={`absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollLeft
            ? "opacity-100 hover:bg-gray-50 hover:shadow-xl cursor-pointer"
            : "opacity-30 cursor-not-allowed"
        }`}
        disabled={!canScrollLeft}
        aria-label="Previous testimonial"
      >
        <Icon
          icon="ph:caret-left"
          width={24}
          height={24}
          className="text-[#8e2de2]"
        />
      </button>

      {/* Right Arrow - positioned outside the content area */}
      <button
        onClick={scrollNext}
        className={`absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollRight
            ? "opacity-100 hover:bg-gray-50 hover:shadow-xl cursor-pointer"
            : "opacity-30 cursor-not-allowed"
        }`}
        disabled={!canScrollRight}
        aria-label="Next testimonial"
      >
        <Icon
          icon="ph:caret-right"
          width={24}
          height={24}
          className="text-[#8e2de2]"
        />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing pb-4"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {testimonials.map((testimonial, index) =>
          renderTestimonialCard(testimonial, index),
        )}
      </div>
    </div>
  );
}
