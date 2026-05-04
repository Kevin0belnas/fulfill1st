import { useState, useRef, useEffect } from 'react';

const FlashVideo = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const videoContainerRef = useRef(null);

  // Set initial position (center of screen)
  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const containerWidth = 800; // Increased from 500px to 800px
    const containerHeight = 560; // Increased from 350px to 560px
    
    setPosition({
      x: (windowWidth / 2) - (containerWidth / 2),
      y: (windowHeight / 2) - (containerHeight / 2)
    });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented:", error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
      }
    }
  }, []);

  // Update progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMouseDown = (e) => {
    if (isFullscreen) return; // Disable dragging in fullscreen
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isFullscreen) {
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;
      
      const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 800);
      const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 560);
      
      newX = Math.min(Math.max(0, newX), maxX);
      newY = Math.min(Math.max(0, newY), maxY);
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = progressBarRef.current;
    if (progressBar && videoRef.current) {
      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const clickPercent = (x / width) * 100;
      const seekTime = (clickPercent / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(clickPercent);
    }
  };

  const handleVideoEnd = () => {
    if (!isFullscreen) {
      setIsVisible(false);
      if (onComplete) onComplete();
    }
  };

  const handleSkip = () => {
    if (!isFullscreen) {
      setIsVisible(false);
      if (onComplete) onComplete();
    }
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed z-[9999] select-none ${isFullscreen ? 'inset-0 w-full h-full' : ''}`}
      style={!isFullscreen ? { 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      } : {}}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div 
        ref={videoContainerRef}
        className={`relative bg-black rounded-lg shadow-2xl border border-gray-700 overflow-hidden ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-[800px]'
        }`}
      >
        {/* Draggable Header - Hidden in fullscreen */}
        {!isFullscreen && (
          <div 
            onMouseDown={handleMouseDown}
            className="bg-gradient-to-r from-green-600 to-green-300 px-4 py-3 flex justify-between items-center cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-bold text-sm uppercase tracking-wider">Understanding</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSkip}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Fullscreen Header */}
        {isFullscreen && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-sm uppercase tracking-wider">Understanding</span>
              </div>
              <button 
                onClick={handleSkip}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Video Container */}
        <div className="relative bg-black">
          <video 
            ref={videoRef}
            autoPlay 
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full aspect-video object-contain"
            onClick={handleTogglePlay}
          >
            <source src="/images/flash.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Controls Overlay */}
          <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center gap-4">
              <button
                onClick={handleTogglePlay}
                className="bg-white/20 hover:bg-white/30 rounded-full p-4 backdrop-blur-sm transition-all transform hover:scale-110"
              >
                {isPlaying ? (
                  <svg className="w-10 h-10 text-white" fill="white" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={handleFullscreen}
                className="bg-white/20 hover:bg-white/30 rounded-full p-4 backdrop-blur-sm transition-all transform hover:scale-110"
              >
                {isFullscreen ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress Bar - Hidden in fullscreen */}
        {!isFullscreen && (
          <div 
            ref={progressBarRef}
            className="h-1.5 bg-gray-700 cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-green-500 relative transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-green-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
            </div>
          </div>
        )}

        {/* Fullscreen Progress Bar */}
        {isFullscreen && (
          <div 
            ref={progressBarRef}
            className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700/50 cursor-pointer hover:h-3 transition-all duration-200"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-green-500 relative transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashVideo;