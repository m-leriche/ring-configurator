import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'motion/react';
import DraggableCarousel from './components/DraggableCarousel';
import Carousel from './components/Carousel';
import ImageModal from './components/ImageModal';
import type { CarouselItem } from './types/carousel';
import { ringItems } from './data/ringData';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CarouselItem[]>([]);
  // Track slides by carousel ID instead of array index
  const [currentSlides, setCurrentSlides] = useState<Record<string, number>>({
    'carousel-0': 0,
    'carousel-1': 0,
    'carousel-2': 0,
  });
  const [carouselOrder, setCarouselOrder] = useState([
    'carousel-0',
    'carousel-1',
    'carousel-2',
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const slidesToShow = 3;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate the center item index for a given carousel
  const getCenterIndex = (slideIndex: number) => {
    const centerOffset = Math.floor(slidesToShow / 2);
    const centerIndex = (slideIndex + centerOffset) % ringItems.length;

    return centerIndex;
  };

  const handleOpenCenterModal = () => {
    const centerItems: CarouselItem[] = [];

    // Get center item from each carousel in the current order
    carouselOrder.forEach((carouselId) => {
      const slideIndex = currentSlides[carouselId];
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

  const handleSlideChange = (carouselId: string, slideIndex: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [carouselId]: slideIndex,
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCarouselOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-4xl font-normal uppercase mb-2 drop-shadow-sm">
          Ring Combinator
        </h1>
        <p className="text-sm text-gray-500 font-mono">
          Drag the handles on the left to reorder carousels
        </p>
      </div>

      <main className="w-full max-w-7xl flex flex-col justify-center items-center overflow-y-visible space-y-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={carouselOrder}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {carouselOrder.map((carouselId, orderIndex) => {
                return (
                  <motion.div
                    key={carouselId}
                    className="w-full"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DraggableCarousel
                      id={carouselId}
                      items={ringItems}
                      slidesToShow={slidesToShow}
                      onSlideChange={(index) =>
                        handleSlideChange(carouselId, index)
                      }
                      isDragging={activeId === carouselId}
                      order={orderIndex + 1}
                      currentSlide={currentSlides[carouselId]}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="w-full opacity-80">
                <Carousel
                  items={ringItems}
                  slidesToShow={slidesToShow}
                  autoplay={false}
                  dots={false}
                  arrows={true}
                  onSlideChange={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

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
