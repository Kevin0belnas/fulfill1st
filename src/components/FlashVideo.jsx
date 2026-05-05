import { useState, useRef, useEffect } from 'react';

const FlashVideo = ({ onComplete, fileId }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const iframeRef = useRef(null);

  // Default file ID - replace with your flash.mp4 Google Drive file ID
  const defaultFileId = "13wYAZe0Yr_m7m89CyiZmPBKm2tJY-95v";
  const videoFileId = fileId || defaultFileId;
  const videoUrl = `https://drive.google.com/file/d/${videoFileId}/preview`;

  // Set initial position (center of screen)
  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const containerWidth = 800;
    const containerHeight = 560;
    
    setPosition({
      x: (windowWidth / 2) - (containerWidth / 2),
      y: (windowHeight / 2) - (containerHeight / 2)
    });
  }, []);

  // Handle messages from iframe (for play/pause detection)
  useEffect(() => {
    const handleMessage = (event) => {
      // Check if message is from our iframe
      if (event.source === iframeRef.current?.contentWindow) {
        if (event.data === 'play') {
          setIsPlaying(true);
        } else if (event.data === 'pause') {
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
    if (isFullscreen) return;
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

  const handleVideoEnd = () => {
    // Google Drive iframe doesn't easily expose ended event
    // You might need to estimate based on duration or use a timer
    setTimeout(() => {
      if (!isFullscreen) {
        setIsVisible(false);
        if (onComplete) onComplete();
      }
    }, 1000); // Adjust based on your video length
  };

  const handleSkip = () => {
    if (!isFullscreen) {
      setIsVisible(false);
      if (onComplete) onComplete();
    }
  };

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
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-sm uppercase tracking-wider">Understanding</span>
              </div>
              <button 
                onClick={handleSkip}
                className="text-white/80 hover:text-white transition-colors pointer-events-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Video Container with Google Drive Embed */}
        <div className="relative bg-black" style={{ height: '560px' }}>
          <iframe
            ref={iframeRef}
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            title="Flash Video"
            frameBorder="0"
            onLoad={() => {
              // Optional: Send message to iframe to autoplay
              console.log("Video iframe loaded");
            }}
          />
          
          {/* Custom Controls Overlay (optional - Google Drive has its own controls) */}
          <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center gap-4">
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
      </div>
    </div>
  );
};

export default FlashVideo;