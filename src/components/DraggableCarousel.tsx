import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import Carousel from './Carousel';
import type { CarouselItem } from '../types/carousel';

interface DraggableCarouselProps {
  id: string;
  items: CarouselItem[];
  slidesToShow: number;
  onSlideChange: (index: number) => void;
  isDragging?: boolean;
  order?: number;
  currentSlide?: number;
}

const DraggableCarousel: React.FC<DraggableCarouselProps> = ({
  id,
  items,
  slidesToShow,
  onSlideChange,
  isDragging = false,
  order,
  currentSlide = 0,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full ${
        isSortableDragging ? 'z-50' : 'z-0'
      } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1/2 transform -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform duration-200"
        style={{ left: '-40px' }}
        title="Drag to reorder carousels"
      >
        <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center">
          <div className="flex flex-col space-y-0.5">
            <div className="w-3 h-0.5 bg-white rounded"></div>
            <div className="w-3 h-0.5 bg-white rounded"></div>
            <div className="w-3 h-0.5 bg-white rounded"></div>
          </div>
        </div>
      </div>

      {/* Order Indicator */}
      {order && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 z-10"
          style={{ right: '-40px' }}
        >
          <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {order}
          </div>
        </div>
      )}

      {/* Carousel Content */}
      <motion.div
        className={`transition-all duration-300 ${
          isSortableDragging
            ? 'shadow-2xl scale-105 bg-white rounded-lg'
            : 'shadow-none scale-100'
        }`}
        animate={{
          scale: isSortableDragging ? 1.02 : 1,
          boxShadow: isSortableDragging
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            : '0 0 0 0 rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.2 }}
      >
        <Carousel
          items={items}
          slidesToShow={slidesToShow}
          autoplay={false}
          dots={false}
          arrows={true}
          onSlideChange={onSlideChange}
          initialSlide={currentSlide}
        />
      </motion.div>

      {/* Drop Zone Indicator */}
      {isSortableDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-30 rounded-lg pointer-events-none"
        />
      )}
    </div>
  );
};

export default DraggableCarousel;
