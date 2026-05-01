import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cinematic = () => {
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const theme = {
    bg: {
      primary: 'bg-gradient-to-br from-emerald-25 via-green-50/50 to-emerald-50',
      card: 'bg-white/95 backdrop-blur-sm',
    },
    gradient: {
      primary: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500',
    },
    shadow: {
      card: 'shadow-lg shadow-emerald-100/40',
      hover: 'shadow-xl shadow-emerald-200/40'
    }
  };
  const videos = [
    {
      id: 1,
      title: 'The 10 Little Indians (of Successful Screenplays)',
      description: 'Lessons from the masters of moviemaking on writing successful screenplays.',
      author: 'Dickson Lane',
      fileId: '1BntrK-t-50exWHZuk72VkuE-ijBVtc0M', // Replace with your first video's ID
      category: 'Documentary',
      duration: '1:41',
      uploadDate: '2025',
    },
    {
      id: 2,
      title: 'Kakaki, The Medicine Woman',
      description: 'A haunting exploration of gender empowerment across native cultures.',
      author: 'Dickson Lane',
      fileId: '1DGcCWyvtUqBDBeic_Kweabe7E3cU-TnW', // Your Kakaki file ID
      category: 'Short Film',
      duration: '0:56',
      uploadDate: '2025',
    },
    {
      id: 3,
      title: 'Wisdom',
      description: 'A Celebration of the Intelligence and Beauty of Cats',
      author: 'K.J. Voegeli',
      fileId: '1OwJPCg1oi45q_-N6dhUAfywMiWKduHf8', // Your Kakaki file ID
      category: 'Short Film',
      duration: '7:36',
      uploadDate: '2026',
    },
    {
      id: 4,
      title: 'Heart of Always',
      description: 'The Heart of Always, the second book of The Heart Trilogy, the balance of power between good and evil teeters on the edge.',
      author: 'David Michael Ruiz',
      fileId: '1jVxLE1UdlMWv2uiFiVXyd7Hda0S07UZQ', // Your Kakaki file ID
      category: 'Short Film',
      duration: '1:00',
      uploadDate: '2025',
    },
    {
      id: 5,
      title: 'Heart of Jerim',
      description: 'In the Third Kingdom, young Jerim lives a carefree life, more interested in explosions and mischief than in his familys prestigious legacy as master weapon makers. Orphaned at a young age, he knows l',
      author: 'David Michael Ruiz',
      fileId: '1X5vzIhEfapGtRW-5_Jk2mCdF0AXSicnP', // Your Kakaki file ID
      category: 'Short Film',
      duration: '1:00',
      uploadDate: '2025',
    },
    {
      id: 6,
      title: 'Heart of Tesfa',
      description: 'In a world forged by ancient powers, where good and evil clash in both the hearts of men and mythical creatures, the war for the soul of creation intensifies.',
      author: 'David Michael Ruiz',
      fileId: '1qFfSIKvgH29fQ4FP7vNBT0anTcLePgKv', // Your Kakaki file ID
      category: 'Short Film',
      duration: '1:00',
      uploadDate: '2025',
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${theme.bg.primary} pt-5 pb-8 relative`}>
      <div className="max-w-screen mx-auto px-3 sm:px-4 lg:px-6">
        {/* Hero Section */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2">
            Cinematic Creations
          </h1>
          <p className="text-sm text-emerald-700/90 max-w-xl mx-auto">
            A curated collection of original cinematic works by Dickson Lane
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <AnimatePresence>
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                <div className={`relative ${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 overflow-hidden border border-emerald-100 h-full`}>
                  {/* Video Container with Iframe */}
                  <div className="relative h-80 bg-black">
                    <iframe
                      src={`https://drive.google.com/file/d/${video.fileId}/preview`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen"
                      title={video.title}
                      frameBorder="0"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-medium rounded shadow-sm">
                        {video.category}
                      </span>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-emerald-900 mb-1 truncate">
                      {video.title}
                    </h3>
                    <p className="text-xs text-emerald-600 mb-2 line-clamp-2">
                      {video.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-emerald-700">
                      <span>By {video.author}</span>
                      <span>{video.uploadDate}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-4 right-4 ${theme.gradient.primary} text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all z-40`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Cinematic;