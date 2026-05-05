import { useState, useRef, useEffect } from 'react';

const FlashVideo = ({ onComplete, fileId, nextDelay = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showShootingStars, setShowShootingStars] = useState(true);
  const [isEntering, setIsEntering] = useState(true);
  const [volume, setVolume] = useState(1);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  const videoUrl = "https://res.cloudinary.com/dlnjwoids/video/upload/flash_dx1tnt.mp4";

  // Calculate responsive dimensions
  const getResponsiveDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // For mobile devices
    if (width < 640) {
      return { width: width - 20, height: (width - 20) * 0.7 }; // 16:9 aspect ratio
    }
    // For tablets
    if (width < 1024) {
      return { width: Math.min(600, width - 40), height: Math.min(420, height - 80) };
    }
    // For desktop
    return { width: 800, height: 560 };
  };

  const [videoDimensions, setVideoDimensions] = useState(getResponsiveDimensions());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = getResponsiveDimensions();
      setVideoDimensions(newDimensions);
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      // Reposition video to center on resize
      if (!isFullscreen) {
        setPosition({
          x: (window.innerWidth / 2) - (newDimensions.width / 2),
          y: (window.innerHeight / 2) - (newDimensions.height / 2)
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Center position
  useEffect(() => {
    const dimensions = getResponsiveDimensions();
    setPosition({
      x: (windowSize.width / 2) - (dimensions.width / 2),
      y: (windowSize.height / 2) - (dimensions.height / 2)
    });
    setVideoDimensions(dimensions);
  }, [windowSize]);

  // Shooting stars
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShootingStars(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Entry animation (default 3s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        // Re-center when exiting fullscreen
        const dimensions = getResponsiveDimensions();
        setPosition({
          x: (window.innerWidth / 2) - (dimensions.width / 2),
          y: (window.innerHeight / 2) - (dimensions.height / 2)
        });
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Video end with adjustable delay before closing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (!isFullscreen) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onComplete && onComplete();
        }, nextDelay);
        
        return () => clearTimeout(timer);
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [isFullscreen, onComplete, nextDelay]);

  // Drag with responsive boundaries
  const handleMouseDown = (e) => {
    if (isFullscreen) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e) => {
    if (isFullscreen) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isFullscreen) {
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;
      
      // Keep within bounds
      newX = Math.min(Math.max(0, newX), window.innerWidth - videoDimensions.width);
      newY = Math.min(Math.max(0, newY), window.innerHeight - videoDimensions.height);
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && !isFullscreen) {
      const touch = e.touches[0];
      let newX = touch.clientX - dragStart.x;
      let newY = touch.clientY - dragStart.y;
      
      newX = Math.min(Math.max(0, newX), window.innerWidth - videoDimensions.width);
      newY = Math.min(Math.max(0, newY), window.innerHeight - videoDimensions.height);
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, videoDimensions]);

  // Play / Close
  const handleXClick = () => {
    if (!hasStarted) {
      videoRef.current?.play();
      setHasStarted(true);
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsVisible(false);
      onComplete && onComplete();
    }
  };

  const handleScreenClick = () => {
    if (!hasStarted) {
      videoRef.current?.play();
      setHasStarted(true);
      setIsPlaying(true);
    }
  };

  // Fullscreen toggle
  const handleFullscreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Play/Pause
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Seek
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Format time
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Shooting Stars - Responsive */}
      {showShootingStars && (
        <div className="fixed inset-0 pointer-events-none z-[9998] animate-light-flash"></div>
      )}

      {/* MAIN CONTAINER - Responsive */}
      <div
        ref={containerRef}
        className={`fixed z-[9999] select-none ${
          isFullscreen ? 'inset-0 w-full h-full' : ''
        } ${isEntering ? 'animate-entry' : ''}`}
        style={!isFullscreen ? { 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          width: `${videoDimensions.width}px`,
          height: `${videoDimensions.height + (windowSize.width < 640 ? 0 : 48)}px` // Adjust for header height on mobile
        } : {}}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className={`relative bg-black shadow-2xl border border-gray-700 overflow-hidden ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full rounded-lg'
        }`}
        style={{ height: '100%' }}>
          
          {/* HEADER - Hidden in fullscreen mode, responsive for mobile */}
          {!isFullscreen && (
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className={`bg-gradient-to-r from-green-600 to-green-300 px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center cursor-grab ${
                windowSize.width < 640 ? 'active:cursor-grabbing' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider">Understanding</span>
              </div>
              <button 
                onClick={handleXClick} 
                className="text-white hover:text-gray-200 transition-colors p-1"
                aria-label={!hasStarted ? "Play" : "Close"}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Fullscreen Header */}
          {isFullscreen && showControls && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 sm:p-4 z-10 transition-opacity duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider">Understanding</span>
                </div>
                <button onClick={handleXClick} className="text-white hover:text-gray-200 transition-colors p-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* VIDEO */}
          <div
            className="relative bg-black"
            style={{ 
              height: isFullscreen ? '100%' : `calc(100% - ${windowSize.width < 640 ? 40 : 48}px)`,
              cursor: 'pointer'
            }}
            onClick={handleScreenClick}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
              onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
              playsInline
            />

            {/* Custom Controls Overlay - Responsive */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${
              showControls && hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <div className="p-2 sm:p-4">
                {/* Progress Bar */}
                <div className="mb-2 sm:mb-4">
                  <input
                    type="range"
                    min="0"
                    max={videoDuration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 ${(currentTime / videoDuration) * 100}%, #4b5563 ${(currentTime / videoDuration) * 100}%)`
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Play/Pause - Responsive size */}
                    <button
                      onClick={handlePlayPause}
                      className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 sm:p-2 backdrop-blur-sm transition-all"
                    >
                      {isPlaying ? (
                        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Time - Smaller text on mobile */}
                    <div className="text-white text-xs sm:text-sm">
                      {formatTime(currentTime)} / {formatTime(videoDuration)}
                    </div>
                    
                    {/* Volume Control - Hide on very small screens */}
                    {windowSize.width >= 480 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-12 sm:w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Fullscreen Button */}
                  <button
                    onClick={handleFullscreenToggle}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 sm:p-2 backdrop-blur-sm transition-all"
                  >
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Play Overlay - Responsive */}
            {!hasStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 pointer-events-none">
                <div className="text-center animate-bounce px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-green-500/20 border-4 border-green-500 mb-3 sm:mb-4">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-white font-bold text-base sm:text-lg">Click anywhere to play</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes entryAnimation {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(80px);
            filter: blur(10px);
          }
          30% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
            filter: blur(0);
          }
          60% {
            transform: scale(0.98) translateY(5px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }

        @keyframes lightFlash {
          0% { background: transparent; }
          20% { background: rgba(255,255,255,0.3); }
          100% { background: transparent; }
        }

        .animate-entry {
          animation: entryAnimation 3s ease-out forwards;
        }

        .animate-light-flash {
          animation: lightFlash 1s ease-out;
        }

        /* Responsive adjustments for very small screens */
        @media (max-width: 640px) {
          .animate-entry {
            animation: entryAnimation 2s ease-out forwards;
          }
        }
      `}</style>
    </>
  );
};

export default FlashVideo;