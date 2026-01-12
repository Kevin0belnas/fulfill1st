import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
 
const servicesData = [

  { id: 1, title: "Industrial & Product Design", category: "Graphics & Design", description: "Professional design services for physical products", path: "/services/graphics/industrial-&-product-design"},
  { id: 2, title: "Graphics for Streamers", category: "Graphics & Design", description: "Custom overlays for streaming channels", path: "/services/graphics/graphics-for-streamers"},
  { id: 3, title: "Trade Booth Design", category: "Graphics & Design", description: "Eye-catching booth designs for trade shows", path: "/services/graphics/trade-booth-design"},
  { id: 4, title: "Image Editing", category: "Graphics & Design", description: "Professional photo retouching services", path: "/services/graphics/image-editing"},
  { id: 5, title: "Presentation Design", category: "Graphics & Design", description: "Create stunning presentations", path: "/services/graphics/presentation-design"},
  { id: 6, title: "Infographic Design", category: "Graphics & Design", description: "Visual representations of information", path: "/services/graphics/infographic-design"},
  { id: 7, title: "Resume Design", category: "Graphics & Design", description: "Professionally designed resumes", path: "/services/graphics/resume-design"},
  { id: 8, title: "Flyer Design", category: "Graphics & Design", description: "Creative flyers for events", path: "/services/graphics/flyer-design"},
  { id: 9, title: "Brochure Design", category: "Graphics & Design", description: "Professional brochures", path: "/services/graphics/brochure-design"},
  { id: 10, title: "Poster Design", category: "Graphics & Design", description: "Attention-grabbing posters", path: "/services/graphics/poster-design"},
  { id: 11, title: "Menu Design", category: "Graphics & Design", description: "Beautiful menu designs", path: "/services/graphics/menu-design"},
  { id: 12, title: "Invitation Design", category: "Graphics & Design", description: "Elegant invitations", path: "/services/graphics/invitation-design"},
  { id: 13, title: "Packaging & Label Design", category: "Graphics & Design", description: "Creative packaging solutions", path: "/services/graphics/packaging-&-label-design"},
  { id: 14, title: "Book Design", category: "Graphics & Design", description: "Complete book design services", path: "/services/graphics/book-design"},
  { id: 15, title: "Book Covers", category: "Graphics & Design", description: "Captivating book covers", path: "/services/graphics/book-covers"},
  { id: 16, title: "Album Cover Design", category: "Graphics & Design", description: "Unique album covers", path: "/services/graphics/album-cover-design"},
  { id: 17, title: "Social Media Design", category: "Graphics & Design", description: "Engaging social media graphics", path: "/services/graphics/social-media-design"},
  { id: 18, title: "Thumbnails Design", category: "Graphics & Design", description: "Click-worthy thumbnails", path: "/services/graphics/thumbnails-design"},
  { id: 19, title: "Email Design", category: "Graphics & Design", description: "Beautiful email templates", path: "/services/graphics/email-design"},
  { id: 20, title: "Web Banners", category: "Graphics & Design", description: "Effective banner ads", path: "/services/graphics/web-banners"},
  { id: 21, title: "Signage Design", category: "Graphics & Design", description: "Clear and attractive signage", path: "/services/graphics/signage-design"},

  // Business Services
  { id: 22, title: "Market Research", category: "Business", description: "Comprehensive market analysis", path: "/services/business/market-research"},
  { id: 23, title: "Business Plans", category: "Business", description: "Professional business plan development", path: "/services/business/business-plans" },
  { id: 24, title: "Business Consulting", category: "Business", description: "Expert business advice", path: "/services/business/business-consulting" },
  { id: 25, title: "HR Consulting", category: "Business", description: "Human resources solutions", path: "/services/business/hr-consulting" },
  { id: 26, title: "Project Management", category: "Business", description: "Professional project management", path: "/services/business/project-management"},
  { id: 27, title: "Product Management", category: "Business", description: "End-to-end product management", path: "/services/business/product-management" },
  { id: 28, title: "Sales", category: "Business", description: "Sales strategies and services", path: "/services/business/sales" },
  { id: 29, title: "Customer Experience Management", category: "Business", description: "Improve customer satisfaction", path: "/services/business/customer-experience-management-(cxm)"},
  { id: 30, title: "Lead Generation", category: "Business", description: "Targeted lead generation", path: "/services/business/lead-generation" },
  { id: 31, title: "Call Center & Calling", category: "Business", description: "Professional call center services", path: "/services/business/call-center-&-calling" },
  { id: 32, title: "Customer Care", category: "Business", description: "Exceptional customer service", path: "/services/business/customer-care" },

  // Digital Marketing
  { id: 33, title: "Video Marketing", category: "Digital Marketing", description: "Create engaging video content", path: "/services/digital/video-marketing" },
  { id: 34, title: "E-Commerce Marketing", category: "Digital Marketing", description: "Strategies to drive sales", path: "/services/digital/e-commerce-marketing" },
  { id: 35, title: "Email Marketing", category: "Digital Marketing", description: "Effective email campaigns", path: "/services/digital/email-marketing" },
  { id: 36, title: "Email Automations", category: "Digital Marketing", description: "Automated email sequences", path: "/services/digital/email-automations" },
  { id: 37, title: "Marketing Strategy", category: "Digital Marketing", description: "Comprehensive marketing plans", path: "/services/digital/marketing-strategy" },
  { id: 38, title: "Brand Strategy", category: "Digital Marketing", description: "Develop brand identity", path: "/services/digital/brand-strategy-(seo)"},
  { id: 39, title: "Digital Marketing Strategy", category: "Digital Marketing", description: "SEO-focused digital marketing", path: "/services/digital/digital-marketing-strategy-(seo)"},
  { id: 40, title: "Marketing Concepts & Ideation", category: "Digital Marketing", description: "Creative marketing concepts", path: "/services/digital/marketing-concepts-&-ideation"},
  { id: 41, title: "Conscious Branding & Marketing", category: "Digital Marketing", description: "Ethical marketing strategies", path: "/services/digital/conscious-branding-&-marketing-(seo)"},
  { id: 42, title: "Marketing Advice", category: "Digital Marketing", description: "Expert marketing guidance", path: "/services/digital/marketing-advice" },
  { id: 43, title: "Music Promotion", category: "Digital Marketing", description: "Promote your music", path: "/services/digital/music-promotion" },
  { id: 44, title: "Podcast Marketing", category: "Digital Marketing", description: "Grow podcast audience", path: "/services/digital/podcast-marketing" },
  { id: 45, title: "Mobile App Marketing", category: "Digital Marketing", description: "Promote mobile apps", path: "/services/digital/mobile-app-marketing" },
  { id: 46, title: "Book & eBook Marketing", category: "Digital Marketing", description: "Marketing for books", path: "/services/digital/book-ebook-marketing" },
  { id: 47, title: "Self-Publish Your Book", category: "Digital Marketing", description: "Self-publishing guidance", path: "/services/digital/self-publish-your-book" },

  // Music & Audio
  { id: 48, title: "Voice Over", category: "Music & Audio", description: "Professional voice over services", path: "/services/music/voice-over" },
  { id: 49, title: "Podcast Production", category: "Music & Audio", description: "Complete podcast production", path: "/services/music/podcast-production" },
  { id: 50, title: "Audiobook Production", category: "Music & Audio", description: "High-quality audiobooks", path: "/services/music/audiobook-production" },
  { id: 51, title: "Audio Ads Production", category: "Music & Audio", description: "Professional audio ads", path: "/services/music/audio-ads-production" },

  // Programming & Tech
  { id: 52, title: "Website Development", category: "Programming & Tech", description: "Custom website development", path: "/services/programming/website-development" },
  { id: 53, title: "Website Maintenance", category: "Programming & Tech", description: "Ongoing website maintenance", path: "/services/programming/website-maintenance" },
  { id: 54, title: "WordPress", category: "Programming & Tech", description: "WordPress development", path: "/services/programming/wordpress" },
  { id: 55, title: "Custom Websites", category: "Programming & Tech", description: "Fully custom websites", path: "/services/programming/custom-websites" },
  { id: 56, title: "Web Applications", category: "Programming & Tech", description: "Interactive web apps", path: "/services/programming/web-applications" },
  { id: 57, title: "Desktop Applications", category: "Programming & Tech", description: "Native desktop apps", path: "/services/programming/desktop-applications" },
  { id: 58, title: "Software Development", category: "Programming & Tech", description: "Custom software solutions", path: "/services/programming/software-development" },
  { id: 59, title: "Scripting", category: "Programming & Tech", description: "Automation scripts", path: "/services/programming/scripting" },
  { id: 60, title: "Plugins Development", category: "Programming & Tech", description: "Custom plugins", path: "/services/programming/plugins-development" },
  { id: 61, title: "Mobile App Development", category: "Programming & Tech", description: "iOS and Android apps", path: "/services/programming/mobile-app-development" },
  { id: 62, title: "Cross-platform Apps", category: "Programming & Tech", description: "Multi-platform apps", path: "/services/programming/cross-platform-apps" },
  { id: 63, title: "Mobile App Maintenance", category: "Programming & Tech", description: "App maintenance", path: "/services/programming/mobile-app-maintenance" },
  { id: 64, title: "Support & IT", category: "Programming & Tech", description: "Technical support", path: "/services/programming/support-&-it" },
  { id: 65, title: "Cloud Computing", category: "Programming & Tech", description: "Cloud solutions", path: "/services/programming/cloud-computing" },
  { id: 66, title: "Convert Files", category: "Programming & Tech", description: "File conversion services", path: "/services/programming/convert-files" },

  // Video & Animation
  { id: 67, title: "Video Editing", category: "Video & Animation", description: "Professional video editing", path: "/services/video/video-editing" },
  { id: 68, title: "Visual Effects", category: "Video & Animation", description: "Stunning visual effects", path: "/services/video/visual-effects" },
  { id: 69, title: "Video Art", category: "Video & Animation", description: "Creative video art", path: "/services/video/video-art" },
  { id: 70, title: "Intro & Outro Videos", category: "Video & Animation", description: "Custom intro/outro videos", path: "/services/video/intro-&-outro-videos" },
  { id: 71, title: "Video Templates Editing", category: "Video & Animation", description: "Customize video templates", path: "/services/video/video-templates-editing" },
  { id: 72, title: "Subtitles & Captions", category: "Video & Animation", description: "Professional subtitles", path: "/services/video/subtitles-&-captions" },
  { id: 73, title: "Video Arts & Commercials", category: "Video & Animation", description: "Creative video ads", path: "/services/video/video-arts-&-commercials" },
  { id: 74, title: "Social Media Videos", category: "Video & Animation", description: "Social media optimized videos", path: "/services/video/social-media-videos" },
  { id: 75, title: "Music Videos", category: "Video & Animation", description: "Professional music videos", path: "/services/video/music-videos" },
  { id: 76, title: "Slideshow Videos", category: "Video & Animation", description: "Engaging slideshows", path: "/services/video/slideshow-videos" },
  { id: 77, title: "Animated Explainers", category: "Video & Animation", description: "Animated explainer videos", path: "/services/video/animated-explainers" },
  { id: 78, title: "Live Action Explainers", category: "Video & Animation", description: "Live explainer videos", path: "/services/video/live-action-explainers" },
  { id: 79, title: "Screencasting Videos", category: "Video & Animation", description: "Professional screen recordings", path: "/services/video/screencasting-videos" },
  { id: 80, title: "Character Animation", category: "Video & Animation", description: "Character animation", path: "/services/video/character-animation" },
  { id: 81, title: "Animated GIFs", category: "Video & Animation", description: "Animated GIFs", path: "/services/video/animated-gifs" },
  { id: 82, title: "Animation for Kids", category: "Video & Animation", description: "Children's animations", path: "/services/video/animation-for-kids" },
  { id: 83, title: "Animation for Streamers", category: "Video & Animation", description: "Custom streamer animations", path: "/services/video/animation-for-streamers" },
  { id: 84, title: "2D, 3D, 4D & 6D Product Animation", category: "Video & Animation", description: "Dimensional animations", path: "/services/video/2d,-3d,-4d-&-6d-product-animation" },
  { id: 85, title: "E-Commerce Product Videos", category: "Video & Animation", description: "Product showcase videos", path: "/services/video/e-commerce-product-videos" },
  { id: 86, title: "Corporate Videos", category: "Video & Animation", description: "Corporate communications", path: "/services/video/corporate-videos" },
  { id: 87, title: "Logo Animation", category: "Video & Animation", description: "Animate your logo", path: "/services/video/logo-animation" },
  { id: 88, title: "Lottie & Web Animation", category: "Video & Animation", description: "Web animations", path: "/services/video/lottie-&-web-animation" },
  { id: 89, title: "Text Animation", category: "Video & Animation", description: "Dynamic text animations", path: "/services/video/text-animation" },
  { id: 90, title: "Filmed Video Production", category: "Video & Animation", description: "Professional video production", path: "/services/video/filmed-video-production" },
  { id: 91, title: "Videography", category: "Video & Animation", description: "Professional videography", path: "/services/video/videography" },
  { id: 92, title: "Article to Video", category: "Video & Animation", description: "Convert articles to video", path: "/services/video/article-to-video" },
  { id: 93, title: "Book Trailers", category: "Video & Animation", description: "Book trailers", path: "/services/video/book-trailers" },

  // Writing & Translation
  { id: 94, title: "Articles & Blog Posts", category: "Writing & Translation", description: "Professional writing services", path: "/services/writing/articles-&-blog-posts" },
  { id: 95, title: "Content Strategy", category: "Writing & Translation", description: "Content strategy development", path: "/services/writing/content-strategy" },
  { id: 96, title: "Website Content", category: "Writing & Translation", description: "SEO-optimized content", path: "/services/writing/website-content" },
  { id: 97, title: "Scriptwriting", category: "Writing & Translation", description: "Professional scripts", path: "/services/writing/scriptwriting" },
  { id: 98, title: "Creative Writing", category: "Writing & Translation", description: "Original creative writing", path: "/services/writing/creative-writing" },
  { id: 99, title: "Podcast Writing", category: "Writing & Translation", description: "Podcast scripts", path: "/services/writing/podcast-writing" },
  { id: 100, title: "Speechwriting", category: "Writing & Translation", description: "Persuasive speeches", path: "/services/writing/speechwriting" },
  { id: 101, title: "Research & Summaries", category: "Writing & Translation", description: "Research services", path: "/services/writing/research-&-summaries" },
  { id: 102, title: "Proofreading & Editing", category: "Writing & Translation", description: "Professional editing", path: "/services/writing/proofreading-&-editing" },
  { id: 103, title: "Writing Advice", category: "Writing & Translation", description: "Writing guidance", path: "/services/writing/writing-advice" },
  { id: 104, title: "Book & eBook Writing", category: "Writing & Translation", description: "Book writing services", path: "/services/writing/book-&-ebook-writing" },
  { id: 105, title: "Book Editing", category: "Writing & Translation", description: "Book manuscript editing", path: "/services/writing/book-editing" },
  { id: 106, title: "Translation", category: "Writing & Translation", description: "Professional translation", path: "/services/writing/translation" },
  { id: 107, title: "Transcription", category: "Writing & Translation", description: "Audio/video transcription", path: "/services/writing/transcription" },
  { id: 108, title: "Brand Voice & Tone", category: "Writing & Translation", description: "Brand voice development", path: "/services/writing/brand-voice-&-tone" },
  { id: 109, title: "Business Names & Slogans", category: "Writing & Translation", description: "Creative naming services", path: "/services/writing/business-names-&-slogans" },
  { id: 110, title: "Product Descriptions", category: "Writing & Translation", description: "Compelling product copy", path: "/services/writing/product-descriptions" },
  { id: 111, title: "Ad Copy", category: "Writing & Translation", description: "Persuasive ad copy", path: "/services/writing/ad-copy" },
  { id: 112, title: "Sales Copy", category: "Writing & Translation", description: "High-converting sales copy", path: "/services/writing/sales-copy" },
  { id: 113, title: "Email Copy", category: "Writing & Translation", description: "Engaging email copy", path: "/services/writing/email-copy" },
  { id: 114, title: "Social Media Copywriting", category: "Writing & Translation", description: "Social media content", path: "/services/writing/social-media-copywriting" },
  { id: 115, title: "Press Releases", category: "Writing & Translation", description: "Professional press releases", path: "/services/writing/press-releases" },
  { id: 116, title: "Resume Writing", category: "Writing & Translation", description: "Professional resumes", path: "/services/writing/resume-writing" },
  { id: 117, title: "Cover Letters", category: "Writing & Translation", description: "Custom cover letters", path: "/services/writing/cover-letters" },
  { id: 118, title: "LinkedIn Profiles", category: "Writing & Translation", description: "Optimized LinkedIn profiles", path: "/services/writing/linkedin-profiles" },
  { id: 119, title: "Job Descriptions", category: "Writing & Translation", description: "Clear job descriptions", path: "/services/writing/job-descriptions" },
  { id: 120, title: "Technical Writing", category: "Writing & Translation", description: "Technical documentation", path: "/services/writing/technical-writing" }
];

  const serviceCategories = [
    { name: 'Graphics & Design', path: '/services/graphics' },
    { name: 'Programming & Tech', path: '/services/programming' },
    { name: 'Digital Marketing', path: '/services/digital' },
    { name: 'Video & Animation', path: '/services/video' },
    { name: 'Writing & Translation', path: '/services/writing' },
    { name: 'Music & Audio', path: '/services/music' },
    { name: 'Business', path: '/services/business' },
  ];

  const mainLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Payment', path: '/payment' }
  ];

  const scrollToHome = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const scrollToServices = () => {
    const section = document.getElementById('services-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById('services-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const scrollToContact = () => {
    const section = document.getElementById('contact-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById('contact-section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

   // Search functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const results = servicesData
          .map(service => {
            // Calculate relevance score
            let score = 0;
            
            // Exact match in title
            if (service.title.toLowerCase() === query) score += 100;
            
            // Starts with query
            if (service.title.toLowerCase().startsWith(query)) score += 50;
            
            // Contains query in title
            if (service.title.toLowerCase().includes(query)) score += 30;
            
            // Contains query in category
            if (service.category.toLowerCase().includes(query)) score += 20;
            
            // Contains query in description
            if (service.description.toLowerCase().includes(query)) score += 10;
            
            return { ...service, score };
          })
          .filter(service => service.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        
        setSearchResults(results);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);



const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  useEffect(() => {

    const handleClickOutside = (e) => {
  if (searchRef.current && 
      !searchRef.current.contains(e.target) &&
      !e.target.closest('.search-result-item')) {  // Add this condition
    setShowResults(false);
  }
};

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);




  // Set active link based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeMainLink = mainLinks.find(link => currentPath === link.path);
    const activeServiceCategory = serviceCategories.find(category => currentPath.startsWith(category.path));

    if (activeMainLink) {
      setActiveLink(activeMainLink.name);
    } else if (activeServiceCategory) {
      setActiveLink('Services');
    } else {
      setActiveLink('');
    }
  }, [location.pathname]);

  // Teal and Blue Color Theme
  const colors = {
    teal: '#008080',
    lightTeal: '#20B2AA',
    blue: '#1E90FF',
    darkBlue: '#0077B6',
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    darkGray: '#333333',
    hoverBlue: '#00B4D8'
  };

  const styles = {
    navbar: {
      backgroundColor: colors.white,
      padding: 'clamp(0px, 1vw, 16px) 0',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: 0,
      zIndex: 1000,
      width: '100%',
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '0 clamp(10px, 2vw, 20px)',
    },
    logo: {
      fontSize: 'clamp(40px, 6vw, 70px)',
      fontWeight: 'bold',
      color: colors.teal,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      height: 'clamp(50px, 6vw, 70px)'
    },
    navLinks: {
      display: 'flex',
      gap: 'clamp(0.75rem, 2vw, 2rem)',
      alignItems: 'center',
    },
    navLink: {
      color: colors.darkGray,
      textDecoration: 'none',
      fontWeight: '500',
      padding: 'clamp(5px, 1vw, 10px)',
      fontSize: 'clamp(14px, 1.5vw, 18px)',
      transition: 'color 0.3s',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      letterSpacing: '0px',
      whiteSpace: 'nowrap'
    },
    activeNavLink: {
      color: colors.teal,
    },
    underline: {
      position: 'absolute',
      bottom: '-5px',
      left: 0,
      width: '100%',
      height: '2px',
      backgroundColor: colors.teal,
    },
    mobileMenuButton: {
      display: 'none',
      background: 'none',
      border: 'none',
      fontSize: 'clamp(20px, 3vw, 24px)',
      cursor: 'pointer',
      color: colors.teal,
      overflowY: 'auto',
      maxHeight: 'calc(100vh - clamp(70px, 8vw, 100px))',
    },
    mobileMenu: {
    display: 'none',
    position: 'fixed', // Changed from 'absolute'
    top: 'clamp(70px, 8vw, 100px)', // Adjust this to match your navbar height
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 'clamp(0.8rem, 1.5vw, 1rem)',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 999,
    maxHeight: 'calc(100vh - clamp(70px, 8vw, 100px))', // Prevent overflow
    // overflowY: 'hidden', 
    },
    mobileLink: {
      display: 'block',
      padding: 'clamp(0.4rem, 1vw, 0.5rem) 0',
      color: colors.darkGray,
      textDecoration: 'none',
      fontSize: 'clamp(16px, 1.5vw, 18px)'
    },
    searchContainer: {
      position: 'relative',
      width: 'clamp(140px, 20vw, 200px)',
      minWidth: 'clamp(120px, 15vw, 150px)',
    },
    searchInput: {
      width: '100%',
      padding: 'clamp(8px, 1vw, 10px) clamp(30px, 3vw, 35px) clamp(8px, 1vw, 10px) clamp(12px, 1vw, 15px)',
      borderRadius: '4px',
      borderColor: colors.lightTeal,
      fontSize: 'clamp(14px, 1.5vw, 16px)',
      outline: 'none',
      transition: 'border-color 0.3s',
    },
    searchIcon: {
      position: 'absolute',
      right: 'clamp(8px, 1vw, 10px)',
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.teal,
      cursor: 'pointer',
      fontSize: 'clamp(14px, 1.5vw, 16px)',
      pointerEvents: 'none'
    },
    searchResults: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: colors.white,
      border: `1px solid ${colors.lightTeal}`,
      borderRadius: '0 0 4px 4px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      maxHeight: '400px',
      overflowY: 'auto',
      transition: 'all 0.3s ease',
      opacity: showResults ? 1 : 0,
      visibility: showResults ? 'visible' : 'hidden',
      transform: showResults ? 'translateY(0)' : 'translateY(-10px)',
      zIndex: 1001,
    },
    searchResultItem: {
      padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1vw, 15px)',
      cursor: 'pointer',
      borderBottom: `1px solid ${colors.lightTeal}`,
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: colors.lightTeal,
      }
    },
    searchResultTitle: {
      fontWeight: '600',
      color: colors.teal,
      marginBottom: '2px',
      fontSize: 'clamp(14px, 1.5vw, 16px)'
    },
    searchResultCategory: {
      fontSize: 'clamp(11px, 1.25vw, 12px)',
      color: colors.blue,
      marginBottom: '4px',
    },
    searchResultDescription: {
      fontSize: 'clamp(11px, 1.25vw, 12px)',
      color: colors.darkGray,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    noResults: {
      padding: 'clamp(10px, 1vw, 12px) clamp(12px, 1vw, 15px)',
      color: colors.darkGray,
      fontStyle: 'italic',
      fontSize: 'clamp(14px, 1.5vw, 16px)'
    },
    logoImage: {
      height: 'clamp(50px, 6vw, 70px)',
      width: 'auto',
      zIndex: '1000'
    },


    mobileSearchResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    border: `1px solid ${colors.lightTeal}`,
    borderRadius: '0 0 4px 4px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxHeight: '60vh', // Adjusted height
    overflowY: 'auto', // Scroll only for results
    zIndex: 1001,
    marginTop: '5px',
},

  mobileMenuLink: {
  display: 'block',
  padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
  color: colors.darkGray,
  textDecoration: 'none',
  fontSize: 'clamp(16px, 4vw, 18px)',
  fontWeight: '500',
  borderBottom: `1px solid ${colors.lightGray}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: colors.lightGray,
  },
  '&:last-child': {
    borderBottom: 'none',
  }
},

mobileActiveLink: {
  color: colors.teal,
  fontWeight: '600',
},

};

  // Responsive styles
  if (window.innerWidth < 768) {
    styles.mobileMenuButton.display = 'block';
    styles.navLinks.display = 'none';
    if (mobileMenuOpen) {
      styles.mobileMenu.display = 'block';
    }
  }

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link 
            to="/" 
            style={styles.logo}
            onClick={() => {
              setActiveLink('Home');
              resetSearch();
              scrollToHome();
            }}
          >
            <img 
              src="/images/flogo.png" 
              alt="Fulfill First"
              style={styles.logoImage}
            />
          </Link>
          
          <div style={styles.navLinks}>
            {/* Home Link */}
            <Link 
              to="/" 
              style={{
                ...styles.navLink,
                ...(activeLink === 'Home' && styles.activeNavLink)
              }}
              onClick={() => {
                setActiveLink('Home');
                resetSearch();
                scrollToHome();
              }}
            >
              Home
              {activeLink === 'Home' && <span style={styles.underline}></span>}
            </Link>

            <Link 
              to="/"  
              style={{
                ...styles.navLink,
                ...(activeLink === 'Services' && styles.activeNavLink)
              }}
              onClick={() => {
                setActiveLink('Services');  
                resetSearch();
                scrollToServices();
              }}
            >
              Our Services
              {activeLink === 'Services' && <span style={styles.underline}></span>}
            </Link>

            {/* About Us Link */}
            <Link 
              to="/bookstore"
              style={{
                ...styles.navLink,
                ...(activeLink === 'About Us' && styles.activeNavLink)
              }}
              onClick={() => {
                setActiveLink('About Us');
                resetSearch();
                setMobileMenuOpen(false);
              }}
            >
              Proof of Fulfillment
              {activeLink === 'About Us' && <span style={styles.underline}></span>}
            </Link>

            {/* Contact Us Link */}
            <Link 
              to="/"
              style={{
                ...styles.navLink,
                ...(activeLink === 'Contact Us' && styles.activeNavLink)
              }}
              onClick={(e) => {
                e.preventDefault();
                setActiveLink('Contact Us');
                resetSearch();
                scrollToContact();
              }}
            >
              Contact Us
              {activeLink === 'Contact Us' && <span style={styles.underline}></span>}
            </Link>


     
          <div style={styles.searchContainer} ref={searchRef}>
  <form id='searchForm' onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
    <input
      type="text"
      placeholder="Search all services..."
      style={{
        ...styles.searchInput,
        ...(searchQuery ? styles.searchInputFocus : {}),
        width: '100%',
        paddingRight: '35px'
      }}
      value={searchQuery}
      onChange={handleSearchChange}
      onFocus={() => searchQuery && setShowResults(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleSearchSubmit(e);
        }
      }}
    />
    <FaSearch 
      style={{
        ...styles.searchIcon,
        right: '15px',
         pointerEvents: 'none'
      }} 
    />
  </form>
    
  {showResults && (
    <div style={styles.searchResults}>
      {searchResults.length > 0 ? (
        searchResults.map((service, index) => (
          <div
            key={service.id}
             className="search-result-item"  
            style={{
              ...styles.searchResultItem,
              ...(index === searchResults.length - 1 ? { borderBottom: 'none' } : {}),
            }}

            onClick={(e)=> {
              e.stopPropagation();  
              navigate(service.path);  // Directly navigate
              setSearchQuery('');     // Clear search
              setShowResults(false); // Close dropdown
              if (window.innerWidth <= 768) setMobileMenuOpen(false); // Mobile fix
            }}
          >
            <div style={styles.searchResultTitle}>{service.title}</div>
            <div style={styles.searchResultCategory}>{service.category}</div>
            <div style={styles.searchResultDescription}>{service.description}</div>
          </div>
        ))
      ) : (
        searchQuery && (
          <div style={styles.noResults}>
            No services found for "{searchQuery}"
          </div>
        )
      )}
    </div>
  )}
</div>
          </div>
          
          <button 
  style={styles.mobileMenuButton} 
  onClick={() => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Reset search when toggling menu
    if (!mobileMenuOpen) {
      setSearchQuery('');
      setShowResults(false);
    }
  }}
>
  {mobileMenuOpen ? <FaTimes /> : <FaBars />}
</button>
        </div>
      </nav>
      
     {/* Mobile Menu */}
<div style={{
  ...styles.mobileMenu,
  display: mobileMenuOpen ? 'block' : 'none'
}}>
  <Link 
    to="/" 
    style={{
      ...styles.mobileMenuLink,
      ...(activeLink === 'Home' && styles.mobileActiveLink)
    }}
    onClick={() => {
      setActiveLink('Home');
      setMobileMenuOpen(false);
      resetSearch();
      scrollToHome();
    }}
  >
    Home
  </Link>
  
  <Link 
    to="/"
    style={{
      ...styles.mobileMenuLink,
      ...(activeLink === 'Services' && styles.mobileActiveLink)
    }}
    onClick={(e) => {
      e.preventDefault();
      setActiveLink('Services');
      setMobileMenuOpen(false);
      resetSearch();
      scrollToServices();
    }}
  >
    Our Services
  </Link>
  
  <Link 
  to="/bookstore"
  style={{
    ...styles.mobileMenuLink,
    ...(activeLink === 'About Us' && styles.mobileActiveLink)
  }}
  onClick={() => {
    setActiveLink('About Us');
    setMobileMenuOpen(false);
    resetSearch();
  }}
>
  Proof of Fulfillment
</Link>
  
  <Link 
    to="/"
    style={{
      ...styles.mobileMenuLink,
      ...(activeLink === 'Contact Us' && styles.mobileActiveLink)
    }}
    onClick={(e) => {
      e.preventDefault();
      setActiveLink('Contact Us');
      setMobileMenuOpen(false);
      resetSearch();
      scrollToContact();
    }}
  >
    Contact Us
  </Link>

        {/* Mobile Search */}
<div style={{
  position: 'relative', // Important for absolute positioning of dropdown
  width: '100%',
  margin: 'clamp(8px, 1vw, 12px) 0',
}} ref={searchRef}>
  <form id='mobileSearchForm' onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
    <input
      type="text"
      placeholder="Search all services..."
      style={{
        ...styles.searchInput,
        width: '100%',
        padding: 'clamp(8px, 1vw, 10px) clamp(30px, 3vw, 35px) clamp(8px, 1vw, 10px) clamp(12px, 1vw, 15px)',
      }}
      value={searchQuery}
      onChange={handleSearchChange}
      onFocus={() => setShowResults(true)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
    />
    <FaSearch 
      style={{
        ...styles.searchIcon,
        right: 'clamp(8px, 1vw, 10px)',
        pointerEvents: 'none'
      }} 
    />
  </form>
  
  {showResults && (
    // <div style={window.innerWidth < 768 ? {
    //   ...styles.mobileSearchResults,
    //   maxHeight: 'calc(100vh - 200px)' // Adjust based on your needs
    // } : styles.searchResults}>
    <div style={window.innerWidth < 768 ? {
      ...styles.mobileSearchResults,
      maxHeight: `calc(100vh - ${document.querySelector('nav')?.offsetHeight || 70}px - ${document.querySelector('[style*="mobileMenu"]')?.offsetHeight || 0}px - 50px)`
    } : styles.searchResults}>
      {searchResults.length > 0 ? (
        searchResults.map((service, index) => (
          <div
            key={service.id}
            className="search-result-item"
            style={{
              ...styles.searchResultItem,
              padding: 'clamp(8px, 1vw, 10px) clamp(12px, 1vw, 15px)',
              ...(index === searchResults.length - 1 ? { borderBottom: 'none' } : {}),
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(service.path);
              setSearchQuery('');
              setShowResults(false);
              setMobileMenuOpen(false);
            }}
          >
            <div style={styles.searchResultTitle}>{service.title}</div>
            <div style={styles.searchResultCategory}>{service.category}</div>
            <div style={styles.searchResultDescription}>{service.description}</div>
          </div>
        ))
      ) : (
        searchQuery && (
          <div style={styles.noResults}>
            No services found for "{searchQuery}"
          </div>
        )
      )}
    </div>
  )}
</div>

      </div>
    </>
  );
}