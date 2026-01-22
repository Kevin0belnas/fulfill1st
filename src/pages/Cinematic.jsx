import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cinematic = () => {
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});
  const videoRefs = useRef([]);

  // Compact theme palette
  const theme = {
    bg: {
      primary: 'bg-gradient-to-br from-emerald-25 via-green-50/50 to-emerald-50',
      card: 'bg-white/95 backdrop-blur-sm',
      dark: 'bg-gradient-to-r from-emerald-800 to-green-900'
    },
    text: {
      primary: 'text-emerald-900',
      secondary: 'text-emerald-800',
      muted: 'text-emerald-600/90',
      white: 'text-white'
    },
    border: {
      light: 'border-emerald-100/70',
      medium: 'border-emerald-200'
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
      fileName: 'tenLittle.mp4',
      category: 'Documentary',
      duration: '1:41',
      uploadDate: '2024',
    },
    {
      id: 2,
      title: 'Kakaki, The Medicine Woman',
      description: 'A haunting exploration of gender empowerment across native cultures.',
      author: 'Dickson Lane',
      fileName: 'KAKAKI2.mp4',
      category: 'Short Film',
      duration: '0:56',
      uploadDate: '2024',
    },
  ];

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlayVideo = (id) => {
    if (playingVideo === id) {
      videoRefs.current[id]?.pause();
      setPlayingVideo(null);
    } else {
      videoRefs.current[playingVideo]?.pause();
      videoRefs.current[id]?.play();
      setPlayingVideo(id);
    }
  };

  const handleSeek = (id, e) => {
    const video = videoRefs.current[id];
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
    setVideoProgress((p) => ({ ...p, [id]: percent * 100 }));
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className={`min-h-screen ${theme.bg.primary} pt-5 pb-8 relative`}>
      {/* Main Container */}
      <div className="max-w-screen mx-auto px-3 sm:px-4 lg:px-6">
        {/* Compact Hero Section */}
        <div className="mb-6">
          <div className="text-center mb-5">
            {/* Status Badge */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-800 text-xs font-medium mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              {videos.length} Videos
            </div>
            
            {/* Compact Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2">
              Cinematic Creations
            </h1>
            <p className="text-sm text-emerald-700/90 max-w-xl mx-auto">
              A curated collection of original cinematic works by Dickson Lane
            </p>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-5">
            {[
              { value: videos.length, label: 'Videos' },
              { value: new Set(videos.map(v => v.category)).size, label: 'Genres' },
              { value: videos.filter(v => v.uploadDate === '2024').length, label: 'Recent' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-2 bg-white/80 rounded-lg border border-emerald-100 shadow-sm">
                <div className="text-base font-bold text-emerald-700">{stat.value}</div>
                <div className="text-xs text-emerald-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <AnimatePresence>
            {videos.map((video, index) => {
              const isPlaying = playingVideo === video.id;
              const progress = videoProgress[video.id] || 0;
              const isHovered = hoveredVideo === video.id;

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                  onMouseEnter={() => setHoveredVideo(video.id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className={`relative ${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 overflow-hidden border ${theme.border.light} group-hover:border-emerald-300/50 h-full`}>
                    {/* Video Container */}
                    <div className="relative h-80 bg-black">
                      <video
                        ref={(el) => (videoRefs.current[video.id] = el)}
                        src={`/Videos/${video.fileName}`}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        onClick={() => handlePlayVideo(video.id)}
                        onTimeUpdate={() => {
                          const v = videoRefs.current[video.id];
                          if (v?.duration) {
                            setVideoProgress((p) => ({
                              ...p,
                              [video.id]: (v.currentTime / v.duration) * 100,
                            }));
                          }
                        }}
                      />

                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-900/30">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {/* Scrub Area */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-4 cursor-pointer"
                        onClick={(e) => handleSeek(video.id, e)}
                      />

                      {/* Play/Pause Overlay */}
                      {(!isPlaying || isHovered) && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button
                            onClick={() => handlePlayVideo(video.id)}
                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center hover:scale-105 transition-transform"
                          >
                            {isPlaying ? (
                              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 6h2v8H7zm4 0h2v8h-2z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 4l10 6-10 6V4z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Time Display */}
                      <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
                        {videoRefs.current[video.id]
                          ? formatTime(videoRefs.current[video.id].currentTime)
                          : '0:00'}{' '}
                        / {video.duration}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-medium rounded shadow-sm">
                          {video.category}
                        </span>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-emerald-900 mb-1 group-hover:text-emerald-700 transition-colors truncate">
                        {video.title}
                      </h3>
                      <p className="text-xs text-emerald-600 mb-2 line-clamp-2 h-8">
                        {video.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-emerald-700 mb-3">
                        <span>By {video.author}</span>
                        <span>{video.uploadDate}</span>
                      </div>

                      {/* Controls */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePlayVideo(video.id)}
                          className={`flex-1 py-2 text-xs ${theme.gradient.primary} text-white rounded-lg hover:shadow transition-all`}
                        >
                          {isPlaying ? 'Pause' : 'Play Video'}
                        </button>

                        <button
                          onClick={() => videoRefs.current[video.id]?.requestFullscreen()}
                          className="px-3 py-2 border border-emerald-300 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors text-xs"
                        >
                          ⛶
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Compact Info Section */}
        <div className={`${theme.bg.card} rounded-xl p-4 border border-emerald-100 ${theme.shadow.card} mb-4`}>
          <h3 className="text-sm font-semibold text-emerald-900 mb-2">About This Collection</h3>
          <p className="text-xs text-emerald-600 mb-3">
            A curated selection of cinematic works exploring themes of storytelling, culture, and creative expression.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <div className="text-sm font-bold text-emerald-700">{videos.length}</div>
              <div className="text-xs text-emerald-600">Total Videos</div>
            </div>
            <div className="text-center p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
              <div className="text-sm font-bold text-emerald-700">Documentary & Short Film</div>
              <div className="text-xs text-emerald-600">Genres</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-4 right-4 ${theme.gradient.primary} text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all z-40`}
          aria-label="Scroll to top"
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