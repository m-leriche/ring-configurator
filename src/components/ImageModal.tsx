import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { CarouselItem } from '../types/carousel';
import AutoCroppedImage from './AutoCroppedImage';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CarouselItem[];
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, items }) => {
  // State to track ring thickness measurements for stacking
  const [ringThicknesses, setRingThicknesses] = React.useState<number[]>([]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Handle ring thickness measurement completion
  const handleMeasurementComplete = (index: number, thickness: number) => {
    setRingThicknesses((prev) => {
      const newThicknesses = [...prev];
      newThicknesses[index] = thickness;
      return newThicknesses;
    });
  };

  // Calculate cumulative offset for each ring (reverse order for proper stacking)
  const calculateRingOffset = (index: number) => {
    let offset = 0;
    // Start from the end and work backwards to reverse the visual order
    for (let i = items.length - 1; i > index; i--) {
      if (ringThicknesses[i]) {
        offset += ringThicknesses[i];
      }
    }
    return offset;
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!items || items.length === 0) return null;
  const testItem = items.slice(0, 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Black Overlay */}
          <div
            className="absolute inset-0 bg-black cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white shadow-2xl overflow-hidden z-10 flex"
            style={{ width: '1200px', height: '700px' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              aria-label="Close modal"
            >
              <span className="text-gray-600 text-lg font-semibold">×</span>
            </button>

            {/* Left Side - Stacked Images */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Your Ring Stack
                </h2>
              </div>

              {/* Stacked Images Container */}
              <div className="flex-1 flex items-center justify-center">
                <div
                  className="relative flex items-center justify-center"
                  style={{ width: '600px', height: '600px' }}
                >
                  {items.map((item, index) => {
                    const offset = calculateRingOffset(index);

                    return (
                      <div
                        key={index}
                        className="absolute flex items-center justify-center"
                        style={{
                          zIndex: items.length - index, // First item (top carousel) = highest z-index (on top)
                          top: 0,
                          bottom: `${offset * 1.5}px`, // Stack using actual ring thickness offsets
                          left: 0,
                          right: 0,
                        }}
                      >
                        <AutoCroppedImage
                          src={item.image}
                          alt={item.title}
                          onMeasurementComplete={(thickness) =>
                            handleMeasurementComplete(index, thickness)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Ring Details */}
            <div className="w-80 bg-gray-50 flex flex-col">
              <div className="p-6 ">
                <h3 className="text-lg font-semibold text-gray-900">
                  Configuration Details
                </h3>
              </div>

              <div className="flex-1 p-6 space-y-4">
                {items.map((item, index) => (
                  <div key={index} className=" pb-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.variantLabel}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total in sidebar */}
              <div className="p-6 border-t border-gray-200 bg-gray-100">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Price</p>
                  <p className="text-xl font-bold text-blue-600">
                    CA$
                    {items
                      .reduce((total, item) => {
                        const price = parseInt(
                          item.price.replace('CA$', '').replace(',', '')
                        );
                        return total + price;
                      }, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;
