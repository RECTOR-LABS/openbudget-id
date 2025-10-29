'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoScene {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail?: string;
}

const videos: VideoScene[] = [
  {
    id: 'scene-1',
    title: '1. Overview Public Page',
    description: 'Tampilan halaman publik untuk melihat semua proyek transparansi',
    youtubeId: 'fB835sm7NAk',
  },
  {
    id: 'scene-2',
    title: '2. Dashboard Login & Settings',
    description: 'Login admin kementerian dengan Google OAuth dan wallet integration',
    youtubeId: 'WUuW740cQ_I',
  },
  {
    id: 'scene-3',
    title: '3. Create New Project',
    description: 'Membuat proyek baru dan publish ke Solana blockchain',
    youtubeId: 'KC3MWa3K0sI',
  },
  {
    id: 'scene-4',
    title: '4. Add New Milestone',
    description: 'Menambahkan milestone realisasi anggaran dengan validasi budget',
    youtubeId: '7l3dtfDllJM',
  },
  {
    id: 'scene-5',
    title: '5. Release Milestone',
    description: 'Mencairkan dana milestone dengan bukti dokumen on-chain',
    youtubeId: 'Ij8nXG2tmVA',
  },
  {
    id: 'scene-6',
    title: '6. Verify Project Progress',
    description: 'Verifikasi progress proyek di halaman publik dengan Solana Explorer',
    youtubeId: 'm6QlDjSc_a4',
  },
];

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentVideo = videos[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < videos.length) {
      setDirection(newDirection);
      setCurrentIndex(newIndex);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className="w-full">
      {/* Main Video Display */}
      <div className="relative">
        {/* Decorative frame */}
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-3xl opacity-50 blur-xl" />
        <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
          <div
            className="absolute inset-0 opacity-20 rounded-2xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='7.5' cy='7.5' r='3' fill='%23F59E0B'/%3E%3Ccircle cx='22.5' cy='7.5' r='3' fill='%23F59E0B'/%3E%3Ccircle cx='7.5' cy='22.5' r='3' fill='%23F59E0B'/%3E%3Ccircle cx='22.5' cy='22.5' r='3' fill='%23F59E0B'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        {/* Video Container */}
        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
          <div className="aspect-video relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?rel=0&modestbranding=1`}
                  title={currentVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => paginate(1)}
            disabled={currentIndex === videos.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all ${
              currentIndex === videos.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:scale-110'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scene Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-white text-2xl font-bold mb-2">{currentVideo.title}</h3>
              <p className="text-gray-300 text-sm">{currentVideo.description}</p>
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white font-bold text-sm">
              {currentIndex + 1} / {videos.length}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {videos.map((video, index) => (
            <motion.button
              key={video.id}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-4 ring-yellow-400 shadow-xl'
                  : 'ring-2 ring-gray-700 hover:ring-blue-500'
              }`}
            >
              <div className="aspect-video relative bg-gradient-to-br from-gray-800 to-gray-900">
                {/* YouTube thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className={`w-full h-full object-cover transition-opacity ${
                    index === currentIndex ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                />

                {/* Play icon overlay for non-active thumbnails */}
                {index !== currentIndex && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors">
                    <svg
                      className="w-8 h-8 text-white opacity-80"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}

                {/* Scene number badge */}
                <div
                  className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === currentIndex
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-black/60 text-white'
                  }`}
                >
                  {index + 1}
                </div>
              </div>

              {/* Thumbnail title */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-2 text-xs font-semibold text-center ${
                  index === currentIndex
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-black/80 text-white'
                }`}
              >
                {video.title.split('.')[1]?.trim() || video.title}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center text-gray-400 text-sm"
      >
        <p>
          💡 <strong>Tip:</strong> Gunakan tombol ← → untuk navigasi, atau swipe pada mobile
        </p>
      </motion.div>
    </div>
  );
}
