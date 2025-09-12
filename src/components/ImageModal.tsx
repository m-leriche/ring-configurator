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
  // State to control whether rings are in separated or final stacked position
  const [isStacked, setIsStacked] = React.useState(false);
  // State to control the giggling cowboy easter egg
  const [showCowboy, setShowCowboy] = React.useState(false);

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

      // Reset to separated state when modal opens
      setIsStacked(false);
      setShowCowboy(false);

      // After 500ms, animate to final stacked position
      const stackTimer = setTimeout(() => {
        setIsStacked(true);
      }, 500);

      // After stacking animation completes + 5 seconds, show cowboy
      // (500ms delay + 2000ms animation + 5000ms wait = 7500ms total)
      const cowboyTimer = setTimeout(() => {
        setShowCowboy(true);
      }, 3000);

      return () => {
        clearTimeout(stackTimer);
        clearTimeout(cowboyTimer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
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
          className="fixed inset-0 z-50 p-2.5"
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
            className="relative bg-white shadow-2xl overflow-hidden z-10 flex w-full h-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
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
              {/* Stacked Images Container */}
              <div className="flex-1 flex items-center justify-center relative">
                <div
                  className="relative flex items-center justify-center"
                  style={{ width: '600px', height: '600px' }}
                >
                  {items.map((item, index) => {
                    const offset = calculateRingOffset(index);

                    return (
                      <motion.div
                        key={index}
                        className="absolute flex items-center justify-center"
                        style={{
                          zIndex: items.length - index, // First item (top carousel) = highest z-index (on top)
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: `${offset * 1.5}px`,
                        }}
                        initial={
                          // Set initial separated positions
                          index === 0
                            ? { y: -400 } // Top ring starts above
                            : index === items.length - 1
                              ? { y: 400 } // Bottom ring starts below
                              : { y: 0 } // Middle ring starts in position
                        }
                        animate={{
                          y: isStacked
                            ? 0
                            : index === 0
                              ? -400 // Top ring stays above until stacked
                              : index === items.length - 1
                                ? 400 // Bottom ring stays below until stacked
                                : 0, // Middle ring always in position
                        }}
                        transition={{
                          duration: 2.0,
                          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic bezier for smoother motion
                          type: 'tween', // Use tween instead of spring for smoother motion
                        }}
                      >
                        <AutoCroppedImage
                          src={item.image}
                          alt={item.title}
                          onMeasurementComplete={(thickness) =>
                            handleMeasurementComplete(index, thickness)
                          }
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Ring Details */}
            <div className="w-64 bg-gray-50 flex flex-col">
              <div className="p-4">
                <h3 className="text-xs font-normal uppercase leading-tight text-gray-900">
                  Configuration Details
                </h3>
              </div>

              <div className="flex-1 p-4 space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-2 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-normal uppercase leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[8px] font-normal font-mono text-gray-400 mt-1">
                          {item.variantLabel}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 font-mono">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Giggling Cowboy Easter Egg - in sidebar above total */}
              <AnimatePresence>
                {showCowboy && (
                  <motion.div
                    className="p-2 flex justify-center"
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <iframe
                      src="https://tenor.com/embed/27108097"
                      frameBorder="0"
                      allowTransparency={true}
                      className="w-full rounded-lg shadow-lg"
                      style={{ aspectRatio: '1.55', height: 'auto' }}
                    ></iframe>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Total in sidebar */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-[8px] font-normal font-mono text-gray-400 mb-1">
                    Total Price
                  </p>
                  <p className="text-sm font-bold text-gray-600 font-mono">
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
