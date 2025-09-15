import { useState } from 'react';
import Carousel from './components/Carousel';
import ImageModal from './components/ImageModal';
import type { CarouselItem } from './types/carousel';
import { ringItems } from './data/ringData';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CarouselItem[]>([]);
  const [currentSlides, setCurrentSlides] = useState([0, 0, 0]); // Track slides for 3 carousels

  const slidesToShow = 3;

  // Calculate the center item index for a given carousel
  const getCenterIndex = (slideIndex: number) => {
    const centerOffset = Math.floor(slidesToShow / 2);
    const centerIndex = (slideIndex + centerOffset) % ringItems.length;

    return centerIndex;
  };

  const handleOpenCenterModal = () => {
    const centerItems: CarouselItem[] = [];

    // Get center item from each carousel
    currentSlides.forEach((slideIndex) => {
      const centerIndex = getCenterIndex(slideIndex);
      const centerItem = ringItems[centerIndex];

      if (centerItem) {
        centerItems.push(centerItem);
      }
    });

    if (centerItems.length > 0) {
      setSelectedItems(centerItems);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItems([]);
  };

  const handleSlideChange = (carouselIndex: number, slideIndex: number) => {
    setCurrentSlides((prev) => {
      const newSlides = [...prev];
      newSlides[carouselIndex] = slideIndex;
      return newSlides;
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-normal uppercase mb-2 drop-shadow-sm">
          Ring Combinator
        </h1>
      </div>

      <main className="w-full max-w-7xl flex flex-col justify-center items-center overflow-y-visible space-y-8">
        {/* First Carousel */}
        <div className="w-full">
          <Carousel
            items={ringItems}
            slidesToShow={slidesToShow}
            autoplay={false}
            dots={false}
            arrows={true}
            onSlideChange={(index) => handleSlideChange(0, index)}
          />
        </div>

        {/* Second Carousel */}
        <div className="w-full">
          <Carousel
            items={ringItems}
            slidesToShow={slidesToShow}
            autoplay={false}
            dots={false}
            arrows={true}
            onSlideChange={(index) => handleSlideChange(1, index)}
          />
        </div>

        {/* Third Carousel */}
        <div className="w-full">
          <Carousel
            items={ringItems}
            slidesToShow={slidesToShow}
            autoplay={false}
            dots={false}
            arrows={true}
            onSlideChange={(index) => handleSlideChange(2, index)}
          />
        </div>

        {/* Center Items Button */}
        <div className="my-8 text-center">
          <button
            onClick={handleOpenCenterModal}
            className="bg-black hover:bg-white text-white hover:text-black border border-black hover:border-content-white py-4 px-20 transition-all duration-200 transform hover:scale-105 uppercase font-normal"
          >
            Show Stack
          </button>
        </div>
      </main>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        items={selectedItems}
      />
    </div>
  );
}

export default App;
