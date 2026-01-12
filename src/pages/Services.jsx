import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Teal theme colors
const tealTheme = {
  primary: 'white',
  primaryLight: '#4cb8b8',
  primaryDark: 'white',
  accent: '#00cccc',
  textOnPrimary: '#004040',
  hover: '#00a3a3',
  teal50: 'white',
  teal100: '#B2DFDB',
  teal200: '#80CBC4',
  teal300: '#4DB6AC',
  teal400: '#26A69A',
  teal500: '#008080',
  teal600: '#00897B',
  teal700: '#00796B',
  teal800: '#00695C',
  teal900: '#004D40',
};

const allServiceDetails = [

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
  { id: 120, title: "Technical Writing", category: "Writing & Translation", description: "Technical documentation", path: "/services/writing/technical-writing" },
  { id: 121, title: "Blurb", category: "Writing & Translation", description: "Book blurbs that captivate readers", path: "/services/writing/blurb" },
  { id: 122, title: "Portfolio", category: "Programming & Tech", description: "Custom-built portfolio websites to showcase your skills, projects, and achievements with a professional online presence.", path: "/services/writing/portfolio" },
  { id: 123, title: "Community Boosting", category: "Digital Marketing", description: "Increase your brand’s reach and engagement with targeted social media strategies, optimized posts, and growth-focused campaigns across major platforms.", 
  path: "/services/digital/social-media-boosting"},
  { 
  id: 124, 
  title: "Copyright Registration", 
  category: "Business", 
  description: "Secure legal protection for your original works with professional copyright registration services, ensuring your creative content is officially recognized and safeguarded.", 
  path: "/services/business/copyright-registration" 
  },
  {
  id: 125,
  title: "RePublication",
  category: "Writing & Translation",
  description: "Professional editing and preparation of book manuscripts for re-release or new editions.",
  path: "/services/writing/republication"
}


];
// Service data for all sections
const graphicsServiceDetails = {
  "Industrial & Product Design": {
    title: "Industrial & Product Design",
    description: "Professional design services for physical products and industrial applications.",
    modalImage: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/6fd4b9133605263.61c1a6ed5b742.jpg",
    path: "/services/graphics/industrial-&-product-design",
    price: "$4,750" ,
    section: "graphics",
    area: "product-gaming"
  },
  "Graphics for Streamers": {
    title: "Graphics for Streamers",
    description: "Custom overlays, panels, and emotes for your streaming channels.",
    modalImage: "https://masterbundles.com/wp-content/uploads/2023/05/preview-1-276.jpg" ,
    path: "/services/graphics/graphics-for-streamers",
    price: "$475",
    section: "graphics",
    area: "product-gaming"
  },
  "Trade Booth Design": {
    title: "Trade Booth Design",
    description: "Eye-catching booth designs for trade shows and exhibitions.",
    modalImage: "https://png.pngtree.com/thumb_back/fh260/background/20230704/pngtree-3d-render-of-an-impressive-exhibition-booth-image_3755207.jpg",
    path: "/services/graphics/trade-booth-design",
    price: "$3,500" ,
     section: "graphics",
    area: "product-gaming"
  },
  "Image Editing": {
    title: "Image Editing",
    description: "Professional photo retouching, background removal, and image enhancement.",
    modalImage: "https://icecreamapps.com/storage/uploads/icecream%20editing%20software%202.png" ,
    path: "/services/graphics/image-editing",
    price: "$80" ,
    section: "graphics",
    area: "visual-design"
  },
  "Presentation Design": {
    title: "Presentation Design",
    description: "Create stunning and effective presentations that captivate your audience.",
    modalImage: "https://img.pikbest.com/templates/20250108/creative-corporate-powerpoint-presentation-slide-template-modern-business-slides_11353572.jpg!bw700", 
    path: "/services/graphics/presentation-design",
    price: "$700" ,
    section: "graphics",
    area: "visual-design"
  },
  "Infographic Design": {
    title: "Infographic Design",
    description: "Visual representations of information that are easy to understand and engaging.",
    modalImage: "https://www.freevector.com/uploads/vector/preview/24618/abstract-infographic-design-vector-templates.jpg",
    path: "/services/graphics/infographic-design",
    price: "$475" ,
    section: "graphics",
    area: "visual-design"
  },
  "Resume Design": {
    title: "Resume Design",
    description: "Professionally designed resumes that stand out to employers.",
    modalImage: "https://www.goskills.com/blobs/blogs/86/e485c22c-9a98-4b20-8e34-f5d970949629.png",
    path: "/services/graphics/resume-design",
    price: "$235" ,
    section: "graphics",
    area: "visual-design"
  },
  "Flyer Design": {
    title: "Flyer Design",
    description: "Creative flyers for events, promotions, and announcements.",
    modalImage: "https://media.istockphoto.com/id/956414624/vector/brochure-flyer-template-layout-background-design-booklet-leaflet-corporate-business-annual.jpg?s=612x612&w=0&k=20&c=aFxHWZda5RAkALIZJm5_G8MmRPEhlBhgEt_HTOoYUHc=",
    path: "/services/graphics/flyer-design",
    price: "$235" ,
    section: "graphics",
    area: "print-design"
  },
  "Brochure Design": {
    title: "Brochure Design",
    description: "Professional brochures that effectively communicate your message.",
    modalImage: "https://thumbs.dreamstime.com/b/vector-modern-brochure-wave-design-abstract-flyer-technology-background-layout-template-poster-black-yellow-w-white-115649347.jpg",
    path: "/services/graphics/brochure-design",
    price: "$575" ,
    section: "graphics",
    area: "print-design"
  },
  "Poster Design": {
    title: "Poster Design",
    description: "Attention-grabbing posters for events, movies, and promotions.",
    modalImage: "https://t4.ftcdn.net/jpg/02/34/45/75/360_F_234457527_f5gGlJgal9y549owGTpOD3lFmrg8fFCB.jpg",
    path: "/services/graphics/poster-design",
    price: "$315" ,
    section: "graphics",
    area: "print-design"
  },
  "Menu Design": {
    title: "Menu Design",
    description: "Beautiful and functional menu designs for restaurants and cafes.",
    modalImage: "https://static.vecteezy.com/system/resources/thumbnails/012/196/191/small_2x/lovely-food-menu-and-restaurant-flyer-design-template-free-vector.jpg",
    path: "/services/graphics/menu-design",
    price: "$475" ,
    section: "graphics",
    area: "print-design"
  },
  "Invitation Design": {
    title: "Invitation Design",
    description: "Elegant invitations for weddings, parties, and special events.",
    modalImage: "https://raketcontent.com/wedding_invitation_template_with_red_floral_and_gold_leaves_vector_583a0c0552.jpg",
    path: "/services/graphics/invitation-design",
    price: "$315" ,
    section: "graphics",
    area: "print-design"
  },
  "Packaging & Label Design": {
    title: "Packaging & Label Design",
    description: "Creative packaging solutions that make your product stand out.",
    modalImage: "https://img.freepik.com/premium-vector/packaging-label-design-template_1588-589.jpg",
    path: "/services/graphics/packaging-label-design",
    price: "$1,200" ,
    section: "graphics",
    area: "packaging-covers"
  },
  "Book Design": {
    title: "Book Design",
    description: "Complete book design services including layout and typography.",
    modalImage: "https://designshack.net/wp-content/uploads/minimal-book-indesign-template-780-1.jpg",
    path: "/services/graphics/book-design",
    price: "$1,750" ,
    section: "graphics",
    area: "packaging-covers"
  },
  "Book Covers": {
    title: "Book Covers",
    description: "Captivating book covers that attract readers.",
    modalImage: "https://static.vecteezy.com/system/resources/previews/022/159/463/non_2x/book-cover-abstract-minimalist-art-soft-cover-book-design-poster-design-vector.jpg",
     path: "/services/graphics/book-covers",
    price: "$675" ,
     section: "graphics",
    area: "packaging-covers"
  },
  "Album Cover Design": {
    title: "Album Cover Design",
    description: "Unique album covers that represent your music.",
    modalImage: "https://i.pinimg.com/736x/1c/15/30/1c153006244f21b2ab23f7f83fa8dfaa.jpg",
    path: "/services/graphics/album-cover-design",
    price: "$475" ,
    section: "graphics",
    area: "packaging-covers"
  },
  "Social Media Design": {
    title: "Social Media Design",
    description: "Engaging social media graphics for all platforms.",
    modalImage: "https://www.dotyeti.com/wp-content/uploads/2021/04/Screen-Shot-2021-04-08-at-1.26.36-PM.png",
    path: "/services/graphics/social-media-design",
    price: "$340" ,
     section: "graphics",
    area: "marketing-design"
  },
  "Thumbnails Design": {
    title: "Thumbnails Design",
    description: "Click-worthy thumbnails for your videos and content.",
    modalImage: "https://www.creativefabrica.com/wp-content/uploads/2021/06/06/YouTube-Thumbnail-TemplatesPSD-SVG-AI-Graphics-13006896-1-1-580x414.png",
    path: "/services/graphics/thumbnails-design", 
    price: "$53" ,
     section: "graphics",
    area: "marketing-design"
  },
  "Email Design": {
    title: "Email Design",
    description: "Beautiful email templates that improve engagement.",
    modalImage: "https://ghost-images.chamaileon.io/2017/02/really-good-emails-1280x570.png",
     path: "/services/graphics/email-design",
    price: "$315" ,
     section: "graphics",
    area: "marketing-design"
  },
  "Web Banners": {
    title: "Web Banners",
    description: "Effective banner ads for websites and online campaigns.",
    modalImage: "https://t4.ftcdn.net/jpg/01/64/26/27/360_F_164262701_BsbY2qe8M3fvvB4cBWsFLgeEXhgEukcw.jpg",
   path: "/services/graphics/web-banners", 
    price: "$340" ,
     section: "graphics",
    area: "marketing-design"
  },
  "Signage Design": {
    title: "Signage Design",
    description: "Clear and attractive signage for businesses and events.",
    modalImage: "https://static.vecteezy.com/system/resources/previews/004/896/584/non_2x/creative-business-roll-up-signage-banner-template-design-free-vector.jpg",
    path: "/services/graphics/signage-design",
     price: "$675" ,
     section: "graphics",
    area: "marketing-design"
  }

};

const businessServiceDetails = {
  "Market Research": {
    title: "Market Research",
    description: "Comprehensive market analysis to inform your business decisions.",
    modalImage: "https://truicbusinessideas.com/wp-content/uploads/2024/08/market-research.jpg",
    path: "/services/business/market-research", 
    price: "$5,000 | Comprehensive market report with analysis" ,
    section: "business",
    area: "formation-consulting"
  },
  "Business Plans": {
    title: "Business Plans",
    description: "Professional business plan development for startups and growth.",
    modalImage: "https://imageio.forbes.com/specials-images/imageserve/6558e3d0ed69fc40a9be3fcf/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
    path: "/services/business/business-plans",
    price: "$3,500 | Full plan with financials and market sizing" ,
    section: "business",
    area: "formation-consulting"
  },
  "Business Consulting": {
    title: "Business Consulting",
    description: "Expert advice to solve business challenges and drive growth.",
    modalImage: "https://imageio.forbes.com/specials-images/imageserve/5e56f223d378190007f46149/A-management-consulting-career--How-to-build-a-career-as-a-management-consultant-/960x0.jpg?format=jpg&width=960",
    path: "/services/business/business-consulting",
    price: "$15,000 | Multi-month strategic engagement " ,
    section: "business",
    area: "formation-consulting"
  },
  "HR Consulting": {
    title: "HR Consulting",
    description: "Human resources solutions tailored to your business needs.",
    modalImage: "https://corpemployservices.com/wp-content/uploads/2021/07/HR-Consulting-mobile.jpg",
    path: "/services/business/hr-consulting",
    price: "$8,000 | HR audit + policy revamp " ,
    section: "business",
    area: "formation-consulting"
  },
  "Project Management": {
    title: "Project Management",
    description: "Professional project management services to keep your initiatives on track.",
    modalImage: "https://media.istockphoto.com/id/1411195926/photo/project-manager-working-on-laptop-and-updating-tasks-and-milestones-progress-planning-with.jpg?s=612x612&w=0&k=20&c=5A0CEsRbIrgnci0Q7LSxbrUZ1pliXy8C04ffpnjnVIw=",
    path: "/services/business/project-management",
    price: "$10,000  | End-to-end management of a mid-sized project" ,
    section: "business",
    area: "operations-management"
  },
  "Product Management": {
    title: "Product Management",
    description: "End-to-end product management from conception to launch.",
    modalImage: "https://zenkit.com/wp-content/uploads/2019/11/Product-Management-Explained.jpg",
    path: "/services/business/product-management",
    price: "$7,500 | MVP roadmap and coordination" ,
    section: "business",
    area: "operations-management"
  },
  "Sales": {
    title: "Sales",
    description: "Sales strategies and services to boost your revenue.",
    modalImage: "https://cdn.prod.website-files.com/5b7f24cc900973de13d7beb4/65b0a35d978a57a12b8837b6_Gross%20Sales%201.svg",
    path: "/services/business/sales",
    price: "$5000 | Campaign Package" ,
    section: "business",
    area: "sales-customer-care"
  },
  "Customer Experience Management (CXM)": {
    title: "Customer Experience Management (CXM)",
    description: "Improve customer satisfaction and loyalty with expert CX strategies.",
    modalImage: "https://www.tryvium.ai/wp-content/uploads/2024/11/contact-center-ai-solutions-scaled.webp",
    path: "/services/business/customer-experience-management-(cxm)",
    price: "$12,000 | CX audit + improvement roadmap" ,
    section: "business",
    area: "sales-customer-care"
  },
  "Lead Generation": {
    title: "Lead Generation",
    description: "Targeted lead generation services to grow your customer base.",
    modalImage: "https://blog.thomasnet.com/hs-fs/hubfs/lead-generation.jpeg?width=691&height=418&name=lead-generation.jpeg",
    path:"/services/business/lead-generation",
    price: "$7,500/month | Retainer model " ,
    section: "business",
    area: "sales-customer-care"
  },
  "Call Center & Calling": {
    title: "Call Center & Calling",
    description: "Professional call center services for your business needs.",
    modalImage: "https://www.mapcommunications.com/wp-content/uploads/2018/06/MAP-Communications-24-Hour-Call-Center.jpeg",
    path:"/services/business/call-center-&-calling",
    price: "$3000/month | Outsourced call center support" ,
    section: "business",
    area: "sales-customer-care"
  },
  "Customer Care": {
    title: "Customer Care",
    description: "Exceptional customer service solutions for your business.",
    modalImage: "https://www.a1callcenter.com/blog/wp-content/uploads/2023/08/Taking-Customer-Care-Beyond-What-Competitors-Offer.png",
    path:"/services/business/customer-care",
    price: "$4,000/month | Multi-channel support package" ,
    section: "business",
    area: "sales-customer-care"
  },
  "Copyright Registration": {
  title: "Copyright Registration",
  description: "Protect your original works with professional copyright registration services. Ensure your creative content, inventions, and intellectual property are legally recognized and safeguarded.",
  modalImage: "https://www.elegantthemes.com/blog/wp-content/uploads/2019/03/featured-how-to-copyright.png",
  path: "/services/business/copyright-registration",
  price: "$500 | Per registration",
  section: "business",
  area: "legal-services"
}

};

const digitalServiceDetails = {
  "Video Marketing": {
    title: "Video Marketing",
    description: "Create engaging video content to promote your brand and products.",
    modalImage: "https://imageio.forbes.com/specials-images/imageserve/5efe00ef531e15000701b33d/Behind-the-scenes-of-a-business-vlog/960x0.jpg?height=474&width=711&fit=bounds",
     path:"/services/digital/video-marketing",
    price: "$8,000 | Campaign video production and distribution " ,
     section: "digital",
    area: "methods-techniques"
  },
 "E-Commerce Marketing": {
    title: "E-Commerce Marketing",
    description: "Strategies to drive traffic and sales to your online store.",
    modalImage: "https://altcraft.com/_next/image?url=%2Fimages%2Fuploads%2Fexamples_strategies_of_internet_marketin_83fc7cbfef.png&w=3840&q=75",
     path:"/services/digital/e-commerce-marketing",
    price: "$10,000 | Launch + campaign optimization" ,
     section: "digital",
    area: "methods-techniques"
  },
  "Email Marketing": {
    title: "Email Marketing",
    description: "Effective email campaigns to engage your audience and drive conversions.",
    modalImage: "https://blog.blendee.com/wp-content/uploads/2024/11/email-marketing.jpg",
     path:"/services/digital/email-marketing",
    price: "$6,000/year | Setup + automation series" ,
     section: "digital",
    area: "methods-techniques"
  },
  "Email Automations": {
    title: "Email Automations",
    description: "Automated email sequences to nurture leads and customers.",
    modalImage: "https://www.sender.net/wp-content/uploads/2022/01/What-is-Email-Automation.-Definition-Flows-Tools-smaller.png",
    path:"/services/digital/email-automations",
    price: "$7,500/year | Advanced automations" ,
     section: "digital",
    area: "methods-techniques"
  },"Community Boosting": {
  title: "Community Boosting",
  description: "Boost your online presence with targeted social media growth strategies. We optimize content, engagement, and follower growth to help your brand gain visibility and credibility across major platforms.",
  modalImage: "https://impactgroupmarketing.com/Portals/0/xBlog/uploads/2020/2/14/iStock-1155073654_2.jpg",
  path: "/services/digital/social-media-boosting",
  price: "$3/1000 followers | Platform dependent",
  section: "digital",
  area: "methods-techniques"
},
 
  "Marketing Strategy": {
    title: "Marketing Strategy",
    description: "Comprehensive plans to achieve your marketing goals.",
    modalImage: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/2bS9Rd8vBFkIcnziIbAqSY/426ec3a30c1f8dfe120bb9dd8a3c324d/GettyImages-1227481145.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
    path:"/services/digital/marketing-strategy",
    price: "$15,000 | Full strategy + implementation roadmap " ,
    section: "digital",
    area: "analytics-strategy"
  },
  "Brand Strategy (SEO)": {
    title: "Brand Strategy (SEO)",
   description: "Develop your brand identity with SEO-optimized strategies.",
    modalImage: "https://orioly.com/wp-content/uploads/2016/11/seo-for-tour-operators-illustration-1.png",
     path:"/services/digital/brand-strategy-(seo)",
    price: "$500.00" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Digital Marketing strategy (SEO)": {
    title: "Digital Marketing strategy (SEO)",
    description: "SEO-focused digital marketing plans for online growth.",
    modalImage: "https://blog.bluetuskr.com/hubfs/seo-search-engine-optimization-business-conceptual.jpg",
     path:"/services/digital/digital-marketing-strategy-(seo)",
    price: "$8,000 | SEO audit + 6-month implementation" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Marketing Concepts & Ideation": {
    title: "Marketing Concepts & Ideation",
   description: "Creative concepts and ideas for your marketing campaigns.",
    modalImage: "https://stg-uploads.slidenest.com/template_786/templateColor_819/previewImages/marketing-concepts-infographic-powerpoint-google-slides-keynote-presentation-template-1.jpg",
     path:"/services/digital/marketing-concepts-&-ideation",
    price: "$10,000 | Creative workshops and deliverables" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Conscious Branding & Marketing (SEO)": {
    title: "Conscious Branding & Marketing (SEO)",
    description: "Ethical and sustainable marketing strategies with SEO focus.",
    modalImage: "https://thriveagency.com/files/What-Is-Conscious-Marketing-and-Why-It-Is-Important1200x720_011720.png",
    path:"/services/digital/conscious-branding-&-marketing-(seo)",
    price: "$12,000 | Brand positioning + SEO campaign" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Marketing Advice": {
    title: "Marketing Advice",
    description: "Expert guidance for your marketing challenges and opportunities.",
    modalImage: "https://cdn2.hubspot.net/hubfs/53/marketing-advice-1.jpg",
    path:"/services/digital/marketing-advice", 
    price: "$5,000 | Strategic consulting package" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Music Promotion": {
    title: "Music Promotion",
    description: "Strategies to promote your music and grow your audience.",
    modalImage: "https://musicreviewworld.com/wp-content/uploads/2022/08/Music-Promotion-Services-Online.webp",
     path:"/services/digital/music-promotion",
    price: "$5,000 | Single/album campaign" ,
     section: "digital",
    area: "industry-purpose-specific"
  },
  "Podcast Marketing": {
    title: "Podcast Marketing",
    description: "Grow your podcast audience and increase engagement.",
    modalImage: "https://static.vecteezy.com/system/resources/previews/002/157/582/non_2x/podcast-cover-design-template-free-vector.jpg",
     path:"/services/digital/podcast-marketing",
    price: "$4,000 | Launch + promotion strategy" ,
     section: "digital",
    area: "industry-purpose-specific"
  },
  "Mobile App Marketing": {
    title: "Mobile App Marketing",
    description: "Promote your mobile app and increase downloads.",
    modalImage: "https://www.goodworklabs.com/wp-content/uploads/2016/12/mobile-app-marketing.jpg",
     path:"/services/digital/mobile-app-marketing",
    price: "$6,000 | App launch campaign" ,
     section: "digital",
    area: "industry-purpose-specific"
  },
  "Book & eBook Marketing": {
    title: "Book & eBook Marketing",
    description: "Marketing strategies to sell more books and ebooks.",
    modalImage: "https://t4.ftcdn.net/jpg/08/75/14/37/360_F_875143782_RXquLCNJw3egkfrPIvhPfijb26vqbksp.jpg", 
    path:"/services/digital/book-&-ebook-marketing",
    price: "$4,500 | Pre-Launch campaign"  ,
     section: "digital",
    area: "industry-purpose-specific"
  },
  "Self-Publish Your Book": {
    title: "Self-Publish Your Book",
    description: "Guidance and strategies for successful self-publishing.",
    modalImage: "https://www.adazing.com/wp-content/uploads/2018/10/book-cover_template.jpg",
    path:"/services/digital/self-publish-your-book",
    price: "$3,500 | Package coaching + distribution setup" ,
     section: "digital",
    area: "industry-purpose-specific"
  }
};

const musicServiceDetails = {
  "Voice Over": {
    title: "Voice Over",
   description: "Professional voice over services for your projects.",
   modalImage: "https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Afef12484-24df-4ae2-b257-b820c206b6ab?source=next-article&fit=scale-down&quality=highest&width=1440&dpr=1",
    path:"/services/music/voice-over",
    price: "$1,000 | 30-mins commercial narrative" ,
    section: "music",
    area: "voice-over-streaming"
  },
  "Podcast Production": {
    title: "Podcast Production",
   description: "Complete podcast production services from recording to publishing.",
    modalImage: "https://muddhousemedia.com/wp-content/uploads/2022/10/shutterstock_583624615-scaled.jpg",
    path:"/services/music/podcast-production",
    price: "$3,500 | Full 8-episode show production " ,
    section: "music",
    area: "voice-over-streaming"
  },
  "Audiobook Production": {
    title: "Audiobook Production",
    description: "High-quality audiobook production services.",
    modalImage: "https://images.ctfassets.net/f4cbid0mhigx/1Aq8RDW5EZbkbdVwwKmpQg/0ef91254515f8c390f6e759f41103782/adobestock_2980931252.jpeg",
     path:"/services/music/audiobook-production", 
    price: "$5,000 | 10-hr audiobook" ,
      section: "music",
    area: "voice-over-streaming"
  },
  "Audio Ads Production": {
    title: "Audio Ads Production",
    description: "Professional audio advertisement production.",
    modalImage: "https://cdn.prod.website-files.com/62798d875e56e532a1e20017/6594f89451c7c21c9b95964e_types-of-audio-advertising-1024x503.png",
    path:"/services/music/audio-ads-production",
    price: "$2,500 | 5 ads production package" ,
    section: "music",
    area: "voice-over-streaming"
  }
};

const programmingServiceDetails = {
  "Website Development": {
    title: "Website Development",
    description: "Custom website development tailored to your business needs.",
    modalImage: "https://www.imaginetventures.com/wp-content/uploads/2024/01/5467393_1687-scaled.jpg",
     path:"/services/programming/website-development",
    price: "$10,000 | 10-page custom website" ,
     section: "programming",
    area: "websites"
  },
  "Website Maintenance": {
    title: "Website Maintenance",
    description: "Ongoing maintenance and updates for your website.",
    modalImage: "https://wpactivethemes.com/wp-content/uploads/2024/01/Law-Website-Under-Maintenance-1024x538-1.jpg",
     path:"/services/programming/website-maintenance",
    price: "$3,000/year | Updates & hosting" ,
     section: "programming",
    area: "websites"
  },
  "WordPress": {
    title: "WordPress",
    description: "WordPress website design, development, and customization.",
    modalImage: "https://www.digitalsilk.com/wp-content/uploads/2024/05/Digital-Silk-Blog-hero-image-1200x675-V2-36.jpg",
     path:"/services/programming/wordpress",
    price: "$7,500 | WP site setup + themes /plugins " ,
     section: "programming",
    area: "websites"
  },
  "Custom Websites": {
    title: "Custom Websites",
    description: "Fully custom websites built from scratch to your specifications.",
    modalImage: "https://www.blackboxdesign.com.au/wp-content/uploads/2022/02/Custom-web-design-vs-template-web-design-scaled.jpg",
    path:"/services/programming/custom-websites",
    price: "$15,000 | Bespoke site with advanced features" ,
    section: "programming",
    area: "websites"
  },
    "Portfolio": {
    title: "Portfolio",
    description: "Professional portfolio websites designed to highlight your skills, projects, and achievements with a sleek, modern, and responsive layout. Perfect for developers, creatives, and businesses seeking a strong online presence.",
    modalImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    path: "/services/programming/portfolio",
    price: "$15,000 | Bespoke site with advanced features",
    section: "programming",
    area: "websites"
  },
  "Web Applications": {
    title: "Web Applications",
    description: "Interactive web applications for your business processes.",
    modalImage: "https://b1694534.smushcdn.com/1694534/wp-content/uploads/2021/12/NOHO.jpg?lossy=1&strip=1&webp=1",
   path:"/services/programming/web-applications",
    price: "$25,000 | Full-stack web app" ,
   section: "programming",
    area: "application-development"
  },
  "Desktop Applications": {
    title: "Desktop Applications",
    description: "Native desktop applications for Windows, Mac, or Linux.",
    modalImage: "https://img.freepik.com/free-vector/smart-home-management-laptop-screen-app_23-2148639320.jpg?semt=ais_hybrid&w=740",
    path:"/services/programming/desktop-applications",
    price: "$20,000 | Desktop software package" ,
    section: "programming",
    area: "application-development"
  },
  "Software Development": {
    title: "Software Development",
    description: "Custom software solutions for your specific needs.",
    modalImage: "https://www.slidegeeks.com/media/catalog/product/cache/1280x720/C/r/Crm_Software_Web_Development_Project_Plan_Guidelines_PDF_Slide_1_1.jpg",
    path:"/services/programming/software-development",
    price: "$30,000 | Custom software with backend" ,
    section: "programming",
    area: "software-development"
  },
  "Scripting": {
    title: "Scripting",
    description: "Automation scripts to streamline your workflows.",
    modalImage: "https://docs.flaxengine.com/manual/scripting/visual/media/vs-sample.png",
    path:"/services/programming/scripting",
    price: "$5,000 | Automation or script package " ,
    section: "programming",
    area: "software-development"
  },
  "Plugins Development": {
    title: "Plugins Development",
    description: "Custom plugins to extend functionality of existing software.",
    modalImage: "https://wpbuffs.com/wp-content/uploads/2020/03/AdobeStock_490335761-1024x576.jpeg",
    path:"/services/programming/plugins-development",
    price: "$7,000 | CMS/plugin development" ,
    section: "programming",
    area: "software-development"

  },
  "Mobile App Development": {
    title: "Mobile App Development",
    description: "Native mobile applications for iOS and Android platforms.",
    modalImage: "https://www.mindinventory.com/blog/wp-content/uploads/2023/12/mobile-app-development-trends.webp",
    path:"/services/programming/mobile-app-development",
    price: "$30,000 | Native iOS/Android app" ,
    section: "programming",
    area: "mobile-apps"
  },
  "Cross-platform Apps": {
    title: "Cross-platform Apps",
    description: "Apps that work across multiple platforms with a single codebase.",
    modalImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSWx3kq1uj3Di79hy63MUj3w-q1pMPHSxkTA&s",
    path:"/services/programming/cross-platform-apps",
    price: "$25,000 | React Native/Flutter app" ,
    section: "programming",
    area: "mobile-apps"
  },
  "Mobile App Maintenance": {
    title: "Mobile App Maintenance",
    description: "Ongoing maintenance and updates for your mobile applications.",
    modalImage: "https://orafox.com/wp-content/uploads/2024/05/app-maintenance.jpg",
    path:"/services/programming/mobile-app-maintenance",
    price: "$8,000/year | Updates + bug fixes " ,
    section: "programming",
    area: "mobile-apps"
  },
  "Support & IT": {
    title: "Support & IT",
    description: "Technical support and IT services for your business.",
    modalImage: "https://adventus.com/resources/ck/images/Blog/Whats-IT-Support.jpg",
    path:"/services/programming/support-&-it",
    price: "$10,000/year | Helpdesk + support" ,
    section: "programming",
    area: "it-support"
  },
  "Cloud Computing": {
    title: "Cloud Computing",
    description: "Cloud solutions and migration services.",
    modalImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz0w7MylN4m2JriAy_6Kl65xIM0yAgMzTeRQ&s",
    path:"/services/programming/cloud-computing",
    price: "$15,000 | Cloud migration + setup" ,
    section: "programming",
    area: "it-support"
  },
  "Convert Files": {
    title: "Convert Files",
    description: "File conversion services for various formats.",
    modalImage: "https://www.investintech.com/resources/blog/wp-content/uploads/2021/06/How-To-Convert-Any-File-To-Excel.jpg",
    path:"/services/programming/convert-files",
    price: "$2,000 | Bulk pconversion package" ,
    section: "programming",
    area: "it-support"
  }
};

const videoServiceDetails = {
  "Video Editing": {
    title: "Video Editing",
    description: "Professional video editing services to enhance your footage.",
    modalImage: "https://quickframe.com/wp-content/uploads/2023/12/QF-Blog_10-Tips-for-Video-Editing-Advanced-Tricks-You-Need-to-Master_1920x1080.jpg",
    path:"/services/video/video-editing",  
    price: "$5,000 | 5-minute highlight reel" ,
      sampleVideos: [
      {
        title: "Transition",
        videoFile: "/Videos/ved1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        title: "Color Grading", 
        videoFile: "/Videos/ved3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        title: "Speed Ramping", 
        videoFile: "/Videos/ved2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"editing-post-production"
  },
 "Visual Effects": {
    title: "Visual Effects",
    description: "Add stunning visual effects to make your videos stand out.",
    modalImage: "https://unity.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ffuvbjjlp%2Fproduction%2F6edeef38d40b4c3428dcc59ed2c38c0ef49e50e5-1020x516.jpg&w=3840&q=75",
    path:"/services/video/visual-effects",  
    price: "$12,000 | VFX heavy 5-minute piece" ,
      sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/vef1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/vef2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/vef3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"editing-post-production"
  },
  "Video Art": {
    title: "Video Art",
    description: "Creative video art and experimental film techniques.",
    modalImage: "https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FBOqYXj9vufwvGsU81wfvvw%2Fnormalized.jpg&width=910",
    path:"/services/editing-post-production",  
    price: "$8,000 | Creative video art project" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/va1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/vad2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/vad3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"editing-post-production"
  },
  "Intro & Outro Videos": {
    title: "Intro & Outro Videos",
    description: "Custom intro and outro videos for your content.",
    modalImage: "https://www.cryan.com/daily/2024/FlexClipIntroOutro.jpeg",
    path:"/services/video/intro-&-outro-videos",
    price: "$2,500 | 5 branded intros/outros" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/inv1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/inv2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/inv3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"editing-post-production"
  },
  "Video Templates Editing": {
    title: "Video Templates Editing",
    description: "Customize video templates for your brand.",
    modalImage: "https://resource.flexclip.com/pages/learn-center/video-editor-with-template/video-editor-with-template-for-mobile-lumafusion.webp",
     path:"/services/video/video-templates-editing",
    price: "$3,000 | Template customization" ,
       sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/vedtemp1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/vedtemp2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/vedtemp3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"editing-post-production"
  },
  "Subtitles & Captions": {
    title: "Subtitles & Captions",
    description: "Add professional subtitles and captions to your videos.",
    modalImage: "https://cdn.prod.website-files.com/65e5ae1fb7482afd48d22155/6706e23ef5575ce4a0bd1483_6706e23c77efeab972a08431_captions-vs-subtitles-whats-the-difference-1024x576.png",
    path:"/services/video/subtitles-&-captions",
    price: "$1,500 | 10-video captioning package" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/capsub1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/capsub2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/capsub3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"editing-post-production"
  },
  "Video Arts & Commercials": {
    title: "Video Arts & Commercials",
    description: "Creative video ads and commercials for your business.",
    modalImage: "https://www.thedvigroup.com/wp-content/uploads/2023/02/Person-Watching-the-Best-Video-Ads-Examples-on-a-Smartphone-172190875_l-1-2048x1118.jpg",
    path:"/services/video/video-arts-&-commercials",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/vidartcom1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/vidartcom2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/vidartcom3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"social-marketing-videos"
  },
  "Social Media Videos": {
    title: "Social Media Videos",
    description: "Engaging videos optimized for social media platforms.",
    modalImage: "https://vidico.com/app/uploads/2022/08/Screenshot-2022-08-22-at-17.22.11.png",
    path:"/services/video/social-media-videos",
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/socmed1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/socmed2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        title: "Editing Sample 3", 
        videoFile: "/Videos/socmed3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"social-marketing-videos"
  },
  "Music Videos": {
    title: "Music Videos",
    description: "Professional music video production services.",
    modalImage: "https://v13.net/wp-content/uploads/quarantine_music_video_feature.png",
     path:"/services/video/music-videos",
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/mvid1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/mvid2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/mvid3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"social-marketing-videos"
  },
  "Slideshow Videos": {
    title: "Slideshow Videos",
    description: "Create engaging slideshow videos from your photos.",
    modalImage: "https://placeit-assets0.s3-accelerate.amazonaws.com/custom-pages/slideshow-maker/slideshow_videomaker.png",
      path:"/services/video/slideshow-videos",
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/slide1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/slide2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/slide3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"social-marketing-videos"
  },
  "Animated Explainers": {
    title: "Animated Explainers",
    description: "Animated videos that explain your product or service.",
    modalImage: "https://animationexplainers.com/wp-content/uploads/2021/08/Animation-Explainers-Hero-Video-2.png",
    path:"/services/video/animated-explainers", 
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/anex1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/anex2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/anex3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"explainer-videos"
  },
  "Live Action Explainers": {
    title: "Live Action Explainers",
    description: "Live action videos that explain complex concepts simply.",
    modalImage: "https://fiverr-res.cloudinary.com/videos/so_29.49223,t_main1,q_auto,f_auto/wrwhmmot4gynuiwtojaw/make-tv-style-commercial-or-promo.png",
    path:"/services/video/live-action-explainers",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/livex1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/livex2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/livex3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"explainer-videos"
  },
  "Screencasting Videos": {
    title: "Screencasting Videos",
    description: "Professional screen recordings with narration.",
    modalImage: "https://www.qualitymatters.org/sites/default/files/article-faq-images/screencasting-750px.png",
    path:"/services/video/screencasting-videos",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/screen1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/screen2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/screen3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"explainer-videos"
  },
  "Character Animation": {
    title: "Character Animation",
    description: "Bring characters to life with professional animation.",
    modalImage: "https://darvideo.tv/wp-content/uploads/Character-Animation.jpg",
    path:"/services/video/character-animation",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/chanime1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/chanime2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/chanime3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"animation"
  },
  "Animated GIFs": {
    title: "Animated GIFs",
    description: "Create engaging animated GIFs for your content.",
    modalImage: "https://img.freepik.com/free-vector/hand-drawn-animation-frames-element-collection_23-2149845056.jpg?semt=ais_hybrid&w=740",
    path:"/services/video/animated-gifs",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/AniG1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/AniG2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/AniG3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"animation"
  },
  "Animation for Kids": {
    title: "Animation for Kids",
    description: "Fun and engaging animations for children's content.",
    modalImage: "https://media.istockphoto.com/id/1406654109/vector/happy-multicultural-children-hold-a-blank-poster-template-for-advertising-brochure-cute.jpg?s=170667a&w=0&k=20&c=5AREDRg0OTAraCqUPigtbkBGFwsKULeL5yK1L6_kMmU=",
    path:"/services/video/animation-for-kids",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/AniK1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/AniK2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/AniK3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"animation"
  },
  "Animation for Streamers": {
    title: "Animation for Streamers",
    description: "Custom animations for live streamers and content creators.",
    modalImage: "https://www.enzeefx.com/wp-content/uploads/2023/02/1080p.00_00_45_09.Still261.jpg",
    path:"/services/video/animation-for-streamers",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/AniS1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/AniS2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/AniS3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"animation"
  },
  "2D, 3D, 4D & 6D Product Animation": {
    title: "2D, 3D, 4D & 6D Product Animation",
    description: "Showcase your products with stunning dimensional animations.",
    modalImage: "https://cdn.motiondesign.school/uploads/2021/06/Full_HD_Cover_2d_to_3d.png",
    path:"/services/video/2d,-3d,-4d-&-6d-product-animation",  
    price: "$500.00" ,
        sampleVideos: [
      {
        title: "2D Animation",
        videoFile: "/Videos/2D.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        title: "3D Animation", 
        videoFile: "/Videos/3D.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        title: "Product Animation", 
        videoFile: "/Videos/product-animation.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"product-videos"
  },
  "E-Commerce Product Videos": {
    title: "E-Commerce Product Videos",
    description: "Professional videos to showcase your e-commerce products.",
    modalImage: "https://www.contentbeta.com/wp-content/uploads/2024/05/Best-eCommerce-Product-Videos-Examples.webp",
    path:"/services/video/e-commerce-product-videos",  
    price: "$500.00" ,
        sampleVideos: [
      {
        title: "Drinks",
        videoFile: "/Videos/Ecommerce1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        title: "Bags", 
        videoFile: "/Videos/Ecommerce2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        title: "Clothes", 
        videoFile: "/Videos/Ecommerce3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"product-videos"
  },
  "Corporate Videos": {
    title: "Corporate Videos",
    description: "Professional videos for corporate communications.",
    modalImage: "https://d9pfvpeevxz0y.cloudfront.net/blog/wp-content/uploads/2023/05/Blog_050823-1200x675.jpg",
    path:"/services/video/corporate-videos",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/corporate1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/corporate2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/corporate3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"product-videos"
  },
  "Logo Animation": {
    title: "Logo Animation",
    description: "Animate your logo for brand recognition.",
    modalImage: "https://cdn.shopify.com/s/files/1/1095/6418/articles/Types_of_Logo_Animations.webp?v=1667298813",
    path:"/services/video/logo-animation",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/logo1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/logo2.0.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/logo3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"motion-graphics"
  },
  "Lottie & Web Animation": {
    title: "Lottie & Web Animation",
    description: "Lightweight animations for websites and apps.",
    modalImage: "https://orpetron.com/wp-content/uploads/2023/05/Creative-Dreams-1-.png",
    path:"/services/video/lottie-&-web-animation",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/lottie1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/lottie2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/lottie3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"motion-graphics"
  },
  "Text Animation": {
    title: "Text Animation",
    description: "Dynamic text animations for your videos.",
    modalImage: "https://www.animaker.com/static_2.0/img/textanimationmaker/text_animation_ogimage.png",
    path:"/services/video/text-animation",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/text1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/text2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/text3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"motion-graphics"
  },
  "Filmed Video Production": {
    title: "Filmed Video Production",
    description: "Professional video production services.",
    modalImage: "https://www.uscreen.tv/wp-content/uploads/2018/11/Ultimate-video-production-equipment.jpg",
    path:"/services/video/filmed-video-production",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/film1pre-production.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/film2production.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/film3post-production.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"filmed-video-production"
  },
  "Videography": {
    title: "Videography",
    description: "Professional videography services for events and productions.",
    modalImage: "https://www.nyu.edu/content/nyu/en/life/arts-culture-and-entertainment/nyu-tv/video-production-services/jcr:content/1/par-left/nyuimage.img.320.medium.jpg/1628785323568.jpg",
    path:"/services/video/videography",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/videograp1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/videograp2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/videograp3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"filmed-video-production"
  },
  "Article to Video": {
    title: "Article to Video",
    description: "Convert your articles into engaging video content.",
    modalImage: "https://sendshort.ai/wp-content/uploads/2024/12/Turning-an-article-into-a-video.jpg",
    path:"/services/video/article-to-video",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/article1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/article2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/article3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"miscellaneous-video"
  },
  "Book Trailers": {
    title: "Book Trailers",
    description: "Create captivating trailers for your books.",
    modalImage: "https://lightmv.com/wp-content/uploads/2019/05/create-book-trailer-20190508.jpg",
    path:"/services/video/book-trailers",  
    price: "$500.00" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/book1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/book2.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      },
      {
        // title: "Editing Sample 3", 
        videoFile: "/Videos/book3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"miscellaneous-video"
  }
};

const writingServiceDetails = {
  "Articles & Blog Posts": {
    title: "Articles & Blog Posts",
    description: "Professional writing services for articles and blog posts on any topic.",
    modalImage: "https://brands-up.ch/public/images/uploads/97bc703442fa9a38ed92e3047355fb18486c1219.png",
    path:"/services/writing/articles-&-blog-posts",  
    price: "$500.00" ,
      section: "writing",area:"content-writing"
  },
 "Content Strategy": {
    title: "Content Strategy",
    description: "Develop a comprehensive content strategy for your brand or business.",
    modalImage: "https://www.salesforce.com/ca/blog/wp-content/uploads/sites/12/2023/10/content-strategy-open-graph.jpg",
    path:"/services/writing/content-strategy",  
    price: "$500.00" ,
      section: "writing",area:"content-writing"
  },
  "Website Content": {
    title: "Website Content",
    description: "Engaging and SEO-optimized content for your website.",
    modalImage: "https://contentcloudhq.com/wp-content/uploads/2020/01/website-content.jpg",
    path:"/services/writing/website-content",  
    price: "$500.00" ,
      section: "writing",area:"content-writing"
  },
  "Scriptwriting": {
    title: "Scriptwriting",
    description: "Professional scriptwriting for videos, films, and presentations.",
    modalImage: "https://avconsultants.com/wp-content/uploads/2021/12/scriptwriting-scaled.jpg",
    path:"/services/writing/scriptwriting",  
    price: "$500.00" ,
      section: "writing",area:"content-writing"
  },
  "Creative Writing": {
    title: "Creative Writing",
    description: "Original creative writing including short stories and poetry.",
    modalImage: "https://www.bolton.ac.uk/assets/Uploads/Picture1-v39.png",
    path:"/services/writing/creative-writing",  
    price: "$500.00" ,
      section: "writing",area:"content-writing"
  },
  "Podcast Writing": {
    title: "Podcast Writing",
    description: "Scripts and content writing for your podcast episodes.",
    modalImage: "https://images.prismic.io/buzzsprout/d513dfac-dd09-44df-8d99-5996ab989db6_show-notes.png?auto=compress,format",
    path:"/services/writing/podcast-writing",  
    price: "$500.00" ,
      section: "writing",area:"content-writing"
  },
  "Speechwriting": {
    title: "Speechwriting",
    description: "Persuasive and impactful speeches for any occasion.",
    modalImage: "https://www.prdaily.com/wp-content/uploads/2024/01/iStock-1348871022.jpg",
    path:"/services/writing/speechwriting",  
    price: "$500.00" ,
      section: "writing",area:"content-writing"
  },
  "Research & Summaries": {
    title: "Research & Summaries",
    description: "Thorough research and concise summaries on any topic.",
    modalImage: "https://www.loop11.com/wp-content/uploads/2023/06/How-to-undertake-effective-user-testing-in-multiple-languages-Loop11.webp",
    path:"/services/writing/research-&-summaries",  
    price: "$500.00" ,
      section: "writing",area:"content-writing"
  },
  "Blurb": {
    title: "Blurb",
    description: "Expertly crafted book blurbs designed to spark curiosity, captivate readers, and drive sales.",
    modalImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
    path: "/services/writing/blurb-writing",
    price: "$500.00",
    section: "writing",
    area: "content-writing"
  },
  "Proofreading & Editing": {
    title: "Proofreading & Editing",
    description: "Professional proofreading and editing services for any document.",
    modalImage: "https://harvardproofreader.co.za/wp-content/uploads/2023/11/istockphoto-184928153-612x612-1.jpg",
    path:"/services/writing/proofreading-&-editing",  
    price: "$500.00" ,
      section: "writing",area:"editing-critique"
  },
  "Writing Advice": {
    title: "Writing Advice",
    description: "Expert advice and guidance to improve your writing skills.",
    modalImage: "https://www.writerswrite.co.za/wp-content/uploads/2020/07/Write-The-Crap-Out-Of-It-And-Other-Short-Story-Writing-Advice.jpg",
    path:"/services/writing/writing-advice",  
    price: "$500.00" ,
      section: "writing",area:"editing-critique"
  },
  "Book & eBook Writing": {
    title: "Book & eBook Writing",
    description: "Professional writing services for books and eBooks.",
    modalImage: "https://miro.medium.com/v2/resize:fit:1060/1*svt__Xdw48VfUiBPDxO0yg.jpeg",
    path:"/services/writing/book-&-ebook-writing",  
    price: "$500.00" ,
      section: "writing",area:"book-ebook-publishing"
  },
  "Book Editing": {
    title: "Book Editing",
    description: "Comprehensive editing services for your book manuscript.",
    modalImage: "https://resources.reed.co.uk/courses/careerguides/how-to-become-a-book-editor-career-advice.webp",
    path:"/services/writing/book-editing",  
    price: "$500.00" ,
      section: "writing",area:"book-ebook-publishing"
  },
  "RePublication": {
  title: "RePublication",
  description: "Expert editing and formatting services to prepare your book manuscript for re-release or new editions.",
  modalImage: "https://media.istockphoto.com/id/909157366/photo/education.jpg?s=612x612&w=0&k=20&c=M4t3nhBI3XfZxT5-KeDLIkLUUhuYu96nVfVr0MIVitw=",
  path: "/services/writing/republication",
  price: "$999.00",
  section: "writing",
  area: "book-ebook-publishing"
}
,
  "Translation": {
    title: "Translation",
    description: "Professional translation services in multiple languages.",
    modalImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-wS1I7lm1z87VYqiQhliE8bk-Qk1K3Ac5_w&s",
    path:"/services/writing/translation",  
    price: "$500.00" ,
      section: "writing",area:"translation-transcription"
  },
  "Transcription": {
    title: "Transcription",
    description: "Accurate transcription services for audio and video files.",
    modalImage: "https://www.verbolabs.com/wp-content/uploads/2021/08/HOW-TRANSCRIPTION-SERVICES-HELP-TO-EMPOWER-INSURANCE-AGENTS.jpg",
    path:"/services/writing/transcription",  
    price: "$500.00" ,
      section: "writing",area:"translation-transcription"
  },
  "Brand Voice & Tone": {
    title: "Brand Voice & Tone",
    description: "Develop a consistent brand voice and tone for your business.",
    modalImage: "https://api.backlinko.com/app/uploads/2024/04/brand-tone-of-voice-blog-post-image.png",
    path:"/services/writing/brand-voice-&-tone",  
    price: "$500.00" ,
      section: "writing",area:"business-marketing-copy"
  },
  "Business Names & Slogans": {
    title: "Business Names & Slogans",
    description: "Creative business names and catchy slogans for your brand.",
    modalImage: "https://graphicdesigneye.com/assets/uploads/blogs/2025/Jul/05072025_68695e8c73405.jpg",
    path:"/services/writing/business-names-&-slogans",  
    price: "$500.00" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Product Descriptions": {
    title: "Product Descriptions",
    description: "Compelling product descriptions that drive sales.",
    modalImage: "https://static.wixstatic.com/media/a77aa0_26c5be51e35641138df91c1e03cc0a3c~mv2.jpg/v1/fill/w_1000,h_571,al_c,q_85,usm_0.66_1.00_0.01/a77aa0_26c5be51e35641138df91c1e03cc0a3c~mv2.jpg",
    path:"/services/writing/product-descriptions",  
    price: "$500.00" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Ad Copy": {
    title: "Ad Copy",
    description: "Persuasive ad copy that converts viewers into customers.",
    modalImage: "https://www.wordstream.com/wp-content/uploads/2021/12/instagram-ad-copy-examples-creative-sweet.png",
    path:"/services/writing/ad-copy",  
    price: "$500.00" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Sales Copy": {
    title: "Sales Copy",
    description: "High-converting sales copy for your products or services.",
    modalImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGz8YMmgDeqQp74llRwXXkhLYUlKZQOLBUXQ&s",
    path:"/services/writing/sales-copy",  
    price: "$500.00" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Email Copy": {
    title: "Email Copy",
    description: "Engaging email copy that gets opened and read.",
    modalImage: "https://www.sender.net/wp-content/uploads/2022/02/Email-Campaigns-smaller.png",
    path:"/services/writing/email-copy",  
    price: "$500.00" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Social Media Copywriting": {
    title: "Social Media Copywriting",
    description: "Captivating copy for your social media posts and campaigns.",
    modalImage: "https://cdn.prod.website-files.com/637b64a58832c57934e9f106/63f3529585872a9e99a74cbf_How-to-Copywrite-Excelling-in-Social-Copywriting-on-Every-Platform-1024x576.png",
    path:"/services/writing/social-media-copywriting",  
    price: "$500.00" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Press Releases": {
    title: "Press Releases",
    description: "Professional press releases to announce your news.",
    modalImage: "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2022/06/Press-Release.jpg",
    path:"/services/writing/press-releases",  
    price: "$500.00" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Resume Writing": {
    title: "Resume Writing",
    description: "Professional resume writing services to land your dream job.",
    modalImage: "https://blog.iawomen.com/wp-content/uploads/2018/09/resume-writing-women.jpg",
    path:"/services/writing/resume-writing",  
    price: "$500.00" ,
      section: "writing",area:"career-writing"
  },
  "Cover Letters": {
    title: "Cover Letters",
    description: "Custom cover letters tailored to each job application.",
    modalImage: "https://www.myperfectresume.com/wp-content/uploads/2022/03/how-to-write-a-cover-letter-hero.png",
    path:"/services/writing/cover-letters",  
    price: "$500.00" ,
       section: "writing",area:"career-writing"
  },
  "LinkedIn Profiles": {
    title: "LinkedIn Profiles",
    description: "Optimized LinkedIn profiles that attract recruiters.",
    modalImage: "https://helpx-prod.scene7.com/is/image/HelpxProd/linkedin-profile-picture-intro_900x506?$pjpeg$&jpegSize=200&wid=900",
    path:"/services/writing/linkedin-profiles",  
    price: "$500.00" ,
       section: "writing",area:"career-writing"
  },
  "Job Descriptions": {
    title: "Job Descriptions",
    description: "Clear and compelling job descriptions for your open positions.",
    modalImage: "https://cdn.prod.website-files.com/5e6aa7798a5728055c457ebb/64e3af7042a04e5d49967c7f_20230821T0632-d10cbc49-66f8-4631-ab87-412b25d85da4.jpeg",
    path:"/services/writing/job-descriptions",  
    price: "$500.00" ,
       section: "writing",area:"career-writing"
  },
  "Technical Writing": {
    title: "Technical Writing",
    description: "Clear and concise technical documentation and manuals.",
    modalImage: "https://www.scilife.io/hs-fs/hubfs/Featured-image_Technical-writing.jpg?width=1200&height=675&name=Featured-image_Technical-writing.jpg",
    path:"/services/writing/technical-writing",  
    price: "$500.00" ,
       section: "writing",area:"miscellaneous-writing"
  },
  
};


export default function ServicesPage() {
  // const [expandedService, setExpandedService] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [activeSection, setActiveSection] = useState('allservices');
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = {
    allservices: useRef(null),
    graphics: useRef(null),
    business: useRef(null),
    digital: useRef(null),
    music: useRef(null),
    programming: useRef(null),
    video: useRef(null),
    writing: useRef(null),
  };


const [searchQuery, setSearchQuery] = useState('');
const [filteredServices, setFilteredServices] = useState([]);
const [showResults, setShowResults] = useState(false);

// Update the search effect
useEffect(() => {
  if (searchQuery.trim() === '') {
    setFilteredServices([]);
    setShowResults(false);
    return;
  }

  const query = searchQuery.toLowerCase().trim();
  
  const results = allServiceDetails.filter(service => 
    service.title.toLowerCase().includes(query) || 
    service.description.toLowerCase().includes(query) ||
    service.category.toLowerCase().includes(query)
  );

  setFilteredServices(results); // Show all results now
  setShowResults(true);
}, [searchQuery]);

// Add this to handle clicks outside the search
useEffect(() => {
  const handleClickOutside = (event) => {
    if (event.target.closest('.search-container') === null) {
      setShowResults(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);



  // Add this useEffect to detect mobile devices
useEffect(() => {
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
  };
  
  // Initial check
  checkIfMobile();
  
  // Add event listener for window resize
  window.addEventListener('resize', checkIfMobile);
  
  // Cleanup
  return () => window.removeEventListener('resize', checkIfMobile);
}, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return; // Skip if we're programmatically scrolling
      
      const scrollPosition = window.scrollY + 100;

      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId); // Update active section immediately
    setIsScrolling(true); // Disable scroll listener
    
    sectionRefs[sectionId].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Re-enable scroll listener after scrolling completes
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };
    
const location = useLocation();
// Scroll to section when page loads with hash
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1); // Remove #
      const element = document.getElementById(sectionId);
      
      if (element) {
        // Small delay to ensure page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);


// Replace the renderServiceItem function with this new version:
const renderServiceItem = (serviceName, section) => {
  const serviceData = 
    section === 'allservices' ? allServiceDetails :
    section === 'graphics' ? graphicsServiceDetails :
    section === 'business' ? businessServiceDetails :
    section === 'digital' ? digitalServiceDetails :
    section === 'music' ? musicServiceDetails :
    section === 'programming' ? programmingServiceDetails :
    section === 'video' ? videoServiceDetails :
    writingServiceDetails;
  
// Create the slug first to use PARAMS
  const slug = serviceName.toLowerCase().replace(/\s+/g, '-');



  return (
    <li style={pageStyles.serviceItem} key={serviceName}>
      <Link 
    to={`/services/${section}/${slug}`}
    style={{
      textDecoration: 'none',
      color: 'inherit',
      display: 'block'
    }}
  >
      <img 
        src={serviceData[serviceName]?.modalImage} 
        alt={serviceName}
        style={{ 
          width: '100%',
          // height: '150px',
          height: isMobile ? '100px' : '150px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '10px'
        }}
      />
      <h4 style={{ margin: '0 0 5px 0', color: tealTheme.primary, fontSize: isMobile ? 'clamp(14px, 3vw, 16px)' : 'clamp(16px, 1.2vw, 18px)' }}>
        {serviceData[serviceName]?.title || serviceName}
      </h4>
      <p style={{ margin: '0 0 10px 0', fontSize: isMobile ? 'clamp(12px, 2.8vw, 14px)' : '14px'}}>
        {serviceData[serviceName]?.description}
      </p>
      <div style={{
        ...pageStyles.learnMoreLink,
        fontSize: isMobile ? 'clamp(12px, 2.8vw, 14px)' : '12px',
        display: 'inline-block'
      }}>
      Read More →
    </div>
      </Link>
    </li>
  );
};

  return (
    <div style={{ display: 'flex' }}>
    {/* Mobile Sidebar Button */}
    {isMobile && (
      <button 
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        style={mobileSidebarStyles.button}
      >
        ☰ Services
      </button>
    )}

    {/* Mobile Sidebar Overlay */}
    {isMobile && isMobileSidebarOpen && (
      <div 
        style={mobileSidebarStyles.overlay}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
    )}

    {/* Mobile Sidebar */}
    {isMobile && (
      <div 
        style={{
          ...mobileSidebarStyles.sidebar,
          ...(isMobileSidebarOpen ? mobileSidebarStyles.sidebarOpen : {})
        }}
      >
        {/* <h4 style={sidebarStyles.title}>All Services</h4> */}
        <a 
          href="#allservices" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'allservices' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('allservices');
            setIsMobileSidebarOpen(false);
          }}
        >
          All Services
        </a>
        <a 
          href="#graphics" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'graphics' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('graphics');
            setIsMobileSidebarOpen(false);
          }}
        >
          Graphics & Design
        </a>
        {/* Repeat for all other sidebar links, adding setIsMobileSidebarOpen(false) */}
        <a 
          href="#business" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'business' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('business');
            setIsMobileSidebarOpen(false);
          }}
        >
          Business Services
        </a>
        <a 
          href="#digital" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'digital' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('digital');
            setIsMobileSidebarOpen(false);
          }}
        >
          Digital Marketing
        </a>
        <a 
          href="#music" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'music' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('music');
            setIsMobileSidebarOpen(false);
          }}
        >
          Music & Audio
        </a>
        <a 
          href="#programming" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'programming' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('programming');
            setIsMobileSidebarOpen(false);
          }}
        >
          Programming & Tech
        </a>
        <a 
          href="#video" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'video' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('video');
            setIsMobileSidebarOpen(false);
          }}
        >
          Video & Animation
        </a>
        <a 
          href="#writing" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'writing' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('writing');
            setIsMobileSidebarOpen(false);
          }}
        >
          Writing & Translation
        </a>

        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            ...sidebarStyles.link,
            ...mobileSidebarStyles.closebutton
          }}
        >
          ✕ Close
        </button>
      </div>
    )}
    {/* Original Desktop Sidebar - now conditionally rendered */}
      {/* Sidebar Navigation */}
      {!isMobile && activeSection !== 'allservices' && (
      <div style={sidebarStyles.container}>
        {/* <h4 style={sidebarStyles.title}>All Services</h4> */}
        <a 
          href="#allservices" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'allservices' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('allservices');
          }}
        >
          All Services
        </a>
       <a 
          href="#graphics" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'graphics' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('graphics');
          }}
        >
          Graphics & Design
        </a>
        <a 
          href="#business" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'business' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('business');
          }}
        >
          Business Services
        </a>
        <a 
          href="#digital" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'digital' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('digital');
          }}
        >
          Digital Marketing
        </a>
        <a 
          href="#music" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'music' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('music');
          }}
        >
          Music & Audio
        </a>
        <a 
          href="#programming" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'programming' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('programming');
          }}
        >
          Programming & Tech
        </a>
        <a 
          href="#video" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'video' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('video');
          }}
        >
          Video & Animation
        </a>
        <a 
          href="#writing" 
          style={{
            ...sidebarStyles.link,
            ...(activeSection === 'writing' ? sidebarStyles.activeLink : {})
          }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('writing');
          }}
        >
          Writing & Translation
        </a>
      </div>
)}

      {/* Main Content */}
      <div className="services-page" style={{ ...pageStyles.container, marginLeft: isMobile || activeSection === 'allservices' ? '0' : '240px',
      paddingTop: isMobile ? '80px' : '0', width: isMobile ? '100vw' : '100%', maxWidth: activeSection === 'allservices' ? '100%' : 'clamp(100%, 90vw, 2400px)'}}>

{/* All Services Section */}
<section className="service-section"
  id="allservices" 
  ref={sectionRefs.allservices}
  style={{ 
    padding: 'clamp(2rem, 5vw, 3rem) 1rem',
    // backgroundColor: 'white',
    marginBottom: 'clamp(1.5rem, 3vw, 3rem)',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: 'url(/images/cube.gif)',
  }}
>
  <div style={{
    maxWidth: 'clamp(320px, 90vw, 1200px)',
    margin: '0 auto',
    textAlign: 'center',
    padding: 'clamp(3rem, 6vw, 6rem) 1rem',
  }}>
    <h2 style={{
      fontSize: 'clamp(1.3rem, 4vw, 2.5rem)',
      fontWeight: '700',
      color: 'white',
      marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
      lineHeight: '1.3'
    }}>
      What are you looking for?
    </h2>
    
    <div className="search-container" style={{
      position: 'relative',
      maxWidth: 'clamp(300px, 80vw, 800px)',
      margin: '0 auto',
    }}>
      <div style={{
        position: 'relative',
        width: '100%'
      }}>
        <input
          type="text"
          placeholder="Search all services..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim() !== '') {
              setShowResults(true);
            }
          }}
          onFocus={() => {
            if (searchQuery.trim() !== '') {
              setShowResults(true);
            }
          }}
          style={{
            width: '100%',
            padding: 'clamp(0.9rem, 2.5vw, 1.5rem) clamp(1.5rem, 4vw, 2.5rem)',
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            borderRadius: '50px',
            border: '1px solid #ddd',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            outline: 'none',
            transition: 'all 0.3s ease',
            ':focus': {
              borderColor: '#4285f4',
              boxShadow: '0 4px 20px rgba(66, 133, 244, 0.2)'
            }
          }}
        />
        <button 
          aria-label="Search"
          style={{
            position: 'absolute',
            right: 'clamp(1rem, 3vw, 1.5rem)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: '#666',
            padding: '0.5rem'
          }}
        >
          🔍
        </button>
      </div>

      {/* Dropdown Results with Scrollbar - Optimized with clamp() */}
      {showResults && filteredServices.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          maxHeight: 'min(400px, 60vh)',
          overflowY: 'auto',
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          marginTop: '4px',
          border: '1px solid #ddd',
          borderTop: 'none',
          scrollbarWidth: 'thin',
          scrollbarColor: `${tealTheme.teal300} #f1f1f1`,
          '::-webkit-scrollbar': {
            width: '8px'
          },
          '::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '0 0 8px 0'
          },
          '::-webkit-scrollbar-thumb': {
            background: tealTheme.teal300,
            borderRadius: '4px',
            ':hover': {
              background: tealTheme.teal400
            }
          }
        }}>
          {filteredServices.map(service => (
            <Link 
              key={service.id}
              to={service.path}
              style={{
                display: 'block',
                padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
                textDecoration: 'none',
                color: '#333',
                borderBottom: '1px solid #eee',
                transition: 'background-color 0.2s',
                ':hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
              onClick={() => {
                setShowResults(false);
                setSearchQuery('');
              }}
            >
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.25rem, 1vw, 0.5rem)'
              }}>
                <div style={{ 
                  fontWeight: '600',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  lineHeight: '1.3',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word'
                }}>
                  {service.title}
                </div>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 'clamp(0.5rem, 2vw, 1rem)',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ 
                    fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                    color: '#666',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    flex: '1 1 70%',
                    minWidth: 'min(200px, 60%)',
                    lineHeight: '1.4'
                  }}>
                    {service.description}
                  </div>
                  <div style={{ 
                    fontSize: 'clamp(0.625rem, 1.6vw, 0.75rem)',
                    backgroundColor: tealTheme.teal100,
                    color: tealTheme.teal800,
                    padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 1.5vw, 0.75rem)',
                    borderRadius: '4px',
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                    marginTop: '0.125rem'
                  }}>
                    {service.category}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {showResults && searchQuery.trim() !== '' && filteredServices.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: 'clamp(1rem, 2vw, 1.5rem)',
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          marginTop: '4px',
          border: '1px solid #ddd',
          borderTop: 'none',
          color: '#666',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
        }}>
          No services found matching "{searchQuery}"
        </div>
      )}
    </div>
  </div>
</section>

        {/* Graphics & Design Section (Teal) */}
        <section  className="service-section"
          style={{ ...pageStyles.section, ...sectionBackgroundStyles.teal }} 
          ref={sectionRefs.graphics} 
          id="graphics"
        >
          <div style={pageStyles.graphicsHeader}>
            <div style={pageStyles.headerOverlay}></div>
            <div style={pageStyles.titleContainer}>
              <h2 style={pageStyles.mainTitle}>Graphics & Design</h2>
              <p style={pageStyles.subTitle}>Designs that define your brand.</p>
            </div>
          </div>

          <div style={pageStyles.categoriesGrid}>
            {/* Product & Gaming */}
            <div style={pageStyles.categoryGroup} id='product-gaming' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Product & Gaming</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Industrial & Product Design", "graphics")}
                {renderServiceItem("Graphics for Streamers", "graphics")}
                {renderServiceItem("Trade Booth Design", "graphics")}
              </ul>
            </div>

            {/* Visual Design */}
            <div style={pageStyles.categoryGroup} id='visual-design' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Visual Design</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Image Editing", "graphics")}
                {renderServiceItem("Presentation Design", "graphics")}
                {renderServiceItem("Infographic Design", "graphics")}
                {renderServiceItem("Resume Design", "graphics")}
              </ul>
            </div>

            {/* Print Design */}
            <div style={pageStyles.categoryGroup} id='print-design' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Print Design</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Flyer Design", "graphics")}
                {renderServiceItem("Brochure Design", "graphics")}
                {renderServiceItem("Poster Design", "graphics")}
                {renderServiceItem("Menu Design", "graphics")}
                {renderServiceItem("Invitation Design", "graphics")}
              </ul>
            </div>

            {/* Packaging & Covers */}
            <div style={pageStyles.categoryGroup} id='packaging-covers' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Packaging & Covers</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Packaging & Label Design", "graphics")}
                {renderServiceItem("Book Design", "graphics")}
                {renderServiceItem("Book Covers", "graphics")}
                {renderServiceItem("Album Cover Design", "graphics")}
              </ul>
            </div>

            {/* Marketing Design */}
            <div style={pageStyles.categoryGroup} id='marketing-design' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Marketing Design</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Social Media Design", "graphics")}
                {renderServiceItem("Thumbnails Design", "graphics")}
                {renderServiceItem("Email Design", "graphics")}
                {renderServiceItem("Web Banners", "graphics")}
                {renderServiceItem("Signage Design", "graphics")}
              </ul>
            </div>
          </div>
        </section>

        {/* Business Services Section (White) */}
        <section className="service-section"
          style={{ ...pageStyles.section, ...sectionBackgroundStyles.white }} 
          ref={sectionRefs.business} 
          id="business"
        >
          <div style={pageStyles.businessHeader}>
            <div style={pageStyles.headerOverlay}></div>
            <div style={pageStyles.titleContainer}>
              <h2 style={pageStyles.mainTitle}>Business Services</h2>
              <p style={pageStyles.subTitle}>Where your business evolves.</p>
            </div>
          </div>

          <div style={pageStyles.categoriesGrid}>
            {/* Formation & Consulting */}
            <div style={pageStyles.categoryGroup} id='formation-consulting' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Formation & Consulting</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Market Research", "business")}
                {renderServiceItem("Business Plans", "business")}
                {renderServiceItem("Business Consulting", "business")}
                {renderServiceItem("HR Consulting", "business")}
              </ul>
            </div>

            {/* Operations & Management */}
            <div style={pageStyles.categoryGroup} id='operations-management' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Operations & Management</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Project Management", "business")}
                {renderServiceItem("Product Management", "business")}
              </ul>
            </div>

            {/* Sales & Customer Care */}
            <div style={pageStyles.categoryGroup} id='sales-customer-care' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Sales & Customer Care</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Sales", "business")}
                {renderServiceItem("Customer Experience Management (CXM)", "business")}
                {renderServiceItem("Lead Generation", "business")}
                {renderServiceItem("Call Center & Calling", "business")}
                {renderServiceItem("Customer Care", "business")}
                {renderServiceItem("Copyright Registration", "business")}
              </ul>
            </div>
          </div>
        </section>

        {/* Digital Marketing Section (Teal) */}
        <section className="service-section"
          style={{ ...pageStyles.section, ...sectionBackgroundStyles.teal }} 
          ref={sectionRefs.digital} 
          id="digital"
        >
          <div style={pageStyles.digitalHeader}>
            <div style={pageStyles.headerOverlay}></div>
            <div style={pageStyles.titleContainer}>
              <h2 style={pageStyles.mainTitle}>Digital Marketing</h2>
              <p style={pageStyles.subTitle}>Define your brand. Dominate your market.</p>
            </div>
          </div>

          <div style={pageStyles.categoriesGrid}>
            {/* Methods & Techniques */}
            <div style={pageStyles.categoryGroup} id='methods-techniques' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Methods & Techniques</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Video Marketing", "digital")}
                {renderServiceItem("E-Commerce Marketing", "digital")}
                {renderServiceItem("Email Marketing", "digital")}
                {renderServiceItem("Email Automations", "digital")}
                {renderServiceItem("Community Boosting", "digital")}
              </ul>
            </div>

            {/* Analytics & Strategy */}
            <div style={pageStyles.categoryGroup} id='analytics-strategy' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Analytics & Strategy</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Marketing Strategy", "digital")}
                {renderServiceItem("Brand Strategy (SEO)", "digital")}
                {renderServiceItem("Digital Marketing strategy (SEO)", "digital")}
                {renderServiceItem("Marketing Concepts & Ideation", "digital")}
                {renderServiceItem("Conscious Branding & Marketing (SEO)", "digital")}
                {renderServiceItem("Marketing Advice", "digital")}
              </ul>
            </div>

            {/* Industry & Purpose-Specific */}
            <div style={pageStyles.categoryGroup} id='industry-purpose-specific' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Industry & Purpose-Specific</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Music Promotion", "digital")}
                {renderServiceItem("Podcast Marketing", "digital")}
                {renderServiceItem("Mobile App Marketing", "digital")}
                {renderServiceItem("Book & eBook Marketing", "digital")}
                {renderServiceItem("Self-Publish Your Book", "digital")}
              </ul>
            </div>
          </div>
        </section>

        {/* Music & Audio Section (White) */}
        <section className="service-section"
          style={{ ...pageStyles.section, ...sectionBackgroundStyles.white }} 
          ref={sectionRefs.music} 
          id="music"
        >
          <div style={pageStyles.musicHeader}>
            <div style={pageStyles.headerOverlay}></div>
            <div style={pageStyles.titleContainer}>
              <h2 style={pageStyles.mainTitle}>Music & Audio</h2>
              <p style={pageStyles.subTitle}>Stay in tune. Let your sound be heard.</p>
            </div>
          </div>

          <div style={pageStyles.categoriesGrid}>
            {/* Voice Over & Streaming */}
            <div style={pageStyles.categoryGroup} id='voice-over-streaming' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Voice Over & Streaming</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Voice Over", "music")}
                {renderServiceItem("Podcast Production", "music")}
                {renderServiceItem("Audiobook Production", "music")}
                {renderServiceItem("Audio Ads Production", "music")}
              </ul>
            </div>
          </div>
        </section>

        {/* Programming & Tech Section (Teal) */}
        <section className="service-section"
          style={{ ...pageStyles.section, ...sectionBackgroundStyles.teal }} 
          ref={sectionRefs.programming} 
          id="programming"
        >
          <div style={pageStyles.programmingHeader}>
            <div style={pageStyles.headerOverlay}></div>
            <div style={pageStyles.titleContainer}>
              <h2 style={pageStyles.mainTitle}>Programming & Tech</h2>
              <p style={pageStyles.subTitle}>Technology that works for you.</p>
            </div>
          </div>

          <div style={pageStyles.categoriesGrid}>
            {/* Websites */}
            <div style={pageStyles.categoryGroup} id='websites' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Websites</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Website Development", "programming")}
                {renderServiceItem("Website Maintenance", "programming")}
                {renderServiceItem("WordPress", "programming")}
                {renderServiceItem("Custom Websites", "programming")}
                {renderServiceItem("Portfolio", "programming")}
              </ul>
            </div>

            {/* Application Development */}
            <div style={pageStyles.categoryGroup} id='application-development' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Application Development</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Web Applications", "programming")}
                {renderServiceItem("Desktop Applications", "programming")}
              </ul>
            </div>

            {/* Software Development */}
            <div style={pageStyles.categoryGroup} id='software-development' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Software Development</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Software Development", "programming")}
                {renderServiceItem("Scripting", "programming")}
                {renderServiceItem("Plugins Development", "programming")}
              </ul>
            </div>

            {/* Mobile Apps */}
            <div style={pageStyles.categoryGroup} id='mobile-apps' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Mobile Apps</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Mobile App Development", "programming")}
                {renderServiceItem("Cross-platform Apps", "programming")}
                {renderServiceItem("Mobile App Maintenance", "programming")}
              </ul>
            </div>

            {/* IT Support */}
            <div style={pageStyles.categoryGroup} id='it-support' className="service-area">
              <h3 style={pageStyles.categoryTitle}>IT Support</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Support & IT", "programming")}
                {renderServiceItem("Cloud Computing", "programming")}
                {renderServiceItem("Convert Files", "programming")}
              </ul>
            </div>
          </div>
        </section>

        {/* Video & Animation Section (White) */}
        <section className="service-section"
          style={{ ...pageStyles.section, ...sectionBackgroundStyles.white }} 
          ref={sectionRefs.video} 
          id="video"
        >
          <div style={pageStyles.videoHeader}>
            <div style={pageStyles.headerOverlay}></div>
            <div style={pageStyles.titleContainer}>
              <h2 style={pageStyles.mainTitle}>Video & Animation</h2>
              <p style={pageStyles.subTitle}>Where stories come alive on screen.</p>
            </div>
          </div>

          <div style={pageStyles.categoriesGrid}>
            {/* Editing & Post Production */}
            <div style={pageStyles.categoryGroup} id='editing-post-production' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Editing & Post Production</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Video Editing", "video")}
                {renderServiceItem("Visual Effects", "video")}
                {renderServiceItem("Video Art", "video")}
                {renderServiceItem("Intro & Outro Videos", "video")}
                {renderServiceItem("Video Templates Editing", "video")}
                {renderServiceItem("Subtitles & Captions", "video")}
              </ul>
            </div>

            {/* Social & Marketing Videos */}
            <div style={pageStyles.categoryGroup} id='social-marketing-videos' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Social & Marketing Videos</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Video Arts & Commercials", "video")}
                {renderServiceItem("Social Media Videos", "video")}
                {renderServiceItem("Music Videos", "video")}
                {renderServiceItem("Slideshow Videos", "video")}
              </ul>
            </div>

            {/* Explainer Videos */}
            <div style={pageStyles.categoryGroup} id='explainer-videos' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Explainer Videos</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Animated Explainers", "video")}
                {renderServiceItem("Live Action Explainers", "video")}
                {renderServiceItem("Screencasting Videos", "video")}
              </ul>
            </div>

            {/* Animation */}
            <div style={pageStyles.categoryGroup} id='animation' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Animation</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Character Animation", "video")}
                {renderServiceItem("Animated GIFs", "video")}
                {renderServiceItem("Animation for Kids", "video")}
                {renderServiceItem("Animation for Streamers", "video")}
              </ul>
            </div>

            {/* Product Videos */}
            <div style={pageStyles.categoryGroup} id='product-videos' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Product Videos</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("2D, 3D, 4D & 6D Product Animation", "video")}
                {renderServiceItem("E-Commerce Product Videos", "video")}
                {renderServiceItem("Corporate Videos", "video")}
              </ul>
            </div>

            {/* Motion Graphics */}
            <div style={pageStyles.categoryGroup} id='motion-graphics' className="service-area"> 
              <h3 style={pageStyles.categoryTitle}>Motion Graphics</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Logo Animation", "video")}
                {renderServiceItem("Lottie & Web Animation", "video")}
                {renderServiceItem("Text Animation", "video")}
              </ul>
            </div>

            {/* Filmed Video Production */}
            <div style={pageStyles.categoryGroup} id='filmed-video-production' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Filmed Video Production</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Filmed Video Production", "video")}
                {renderServiceItem("Videography", "video")}
              </ul>
            </div>

            {/* Miscellaneous */}
            <div style={pageStyles.categoryGroup} id='miscellaneous-video' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Miscellaneous</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Article to Video", "video")}
                {renderServiceItem("Book Trailers", "video")}
              </ul>
            </div>
          </div>
        </section>

        {/* Writing & Translation Section (Teal) */}
        <section className="service-section"
          style={{ ...pageStyles.section, ...sectionBackgroundStyles.teal }} 
          ref={sectionRefs.writing} 
          id="writing"
        >
          <div style={pageStyles.writingHeader}>
            <div style={pageStyles.headerOverlay}></div>
            <div style={pageStyles.titleContainer}>
              <h2 style={pageStyles.mainTitle}>Writing & Translation</h2>
              <p style={pageStyles.subTitle}>Breaking language barriers, building global connections.</p>
            </div>
          </div>

          <div style={pageStyles.categoriesGrid}>
            {/* Content Writing */}
            <div style={pageStyles.categoryGroup} id='content-writing' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Content Writing</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Articles & Blog Posts", "writing")}
                {renderServiceItem("Content Strategy", "writing")}
                {renderServiceItem("Website Content", "writing")}
                {renderServiceItem("Scriptwriting", "writing")}
                {renderServiceItem("Creative Writing", "writing")}
                {renderServiceItem("Podcast Writing", "writing")}
                {renderServiceItem("Speechwriting", "writing")}
                {renderServiceItem("Research & Summaries", "writing")}
                {renderServiceItem("Blurb", "writing")}
              </ul>
            </div>

            {/* Editing & Critique */}
            <div style={pageStyles.categoryGroup} id='editing-critique' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Editing & Critique</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Proofreading & Editing", "writing")}
                {renderServiceItem("Writing Advice", "writing")}
              </ul>
            </div>

            {/* Book & eBook Publishing */}
            <div style={pageStyles.categoryGroup} id='book-ebook-publishing' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Book & eBook Publishing</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Book & eBook Writing", "writing")}
                {renderServiceItem("Book Editing", "writing")}
                {renderServiceItem("RePublication", "writing")}
              </ul>
            </div>

            {/* Translation & Transcription */}
            <div style={pageStyles.categoryGroup} id='translation-transcription' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Translation & Transcription</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Translation", "writing")}
                {renderServiceItem("Transcription", "writing")}
              </ul>
            </div>

            {/* Business & Marketing Copy */}
            <div style={pageStyles.categoryGroup} id='business-marketing-copy' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Business & Marketing Copy</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Brand Voice & Tone", "writing")}
                {renderServiceItem("Business Names & Slogans", "writing")}
                {renderServiceItem("Product Descriptions", "writing")}
                {renderServiceItem("Ad Copy", "writing")}
                {renderServiceItem("Sales Copy", "writing")}
                {renderServiceItem("Email Copy", "writing")}
                {renderServiceItem("Social Media Copywriting", "writing")}
                {renderServiceItem("Press Releases", "writing")}
              </ul>
            </div>

            {/* Career Writing */}
            <div style={pageStyles.categoryGroup} id='career-writing' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Career Writing</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Resume Writing", "writing")}
                {renderServiceItem("Cover Letters", "writing")}
                {renderServiceItem("LinkedIn Profiles", "writing")}
                {renderServiceItem("Job Descriptions", "writing")}
              </ul>
            </div>

            {/* Miscellaneous */}
            <div style={pageStyles.categoryGroup} id='miscellaneous-writing' className="service-area">
              <h3 style={pageStyles.categoryTitle}>Miscellaneous</h3>
              <ul style={pageStyles.serviceList}>
                {renderServiceItem("Technical Writing", "writing")}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={pageStyles.footer}>
          <div style={pageStyles.footerContent}>
            <div style={pageStyles.footerLinks}>
              <Link to="/privacy-policy" style={pageStyles.footerLink}>Privacy Policy</Link>
              <span style={pageStyles.divider}>|</span>
              <Link to="/terms" style={pageStyles.footerLink}>Terms of Service</Link>
              <span style={pageStyles.divider}>|</span>
              <Link to="/refunds" style={pageStyles.footerLink}>Refund Policy</Link>
            </div>
            <p style={pageStyles.copyright}>© {new Date().getFullYear()} Fulfill First Marketplace. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}



// Combined styles for all sections
const pageStyles = {
  container: {
    maxWidth: 'clamp(100%, 90vw, 2400px)',
    margin: 'clamp(50px, 10vw, 100px) auto clamp(10px, 2vw, 20px) auto',
    padding: 'clamp(10px, 3vw, 20px)',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  section: {
    marginBottom: 'clamp(30px, 5vw, 60px)'
  },
  graphicsHeader: {
    backgroundImage: 'url("https://mycollegeguide.org/wp-content/uploads/2022/10/graphic-design-degree-careers.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'clamp(5px, 1.5vw, 8px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    position: 'relative',
    overflow: 'hidden',
    height: 'clamp(150px, 30vw, 300px)'
  },
  businessHeader: {
    backgroundImage: 'url("https://media.istockphoto.com/id/950986656/photo/business-finance-accounting-contract-advisor-investment-consulting-marketing-plan-for-the.jpg?s=612x612&w=0&k=20&c=U-y6cADCby4QwENFptPrVcK_MplesqZmnDxUMMkJZvM=")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'clamp(5px, 1.5vw, 8px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    position: 'relative',
    overflow: 'hidden',
    height: 'clamp(150px, 30vw, 300px)'
  },
  digitalHeader: {
    backgroundImage: 'url("https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/1gS7mvUhAjUsNSMrDab1Tf/e8c8f71d054c557815d180a6d9f37251/GettyImages-1184334685.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'clamp(5px, 1.5vw, 8px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    position: 'relative',
    overflow: 'hidden',
    height: 'clamp(150px, 30vw, 300px)'
  },
  musicHeader: {
    backgroundImage: 'url("https://bayeight.com/wp-content/uploads/2023/08/Audio-Engineer-1.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'clamp(5px, 1.5vw, 8px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    position: 'relative',
    overflow: 'hidden',
    height: 'clamp(150px, 30vw, 300px)'
  },
  programmingHeader: {
    backgroundImage: 'url("https://www.wordstream.com/wp-content/uploads/2022/03/ws-learn-digital-marketing-jobs-developer-jobs.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'clamp(5px, 1.5vw, 8px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    position: 'relative',
    overflow: 'hidden',
    height: 'clamp(150px, 30vw, 300px)'
  },
  videoHeader: {
    backgroundImage: 'url("https://s3.eu-west-1.amazonaws.com/idealinsight-ta/cache/images/73172/AdobeStock_552464888_9bcdb1e7bf1e0781880864128edabe8c.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'clamp(5px, 1.5vw, 8px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    position: 'relative',
    overflow: 'hidden',
    height: 'clamp(150px, 30vw, 300px)'
  },
  writingHeader: {
    backgroundImage: 'url("https://j-entranslations.com/wp-content/uploads/2020/04/Improve-Writing-Skills.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 'clamp(5px, 1.5vw, 8px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    position: 'relative',
    overflow: 'hidden',
    height: 'clamp(150px, 30vw, 300px)'
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(0, 20, 20, 0.6)',
    zIndex: 1,

  },
  titleContainer: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'clamp(5px, 1vw, 10px)',
    justifyContent: 'center',
    padding: 'clamp(15px, 5vw, 80px)',
    textAlign: 'center',
    height: '100%'
  },
  mainTitle: {
    fontSize: 'clamp(20px, 5vw, 50px)',
    color: '#fff',
    margin: '0',
    fontWeight: '700',
    textShadow: 'rgba(122, 119, 119, 0.5)'
  },
  subTitle: {
    fontSize: 'clamp(12px, 2.5vw, 20px)',
    color: 'white',
    margin: '0',
    fontWeight: '400',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  },
  categoriesGrid: {
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(20px, 3vw, 40px)',
    marginBottom: 'clamp(20px, 3vw, 40px)'
  },
  categoryGroup: {
    fontSize: 'clamp(13px, 1.5vw, 15px)',
    color: 'white',
    marginBottom: 'clamp(20px, 3vw, 40px)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  categoryTitle: {
    fontSize: 'clamp(16px, 2vw, 23px)',
    color: '#004040',
    margin: '0 0 clamp(10px, 1.5vw, 15px) 0',
    fontWeight: '600',
    paddingBottom: 'clamp(8px, 1vw, 10px)',
    borderBottom: `2px solid #087830`,
    width: '100%'
  },
  serviceList: {
     fontSize: 'clamp(14px, 2vw, 20px)',
    color: '#087830',
    listStyle: 'none',
    padding: '0',
    margin: '0 0 clamp(20px, 3vw, 30px) 0',
    display: 'grid',
     gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 30vw, 300px), 1fr))',
    gap: 'clamp(15px, 2vw, 20px)',
    width: '100%',
    rowGap: '30px',
    justifyContent: 'center'
  },
  serviceItem: {
    fontSize: 'clamp(16px, 2.3vw, 23px)',
    fontStyle: 'italic',      
    display: 'flex',
    color: 'white',
    flexDirection: 'column',
    padding: 'clamp(8px, 1.5vw, 12px)',
    backgroundColor: '#087830',
    borderRadius: 'clamp(6px, 1vw, 8px)',
    border: `1px solid ${tealTheme.teal200}`,
    boxShadow: '0 2px 5px rgba(0, 26, 15, 0.1)',
    height: '100%',
    marginBottom: 'clamp(15px, 2vw, 20px)'
  },
  serviceItemActive: {
    fontSize: 'clamp(14px, 2vw, 16px)',
    color: 'white',
    fontWeight: 'bold',
    padding: 'clamp(6px, 1vw, 8px) 0',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalImage: {
    width: '200%',
    height: 'clamp(120px, 15vw, 250px)',
    objectFit: 'cover',
    borderRadius: 'clamp(4px, 0.8vw, 5px)',
    marginBottom: 'clamp(8px, 1vw, 10px)'
  },
  arrowIcon: {
    transition: 'transform 0.2s ease',
    color: tealTheme.primary,
    fontWeight: 'bold',
    fontSize: 'clamp(14px, 2vw, 16px)' 
  },
  learnMoreLink: {
    fontSize: 'clamp(12px, 1.8vw, 14px)',
    display: 'inline-block',
    color:  '#00FA9A',
    fontWeight: '600',
    textDecoration: 'none',
    marginTop: 'clamp(8px, 1vw, 10px)',
    '&:hover': {
      textDecoration: 'underline',
      color: 'tealTheme.primaryDark',
    }
  },
  footer: {
    backgroundColor: '#fff',
    color: '#555',
    padding: 'clamp(1rem, 2vw, 2rem) 0',
    borderTop: '1px solid #e4e5e7',
    fontFamily: 'sans-serif',
    marginTop: 'clamp(1rem, 2vw, 2rem)',
  },
  footerContent: {
    maxWidth: 'clamp(300px, 90vw, 1400px)',
    margin: '0 auto',
   padding: '0 clamp(10px, 3vw, 20px)',
    textAlign: 'center',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(0.5rem, 1vw, 1rem)',
    marginBottom: 'clamp(0.5rem, 1vw, 1rem)',
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#555',
    fontSize: 'clamp(11px, 2vw, 14px)',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    ':hover': {
      color: tealTheme.primary,
    },
  },
  divider: {
    color: '#ddd',
    fontSize: 'clamp(12px, 2vw, 14px)',
  },
  copyright: {
   fontSize: 'clamp(10px, 1.8vw, 12px)',
    color: '#999',
    marginTop: 'clamp(0.3rem, 1vw, 0.5rem)',
  },
};

// Section background styles
const sectionBackgroundStyles = {
  teal: {
    backgroundColor: tealTheme.teal50,
     padding: 'clamp(15px, 3vw, 40px) clamp(10px, 2vw, 20px)',
    borderRadius: 'clamp(8px, 1.5vw, 10px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
  },
  white: {
    backgroundColor: '#ffffff',
     padding: 'clamp(15px, 3vw, 40px) clamp(10px, 2vw, 20px)',
    borderRadius: 'clamp(8px, 1.5vw, 10px)',
    marginBottom: 'clamp(20px, 3vw, 30px)',
    boxShadow: '#004040'
  }
};

// Sidebar styles
const sidebarStyles = {
  container: {
    position: 'fixed',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '	#087830',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '15px',
    zIndex: 100,
    maxHeight: '80vh',
    // overflowY: 'auto',
    width: '200px',

    // '@media (max-width: 768px)': {
    //   display: 'none'
    // }
  },
  title: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    fontWeight: '600',
    color: tealTheme.primaryDark,
    marginBottom: '15px',
    paddingBottom: '5px',
    borderBottom: `1px solid ${tealTheme.teal200}`,
    // '@media (max-width: 768px)': {
    //   display: 'none'
    // }
  },
  link: {
    fontFamily: 'Arial, sans-serif',
    display: 'block',
    padding: '8px 12px',
    marginBottom: '5px',
    borderRadius: '4px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: tealTheme.teal50,
      color: tealTheme.primary
    },
    // '@media (max-width: 768px)': {
    //   display: 'none'
    // }
  },
  activeLink: {
    color: '#00FA9A',
    fontWeight: 'bold',
    borderLeft: '3px solid #00FA9A',
    // '@media (max-width: 768px)': {
    //   display: 'none'
    // }
  }
};


// Add these styles near your other style declarations
const mobileSidebarStyles = {
  button: {
    position: 'fixed',
    top: 'clamp(4rem, 8vw, 4rem)',
    left: 'clamp(0.5rem, 2vw, 1rem)',
    zIndex: 100, // Below navbar (assuming navbar has higher z-index)
    backgroundColor: '#087830',
    color: 'white',
    border: 'none',
    borderRadius: 'clamp(4px, 1vw, 5px)',
    padding: 'clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 15px)',
    fontSize: 'clamp(14px, 2vw, 16px)',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  sidebar: {
    position: 'fixed',
    left: '-100%',
    top: '4rem',
    width: 'clamp(50%, 70vw, 50%)',
    maxWidth: '300px',
    height: '100vh',
    // transition: 'left 0.3s ease',
    zIndex: 999, // Below navbar
    overflowY: 'auto',
    backgroundColor: '#087830',
    paddingTop: 'clamp(6rem, 15vw, 8rem)',
    padding: 'clamp(0.8rem, 2vw, 1rem)'
  },
  sidebarOpen: {
    left: 'clamp(0.2rem, 1vw, 0.4rem)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1, // Below sidebar but above other content
  },
  closebutton:{
    // display: 'block',
    width: '100%',
    textAlign: 'center',
    padding: 'clamp(0.3rem, 1vw, 0.5rem)',
    marginTop: 'clamp(1rem, 2vw, 1.5rem)',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 'clamp(14px, 2vw, 16px)'
  }
};