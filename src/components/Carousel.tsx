import React from 'react';
import Slider from 'react-slick';
import { motion, AnimatePresence } from 'motion/react';
import type { CarouselItem } from '../types/carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const CustomPrevArrow: React.FC<ArrowProps> = ({
  className,
  style,
  onClick,
}) => (
  <div
    className={`${className} custom-arrow custom-prev-arrow`}
    style={{
      ...style,
      display: 'block',
      left: '-100px',
      zIndex: 2,
      width: '44px',
      height: '44px',
      background: 'white',
      borderRadius: '50%',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
    }}
    onClick={onClick}
  >
    <span
      style={{
        fontSize: '20px',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ‹
    </span>
  </div>
);

const CustomNextArrow: React.FC<ArrowProps> = ({
  className,
  style,
  onClick,
}) => (
  <div
    className={`${className} custom-arrow custom-next-arrow`}
    style={{
      ...style,
      display: 'block',
      right: '-100px',
      zIndex: 2,
      width: '44px',
      height: '44px',
      background: 'white',
      borderRadius: '50%',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
    }}
    onClick={onClick}
  >
    <span
      style={{
        fontSize: '20px',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ›
    </span>
  </div>
);

interface CarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  infinite?: boolean;
  dots?: boolean;
  arrows?: boolean;
  className?: string;
  onSlideChange?: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoplay = true,
  autoplaySpeed = 3000,
  slidesToShow = 3,
  slidesToScroll = 1,
  infinite = true,
  dots = true,
  arrows = true,
  className = '',
  onSlideChange,
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Ensure initial state is synced
  React.useEffect(() => {
    onSlideChange?.(0);
  }, []);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    onSlideChange?.(index);
  };

  // Also handle before change for more responsive updates
  const handleBeforeChange = (current: number, next: number) => {
    setCurrentSlide(next);
    onSlideChange?.(next);
  };

  const settings = {
    dots,
    infinite,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    autoplay,
    autoplaySpeed,
    arrows,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: (current: number, next: number) =>
      handleBeforeChange(current, next),
    afterChange: (index: number) => handleSlideChange(index),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const testItem = items.slice(0, 1);
  return (
    <div className={`w-full max-w-6xl mx-auto px-16 relative ${className}`}>
      <Slider {...settings}>
        {items.map((item, index) => {
          // Calculate if this item is in the center with bounds checking
          const centerOffset = Math.floor(slidesToShow / 2);
          const centerIndex = (currentSlide + centerOffset) % items.length;
          const isCenter = index === centerIndex;

          return (
            <div key={index} className="px-4 outline-none">
              <motion.div
                className="bg-white flex flex-col transition-all duration-300 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative w-full flex items-center justify-center bg-transparent overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="transition-transform duration-300 hover:scale-110"
                    style={{
                      filter: 'drop-shadow(0 0 0 transparent)',
                      imageRendering: 'crisp-edges',
                      width: '300px',
                      height: '180px',
                      objectFit: 'cover',
                      objectPosition: 'center center',
                      transform: `${isCenter ? 'scale(2)' : 'scale(1)'}`,
                      opacity: isCenter ? 1 : 0.3,
                      transition:
                        'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                    }}
                  />
                </div>

                {/* Absolutely positioned text overlay */}
                <AnimatePresence mode="wait">
                  {isCenter && (
                    <motion.div
                      key={`text-${index}`}
                      className="absolute bottom-[-8px] left-0 right-0"
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{
                        duration: 0.3,
                        ease: 'easeOut',
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-normal uppercase leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 font-mono">
                          {item.price}
                        </p>
                      </div>
                      <div className="flex justify-start">
                        <p className="text-[8px] font-normal font-mono text-gray-400">
                          {item.variantLabel}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;
