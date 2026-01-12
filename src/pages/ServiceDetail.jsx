import { useParams, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ChatBubble from '../components/ChatBubble';
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from '../supabaseClient';

const paymentLogos = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png',
  pay: 'https://cdn2.downdetector.com/static/uploads/logo/apple-pay.png'
};

// Service data for all sections
const graphicsServiceDetails = {
  "Industrial & Product Design": {
    title: "Industrial & Product Design",
    description: "Industrial & Product Design is all about creating products that blend innovation, functionality, and style. It's the art of making everyday items smarter, easier to use, and visually appealing. From sleek gadgets to ergonomic furniture, designers craft solutions that meet real needs while elevating the user experience.  The goal? To make products that not only work flawlessly but also leave a lasting impression on the people who use them.",
    images: [
    "https://www.coventry.ac.uk/globalassets/media/global/00-new-course-imagery/arts-and-humanities/ug/product-design-banner-1920x1080.jpg",
    "https://bsakdt.weebly.com/uploads/2/4/8/9/24899868/5725132_orig.jpg ",
    "https://www.sparkinnovations.com/wp-content/uploads/2017/12/industrial-design-firm-4-.jpg  ",
  ],
    modalImage: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/6fd4b9133605263.61c1a6ed5b742.jpg",
    path: "/services/graphics/industrial-&-product-design",
    price: "$4,750" ,
    section: "graphics",
    area: "product-gaming"
  },
  "Graphics for Streamers": {
    title: "Graphics for Streamers",
    description: "Graphics for streamers are essential visual elements that enhance the look and feel of a live broadcast, helping streamers create a professional and engaging experience for their audience. These graphics typically include overlays, alerts, screens, and customizable panels that match a streamer's personal brand or theme. Whether static or animated, well-designed stream graphics not only make a stream visually appealing but also improve viewer retention by adding polish and consistency. Perfect for platforms like Twitch, YouTube, and Kick, these assets help streamers stand out in a crowded space and leave a lasting impression.",
   images: [
    "https://img.freepik.com/premium-vector/twitch-overlay-live-stream-template-set_584197-283.jpg?semt=ais_hybrid&w=740",
" https://img.freepik.com/premium-vector/webtwitch-stream-overlay-package-including-facecam-overlay-offline-starting-soon-twitch-panels_1030514-6.jpg ",
"  https://fiverr-res.cloudinary.com/videos/f_auto,q_auto,t_main1/mkvbgxhtct9zz4bvkdgm/create-professional-twitch-logo-overlays-and-screens.png ",
  ],
    modalImage: "https://masterbundles.com/wp-content/uploads/2023/05/preview-1-276.jpg" ,
    path: "/services/graphics/graphics-for-streamers",
    price: "$475",
    section: "graphics",
    area: "product-gaming"
  },
  "Trade Booth Design": {
    title: "Trade Booth Design",
    description: "Trade booth design creates eye-catching, functional displays that attract visitors and showcase your brand at events. With strategic layouts and impactful visuals, it maximizes engagement and helps you stand out in busy trade shows.",
    images: [
    "https://img.freepik.com/free-vector/promotional-exhibition-stand-template_98292-3482.jpg",
" https://elements-resized.envatousercontent.com/elements-preview-images/eacdb5d5-aa25-4db6-bf45-dd342bffe311?w=632&cf_fit=scale-down&q=85&format=auto&s=b2b059680c1878ea36d97e25466a0d0d425b5b4f0a58727a7f06f89777e9b619 ",
"  https://market-resized.envatousercontent.com/previews/files/635104535/590.jpg?w=590&h=590&cf_fit=crop&crop=top&format=auto&q=85&s=c4fa0b45bd2c506d2b3a35b889fa504235e7b62f550f32509224b551c7b2afcb",
  ],
    modalImage: "https://png.pngtree.com/thumb_back/fh260/background/20230704/pngtree-3d-render-of-an-impressive-exhibition-booth-image_3755207.jpg",
    path: "/services/graphics/trade-booth-design",
    price: "$3,500" ,
     section: "graphics",
    area: "product-gaming"
  },
  "Image Editing": {
    title: "Image Editing",
    description: "Image editing enhances your photos with professional retouching, color correction, and creative effects to make them visually stunning. Perfect for marketing, social media, or personal projects, it transforms images to capture attention and tell your story. ",
     images: [
    "https://resource.flexclip.com/pages/learn-center/video-editor-with-template/video-editor-with-template-for-mobile-lumafusion.webp",
" https://images.wondershare.com/filmora/article-images/2023/template-tutorial-8.jpg ",
" https://images.wondershare.com/filmora/article-images/2023/template-tutorial-9.jpg ",
  ],
    modalImage: "https://icecreamapps.com/storage/uploads/icecream%20editing%20software%202.png" ,
    path: "/services/graphics/image-editing",
    price: "$80" ,
    section: "graphics",
    area: "visual-design"
  },
  "Presentation Design": {
    title: "Presentation Design",
    description: "Presentation design creates visually striking, well-organized slides that elevate your message and captivate your audience. Whether for business, education, or pitching, expertly designed presentations make complex information clear and keep your audience engaged.",
    images: [
    "https://img.freepik.com/premium-vector/gradient-business-presentation-templates_52683-80110.jpg",
" https://static.vecteezy.com/system/resources/previews/013/437/026/non_2x/modern-and-creative-presentation-templates-set-horizontal-poster-with-modern-gradient-style-for-branding-flyer-leaflet-marketing-advertising-annual-report-banner-landing-page-website-slider-vector.jpg ",
"  https://images.presentationgo.com/2022/09/Onward-PowerPoint-Google-Slides-Template.png",
  ],
    modalImage: "https://img.pikbest.com/templates/20250108/creative-corporate-powerpoint-presentation-slide-template-modern-business-slides_11353572.jpg!bw700", 
    path: "/services/graphics/presentation-design",
    price: "$700" ,
    section: "graphics",
    area: "visual-design"
  },
  "Infographic Design": {
    title: "Infographic Design",
    description: "Infographic design is the process of transforming complex data and information into visually engaging, easy-to-understand graphics. By combining icons, illustrations, charts, and concise text, infographics help communicate key messages quickly and effectively. They are ideal for reports, social media, presentations, marketing materials, and educational content—anywhere clarity and visual appeal are essential. A well-designed infographic not only captures attention but also improves comprehension and retention, making it a powerful tool for storytelling, data visualization, and brand communication.",
    images: [
    "https://speckyboy.com/wp-content/uploads/2024/01/infographic-template-i.jpg",
" https://s.tmimgcdn.com/scr/1200x750/312400/infographic-design-for-business-template-vector-5-steps_312455-original.jpg",
"  https://static.vecteezy.com/system/resources/previews/017/152/851/non_2x/simple-infographic-presentation-design-template-concept-of-6-steps-of-business-development-infographic-design-vector.jpg ",
  ],
   
    modalImage: "https://www.freevector.com/uploads/vector/preview/24618/abstract-infographic-design-vector-templates.jpg",
    path: "/services/graphics/infographic-design",
    price: "$475" ,
    section: "graphics",
    area: "visual-design"
  },
  "Resume Design": {
    title: "Resume Design",
    description: "Resume design focuses on creating a visually appealing and well-organized layout that highlights a candidate’s skills, experience, and achievements in a clear and compelling way. A professionally designed resume uses thoughtful typography, strategic spacing, and clean formatting to improve readability and make a strong first impression. Whether tailored for creative industries or more traditional fields, an effective resume design not only reflects personal brand and professionalism but also helps candidates stand out in a competitive job market.",
    images: [
    "https://img.freepik.com/premium-vector/minimalist-resume-template-design_594295-351.jpg",
 "  https://static.vecteezy.com/system/resources/previews/006/141/114/non_2x/creative-resume-cv-template-design-in-a4-paper-free-vector.jpg",
"  https://media.istockphoto.com/id/1192900966/vector/cv-templates-professional-resume-letterhead-cover-letter-business-layout-job-applications.jpg?s=612x612&w=0&k=20&c=LWvYqT8H02JNLkGgjOnSMD6yi9bQBUSBucZlo9DCLOE=",
  ],
    modalImage: "https://www.goskills.com/blobs/blogs/86/e485c22c-9a98-4b20-8e34-f5d970949629.png",
    path: "/services/graphics/resume-design",
    price: "$235" ,
    section: "graphics",
    area: "visual-design"
  },
  "Flyer Design": {
    title: "Flyer Design",
    description: "Flyer design involves creating visually appealing and impactful marketing materials that effectively communicate your message to your target audience. Whether for events, promotions, or product launches, a well-designed flyer uses bold graphics, concise text, and strategic layout to capture attention and encourage engagement. It’s a cost-effective way to boost visibility and drive results both online and offline.",
     images: [
    "https://static.vecteezy.com/system/resources/previews/004/922/516/non_2x/creative-business-flyer-design-modern-layout-design-design-template-2-page-flyer-design-free-vector.jpg",
 "  https://static.vecteezy.com/system/resources/previews/004/922/495/non_2x/creative-business-flyer-design-modern-layout-design-design-template-2-page-flyer-design-free-vector.jpg",
"  https://static.vecteezy.com/system/resources/previews/004/922/494/non_2x/creative-business-flyer-design-modern-layout-design-design-template-2-page-flyer-design-free-vector.jpg",
  ],
    modalImage: "https://media.istockphoto.com/id/956414624/vector/brochure-flyer-template-layout-background-design-booklet-leaflet-corporate-business-annual.jpg?s=612x612&w=0&k=20&c=aFxHWZda5RAkALIZJm5_G8MmRPEhlBhgEt_HTOoYUHc=",
    path: "/services/graphics/flyer-design",
    price: "$235" ,
    section: "graphics",
    area: "print-design"
  },
  "Brochure Design": {
    title: "Brochure Design",
    description: "Brochure design is all about creating polished, professional print or digital materials that showcase your products, services, or brand story in a compelling way. Using eye-catching layouts, balanced text, and attractive visuals, a well-designed brochure helps inform, persuade, and leave a lasting impression on your audience, making it an essential marketing tool for businesses of all sizes.",
    images: [
    " https://static.vecteezy.com/system/resources/previews/000/097/442/non_2x/vector-template-design-of-blue-wave-trifold-brochure.jpg  ",
 " https://i.pinimg.com/736x/e2/e7/00/e2e700c9415e11f50fa42e5c362e3a46.jpg ",
" https://static.vecteezy.com/system/resources/previews/016/386/935/non_2x/corporate-company-profile-brochure-template-design-16-page-corporate-brochure-editable-template-layout-minimal-business-brochure-template-design-vector.jpg",
  ],
    modalImage: "https://thumbs.dreamstime.com/b/vector-modern-brochure-wave-design-abstract-flyer-technology-background-layout-template-poster-black-yellow-w-white-115649347.jpg",
    path: "/services/graphics/brochure-design",
    price: "$575" ,
    section: "graphics",
    area: "print-design"
  },
  "Poster Design": {
    title: "Poster Design",
    description: "Poster design focuses on creating bold, eye-catching visuals that communicate your message quickly and effectively. Whether for events, promotions, or awareness campaigns, a well-crafted poster uses striking graphics and clear typography to grab attention and inspire action, perfect for making a memorable impact in any space.",
   images: [
    "https://static.vecteezy.com/system/resources/thumbnails/021/917/384/small_2x/template-for-cover-design-vector.jpg",
 " https://img.freepik.com/premium-vector/minimal-modern-cover-design-dynamic-colorful-gradients-future-geometric-patterns_258787-2082.jpg",
" https://st4.depositphotos.com/1029760/21272/v/450/depositphotos_212723004-stock-illustration-abstract-colorful-collage-poster-design.jpg",
  ],
    modalImage: "https://t4.ftcdn.net/jpg/02/34/45/75/360_F_234457527_f5gGlJgal9y549owGTpOD3lFmrg8fFCB.jpg",
    path: "/services/graphics/poster-design",
    price: "$315" ,
    section: "graphics",
    area: "print-design"
  },
  "Menu Design": {
    title: "Menu Design",
    description: "Menu design combines aesthetics and functionality to showcase your food and drinks in an attractive, easy-to-read format. A well-crafted menu enhances the dining experience, reflects your brand’s style, and helps guide customers’ choices, making it a vital tool for restaurants, cafes, and bars to boost sales and leave a lasting impression.",
    images: [
    "https://static.vecteezy.com/system/resources/previews/029/919/324/non_2x/modern-restaurant-menu-card-design-template-vector.jpg",
 "  https://static.vecteezy.com/system/resources/previews/041/332/640/non_2x/food-restaurant-menu-layout-editable-template-menu-list-cafe-black-modern-template-list-menu-layout-and-food-poster-restaurant-for-dinner-lunch-breakfast-menu-template-vector.jpg",
" https://static.vecteezy.com/system/resources/previews/029/919/320/non_2x/modern-restaurant-menu-card-design-template-vector.jpg",
  ],
    modalImage: "https://static.vecteezy.com/system/resources/thumbnails/012/196/191/small_2x/lovely-food-menu-and-restaurant-flyer-design-template-free-vector.jpg",
    path: "/services/graphics/menu-design",
    price: "$475" ,
    section: "graphics",
    area: "print-design"
  },
  "Invitation Design": {
    title: "Invitation Design",
    description: "Invitation design creates beautiful, personalized invitations that set the perfect tone for your event. Whether it’s a wedding, birthday, corporate gathering, or party, a well-designed invitation combines elegant visuals and clear information to excite guests and make your occasion memorable from the very first impression.",
    images: [
    "https://img.freepik.com/free-psd/simple-elegant-black-white-floral-wedding-invitation-card_44538-11476.jpg",
 "  https://www.shutterstock.com/image-vector/contemporary-abstract-technology-cover-design-600nw-2056059092.jpg",
 "https://img.freepik.com/premium-vector/simple-wedding-invitation-card-with-peri-color-abstract-background_44538-5930.jpg",
],
    modalImage: "https://raketcontent.com/wedding_invitation_template_with_red_floral_and_gold_leaves_vector_583a0c0552.jpg",
    path: "/services/graphics/invitation-design",
    price: "$315" ,
    section: "graphics",
    area: "print-design"
  },
  "Packaging & Label Design": {
    title: "Packaging & Label Design",
    description: "Packaging and label design is all about creating visually striking and functional designs that protect your product while attracting customers. Good packaging communicates your brand’s identity, highlights key information, and enhances the overall customer experience, helping your product stand out on the shelf and build lasting recognition.",
   images: [
    "https://img.freepik.com/premium-vector/label-packaging-design-creative-modern-design_633283-1021.jpg",
 "  https://img.freepik.com/premium-vector/label-packaging-design-creative-modern-design_633283-1015.jpg",
" https://d1csarkz8obe9u.cloudfront.net/posterpreviews/gold-label-design-template-e4511201de5c2c7dc94c7023610022a9_screen.jpg?ts=1737962434",
  ],
    modalImage: "https://img.freepik.com/premium-vector/packaging-label-design-template_1588-589.jpg",
    path: "/services/graphics/packaging-&-label-design",
    price: "$1,200" ,
    section: "graphics",
    area: "packaging-covers"
  },
  "Book Design": {
    title: "Book Design",
    description: "Book design combines creativity and functionality to craft visually stunning layouts that enhance the reader’s experience. From cover art to typography and page formatting, a well-designed book reflects the story’s tone and style while ensuring readability and professionalism, making your book stand out in both print and digital formats.",
   images: [
    "https://t3.ftcdn.net/jpg/04/99/87/80/360_F_499878081_PeUayA2tEiWvcqUz1Gi6pnIEMCvvoKv8.jpg",
 "  https://webflow-assets2.redokun.com/615dc53ac3f5ddb2f90d1117/61a4e01705ed60e46eb44955_bluebook.jpeg",
"  https://t4.ftcdn.net/jpg/03/97/06/05/360_F_397060598_sXJYM5HgsjeLz2P2XkdyagftMvXdfMzN.jpg",
  ],
    modalImage: "https://designshack.net/wp-content/uploads/minimal-book-indesign-template-780-1.jpg",
    path: "/services/graphics/book-design",
    price: "$1,750" ,
    section: "graphics",
    area: "packaging-covers"
  },
  "Book Covers": {
    title: "Book Covers",
    description: "Book cover design is your book’s first impression, an eye-catching, creative cover that grabs attention and entices readers to explore your story. Combining striking visuals, typography, and color, a professionally designed cover reflects your book’s theme and genre while standing out on shelves and online stores.",
  images: [
    "https://static.vecteezy.com/system/resources/previews/029/443/189/non_2x/modern-book-cover-design-template-set-for-business-and-construction-good-for-annual-report-brochure-design-portfolio-background-a4-size-book-cover-template-and-eps-cc-vector.jpg",
 "  https://st2.depositphotos.com/1055089/5923/v/450/depositphotos_59232215-stock-illustration-modern-vector-book-cover-template.jpg",
"  https://i.pinimg.com/736x/7c/6a/a7/7c6aa75ed6f3eb007ae07b3f4250f7bc.jpg",
  ],  
  modalImage: "https://static.vecteezy.com/system/resources/previews/022/159/463/non_2x/book-cover-abstract-minimalist-art-soft-cover-book-design-poster-design-vector.jpg",
     path: "/services/graphics/book-covers",
    price: "$675" ,
     section: "graphics",
    area: "packaging-covers"
  },
  "Album Cover Design": {
    title: "Album Cover Design",
    description: "Album cover design is all about creating bold, memorable artwork that captures the spirit and style of your music. A great cover not only grabs attention but also tells a story, sets the mood, and builds your artist brand—making your album instantly recognizable whether in digital stores or physical copies.",
    images: [
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/album-cover-%2839%29-design-template-28ffb919ab69405ef58783602045681b_screen.jpg?ts=1663934532",
 "  https://i.pinimg.com/736x/63/a0/08/63a008f631ae7492a75a001bd0791e8f.jpg",
"  https://d1csarkz8obe9u.cloudfront.net/posterpreviews/album-cover-of-road-design-template-dbfdde634f99c7eb99a6b326ecfe4371_screen.jpg?ts=1652787815",
  ],
    modalImage: "https://i.pinimg.com/736x/1c/15/30/1c153006244f21b2ab23f7f83fa8dfaa.jpg",
    path: "/services/graphics/album-cover-design",
    price: "$475" ,
    section: "graphics",
    area: "packaging-covers"
  },
  "Social Media Design": {
    title: "Social Media Design",
    description: "Social media design creates eye-catching visuals tailored to boost your brand’s presence across platforms like Instagram, Facebook, and Twitter. From posts and stories to banners and ads, well-crafted designs grab attention, increase engagement, and help you connect with your audience through consistent, on-brand content.",
   images: [
    "https://static.vecteezy.com/system/resources/previews/008/377/835/non_2x/construction-social-media-post-banner-design-template-with-yellow-color-corporate-construction-tools-social-media-post-design-home-improvement-banner-template-home-repair-social-media-post-banner-free-vector.jpg",
 "  https://i.pinimg.com/736x/b7/81/23/b7812301a49ed9039f97289b1bb1ee43.jpg",
" https://t3.ftcdn.net/jpg/03/62/29/50/360_F_362295001_wDJ1SlN1tJEeULODOSmIubERFwejARPx.jpg",
  ],
    modalImage: "https://www.dotyeti.com/wp-content/uploads/2021/04/Screen-Shot-2021-04-08-at-1.26.36-PM.png",
    path: "/services/graphics/social-media-design",
    price: "$340" ,
     section: "graphics",
    area: "marketing-design"
  },
  "Thumbnails Design": {
    title: "Thumbnails Design",
    description: "Thumbnail design focuses on creating compelling, attention-grabbing images that entice viewers to click on your videos or content. A well-designed thumbnail uses bold visuals, clear text, and strong composition to stand out in crowded feeds, boosting clicks and increasing your audience engagement.",
   images: [
    "https://t3.ftcdn.net/jpg/04/32/81/62/360_F_432816202_lvMteQDGEm8xVPogRuimtCKyQ3yqZ0cA.jpg",
 "  https://t4.ftcdn.net/jpg/03/98/48/41/360_F_398484198_sRtj3r8CdM5JTGgbgFKTCSBgYZJnH8T0.jpg",
"  https://static.vecteezy.com/system/resources/previews/019/637/710/non_2x/thumbnail-design-template-for-your-video-creative-and-unique-concept-for-thumbnails-fully-editable-corporate-social-banner-free-vector.jpg",
  ],
    modalImage: "https://www.creativefabrica.com/wp-content/uploads/2021/06/06/YouTube-Thumbnail-TemplatesPSD-SVG-AI-Graphics-13006896-1-1-580x414.png",
    path: "/services/graphics/thumbnails-design", 
    price: "$53" ,
     section: "graphics",
    area: "marketing-design"
  },
  "Email Design": {
    title: "Email Design",
    description: "Email design crafts visually appealing and easy-to-read layouts that engage your audience and drive action. Whether for newsletters, promotions, or announcements, well-designed emails combine strong visuals, clear messaging, and user-friendly formatting to boost open rates and conversions.",
   images: [
    "https://cdn.kwork.com/files/portfolio/t3/95/afee7d681ab35527473210198a9146a8092f4f55-1707791917.jpg",
 " https://www.sketchappsources.com/resources/source-image/email-template-konsav.png",
"  https://img.freepik.com/free-vector/ecommerce-email-templates-with-photo_23-2148714844.jpg",
  ],
    modalImage: "https://ghost-images.chamaileon.io/2017/02/really-good-emails-1280x570.png",
     path: "/services/graphics/email-design",
    price: "$315" ,
     section: "graphics",
    area: "marketing-design"
  },
  "Web Banners": {
    title: "Web Banners",
    description: "Web banners are vibrant, clickable visuals designed to capture attention and drive traffic online. Perfect for ads, promotions, and brand awareness, well-crafted banners use bold graphics and clear calls-to-action to engage viewers and boost clicks across websites and social media.",
    images: [
    "https://static.vecteezy.com/system/resources/thumbnails/003/192/961/small_2x/website-banner-template-design-vector.jpg",
 "  https://static.vecteezy.com/system/resources/thumbnails/003/756/466/small_2x/set-of-creative-web-banners-of-standard-size-with-a-place-for-photos-vertical-horizontal-and-square-template-illustration-vector.jpg",
" https://s.tmimgcdn.com/scr/1200x627/338700/web-banner-template-set-horizontal-header-web-banner-header-background-website-design-idea_338771-original.jpg",
  ],
    modalImage: "https://t4.ftcdn.net/jpg/01/64/26/27/360_F_164262701_BsbY2qe8M3fvvB4cBWsFLgeEXhgEukcw.jpg",
   path: "/services/graphics/web-banners", 
    price: "$340" ,
     section: "graphics",
    area: "marketing-design"
  },
  "Signage Design": {
    title: "Signage Design",
    description: "Signage design creates clear, impactful visual displays that guide, inform, and promote your brand in physical spaces. Whether for storefronts, events, or indoor navigation, effective signage combines bold graphics, readable typography, and strategic placement to attract attention and communicate your message instantly.",
    images: [
    "https://img.freepik.com/free-vector/modern-green-pink-brown-banner-design-templates-with-stripes_1097-1123.jpg?semt=ais_hybrid&w=740&q=80",
 "  https://img.freepik.com/premium-vector/abstract-unique-corporate-roll-up-banner-signage-standee-template-clean-design-office-company_343847-102.jpg",
" https://img.freepik.com/premium-vector/corporate-business-roll-up-signage-banner-design-template_144648-807.jpg",
  ],
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
    description: "Market research involves gathering and analyzing data about your target audience, competitors, and industry trends to make informed business decisions. By understanding customer needs, market opportunities, and potential challenges, businesses can develop effective strategies, improve products, and stay ahead of the competition.",
     images: [
    "https://imgscf.slidemembers.com/list_thumbnail/1/1/21/market_research_ppt_templates_design-20995__480.jpg",
 "  https://nulivo.s3.us-east-2.amazonaws.com/media/users/Billl/products/3375/screenshots/Market-Research-PowerPoint-Template-09.jpg?v=1",
" https://www.eloquens.com/i/p/10/10655/135738/1/market-research-secondary-market-research-templates.png",
  ],
    modalImage: "https://truicbusinessideas.com/wp-content/uploads/2024/08/market-research.jpg",
    path: "/services/business/market-research", 
    price: "$5,000 | Comprehensive market report with analysis" ,
    section: "business",
    area: "formation-consulting"
  },
  "Business Plans": {
    title: "Business Plans",
    description: "Business plans are strategic roadmaps that outline your company’s goals, target market, financial projections, and growth strategies. A well-crafted business plan not only guides your operations but also attracts investors and partners by clearly showcasing your vision and path to success.",
     images: [
    "https://img.freepik.com/free-vector/editable-business-presentation-template-vector-modern-design-set_53876-111189.jpg",
 "  https://static.vecteezy.com/system/resources/previews/023/023/546/non_2x/business-plan-12-page-business-plan-editable-template-layout-vector.jpg",
"https://www.templatables.com/cdn/shop/products/Business-Plan-Template-Small-Business-Planner-Proposal-Start-Up-Workbook-Business-Plan-Analysis-Canva-Word-Side-Hustle-EDITABLE-Plan_2048x.jpg?v=1657898354",
  ],
    modalImage: "https://imageio.forbes.com/specials-images/imageserve/6558e3d0ed69fc40a9be3fcf/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
    path: "/services/business/business-plans",
    price: "$3,500 | Full plan with financials and market sizing" ,
    section: "business",
    area: "formation-consulting"
  },
  "Business Consulting": {
    title: "Business Consulting",
    description: "Business consulting provides expert advice and tailored strategies to help companies improve operations, solve challenges, and achieve growth. By analyzing your business needs and market conditions, consultants offer actionable insights that drive efficiency, innovation, and long-term success.",
    images: [
    "https://eprenz.com/wp-content/uploads/2022/11/Business-consulting.jpg",
 "  https://www.simplilearn.com/ice9/free_resources_article_thumb/how_tobecomebusinessconsultant.jpg",
" https://www.flexjobs.com/blog/wp-content/uploads/2023/07/10083027/How-to-Start-a-Career-as-a-Business-Consultant.jpg",
  ],
    modalImage: "https://imageio.forbes.com/specials-images/imageserve/5e56f223d378190007f46149/A-management-consulting-career--How-to-build-a-career-as-a-management-consultant-/960x0.jpg?format=jpg&width=960",
    path: "/services/business/business-consulting",
    price: "$15,000 | Multi-month strategic engagement " ,
    section: "business",
    area: "formation-consulting"
  },
  "HR Consulting": {
    title: "HR Consulting",
    description: "HR consulting helps organizations optimize their human resources by providing expert guidance on recruitment, employee relations, compliance, and talent management. Through tailored strategies, HR consultants improve workforce performance, foster positive workplace culture, and ensure legal and regulatory alignment.",
    images: [
    "https://centralhr.com.au/wp-content/uploads/2025/03/Future-of-HR-consultancy.webp",
 "  https://bramwellpartners.com.au/wp-content/uploads/2019/04/hr-manager-blog-feature-image.jpg",
" https://cdn.prod.website-files.com/65a68db60fa2f99d12439063/665f188161ed592f1a45be67_f1788944df0a44cb0171bc8d014a1c21.Best-Ways-To-Get-Clients-for-Your-HR-Consultancy-Blog.jpg",
  ],
    modalImage: "https://corpemployservices.com/wp-content/uploads/2021/07/HR-Consulting-mobile.jpg",
    path: "/services/business/hr-consulting",
    price: "$8,000 | HR audit + policy revamp " ,
    section: "business",
    area: "formation-consulting"
  },
  "Project Management": {
    title: "Project Management",
    description: "Project management involves planning, organizing, and overseeing tasks to ensure projects are completed on time, within budget, and meet quality standards. Effective project management coordinates resources, manages risks, and drives team collaboration to deliver successful outcomes and achieve business goals.",
    images: [
    "https://images.squarespace-cdn.com/content/v1/61730a7d9c7a0c57e52d6f0b/dfc46856-7e43-401b-b941-ae85cedb0548/AdobeStock_170135481.jpeg",
 " https://cdn.clarku.edu/programs/wp-content/uploads/sites/2/2024/11/masters-in-project-management-banner-880x550-2.jpg",
" https://aquilacommercial.com/wp-content/uploads/2018/03/project-manager-definition.jpg",
  ],
    modalImage: "https://media.istockphoto.com/id/1411195926/photo/project-manager-working-on-laptop-and-updating-tasks-and-milestones-progress-planning-with.jpg?s=612x612&w=0&k=20&c=5A0CEsRbIrgnci0Q7LSxbrUZ1pliXy8C04ffpnjnVIw=",
    path: "/services/business/project-management",
    price: "$10,000  | End-to-end management of a mid-sized project" ,
    section: "business",
    area: "operations-management"
  },
  "Product Management": {
    title: "Product Management",
    description: "Product management guides the development and lifecycle of a product, aligning customer needs, business goals, and market trends. Product managers oversee strategy, design, and launch, ensuring products deliver value, stay competitive, and meet user expectations from concept to market success.",
     images: [
    "https://res.cloudinary.com/unichrone/image/upload/v1649833422/Blog/Product-Manager-vs-Product-Owner.webp",
 "  https://lh5.googleusercontent.com/MIh6f_DHw_4_YFWBKxjIuUBU_x_O1Kv82wUsXUkBuF66vNpQ-7xOG2AHBNKyz6Tpg5pGb9pvD-7_J5c3TPYDNU0m_1Qza0_19M1kbnNFKUO29FkiXL_VzEd5-THusMI3rl3PXqt7YKm0myd6tWLkToU",
" https://startinfinity.s3.us-east-2.amazonaws.com/t/L2rtmhCAyzk1yvyUrMd7I6DTi5Et4d1DdnEuNM2J.png",
  ],
    modalImage: "https://zenkit.com/wp-content/uploads/2019/11/Product-Management-Explained.jpg",
    path: "/services/business/product-management",
    price: "$7,500 | MVP roadmap and coordination" ,
    section: "business",
    area: "operations-management"
  },
  "Sales": {
    title: "Sales",
    description: "Sales is the art of connecting with customers to understand their needs and offer solutions that create value. Effective sales strategies build relationships, drive revenue, and fuel business growth by turning prospects into loyal clients through communication, negotiation, and trust.",
     images: [
    "https://salesdrive.info/wp-content/uploads/2016/11/take-business-next-level-sales-training-e1478926231596.jpg",
 "  https://media.licdn.com/dms/image/v2/D5612AQFxk-1sNK-R2g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1709317731248?e=2147483647&v=beta&t=Djc8XMRE63g39ZwXsN08QfdElT9DHqyZuTx1DHTe2QE",
" https://www.allbusiness.com/media-library/sales-success-concept.jpg?id=32091331&width=1200&height=600&coordinates=0%2C73%2C0%2C74",
  ],
    modalImage: "https://cdn.prod.website-files.com/5b7f24cc900973de13d7beb4/65b0a35d978a57a12b8837b6_Gross%20Sales%201.svg",
    path: "/services/business/sales",
    price: "$5000 | Campaign Package" ,
    section: "business",
    area: "sales-customer-care"
  },
  "Customer Experience Management (CXM)": {
    title: "Customer Experience Management (CXM)",
    description: "Customer Experience Management (CXM) focuses on designing and optimizing every interaction a customer has with your brand to create positive, memorable experiences. By understanding customer needs and feedback, CXM strategies improve satisfaction, loyalty, and advocacy—helping businesses build stronger relationships and drive long-term growth.",
     images: [
    "https://nobelbiz.com/wp-content/uploads/2024/03/Unified-Customer-Experience-Management-in-Contact-Centers.jpg",
 "  https://creately.com/static/assets/guides/customer-experience-management-framework/customer-profile-template.svg",
" https://lh3.googleusercontent.com/em1NYEajUYgpLxk3BHjsNeJpm5k6Ews8RM6ToXkjZpaKJMxPUWklt1LcyyWDXqpvX24ZXHqZ2X0FTB1kCnOJLLo6Ug2CsxaC5kvhw8cwtjFqv1e4xX2V8yNK8-MDGif_dyzvuh1aq8x5Goc8kw",
  ],
    modalImage: "https://www.tryvium.ai/wp-content/uploads/2024/11/contact-center-ai-solutions-scaled.webp",
    path: "/services/business/customer-experience-management-(cxm)",
    price: "$12,000 | CX audit + improvement roadmap" ,
    section: "business",
    area: "sales-customer-care"
  },
  "Lead Generation": {
    title: "Lead Generation",
    description: "Lead generation is the process of attracting and capturing potential customer's interest in your products or services. Effective strategies use targeted marketing, engaging content, and data-driven techniques to build a pipeline of qualified leads, fueling sales growth and business success.",
    images: [
    "https://www.davidtaylordigital.com/wp-content/uploads/2021/09/outsourced-b2b-lead-generation.jpg",
 "  https://cdn.prod.website-files.com/6525443539549f83dda628f6/65425c5a88db834930348932_shutterstock_1275409879-2048x1365.jpg",
" https://mondo.com/wp-content/smush-webp/2022/04/new-Lead-Generation-768x403.jpg.webp",
  ],
    modalImage: "https://blog.thomasnet.com/hs-fs/hubfs/lead-generation.jpeg?width=691&height=418&name=lead-generation.jpeg",
    path:"/services/business/lead-generation",
    price: "$7,500/month | Retainer model " ,
    section: "business",
    area: "sales-customer-care"
  },
  "Call Center & Calling": {
    title: "Call Center & Calling",
    description: "Call center and calling services provide businesses with efficient customer support, sales, and communication solutions through phone interactions. By handling inquiries, resolving issues, and engaging prospects, call centers enhance customer satisfaction, drive conversions, and strengthen brand loyalty.",
     images: [
    "https://vcc.live/wp-content/uploads/2019/07/50-Must-Know-Call-Center-Terminologies-e1652971146644.jpg",
 " https://yellow.ai/wp-content/uploads/2024/02/Call-center-agents.webp",
" https://www.twilio.com/content/dam/twilio-com/global/en/10_resource_center/legacy/hero-images/longform-content/article_inbound-vs-outbound-call-center_hero.png",
  ],
    modalImage: "https://www.mapcommunications.com/wp-content/uploads/2018/06/MAP-Communications-24-Hour-Call-Center.jpeg",
    path:"/services/business/call-center-&-calling",
    price: "$3000/month | Outsourced call center support" ,
    section: "business",
    area: "sales-customer-care"
  },
  "Customer Care": {
    title: "Customer Care",
    description: "Customer care focuses on providing exceptional support and service to ensure customers feel valued and satisfied throughout their journey. Through timely assistance, empathy, and effective problem-solving, strong customer care builds trust, loyalty, and long-lasting relationships that drive business growth.",
    images: [
    "https://d1eipm3vz40hy0.cloudfront.net/images/AMER/customer-care-hero.png",
 " https://www.odysseytraining.com.au/wp-content/uploads/2019/07/Blog_customercare_1500x884-1.jpg",
"https://www.smokeci.com/hubfs/Care.jpg",
  ],
    modalImage: "https://www.a1callcenter.com/blog/wp-content/uploads/2023/08/Taking-Customer-Care-Beyond-What-Competitors-Offer.png",
    path:"/services/business/customer-care",
    price: "$4,000/month | Multi-channel support package" ,
    section: "business",
    area: "sales-customer-care"
  },
  "Copyright Registration": {
  title: "Copyright Registration",
  description: "Protect your original works with professional copyright registration services. Ensure your creative content, inventions, and intellectual property are legally recognized and safeguarded.",
  images: [
    "https://www.bigstarcopywriting.com/wp-content/uploads/2015/03/online-copyright.jpg",
    "https://thumbs.dreamstime.com/b/copyright-stamp-13422105.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS92Mf-aPY22iZUH0vz-3p8HQt8L_zrWoYcqw&s"
  ],
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
    description: "Video marketing uses engaging videos to promote brands, products, or services, capturing attention and telling stories in a dynamic way. It boosts reach, increases engagement, and drives conversions by connecting with audiences emotionally and visually across platforms like social media, websites, and ads.",
    images: [
    "https://blog-cms.socialinsider.io/content/images/2024/07/video-marketing-strategy-article-cover.webp",
 " https://noahdigital.ca/wp-content/uploads/2025/04/the-importance-of-videomarketing.jpg",
"https://cdn.prod.website-files.com/63cdd2d1d805d52f99098938/65b8b84a153e785a2911469a_ROI%20Video%20Marketing.png",
  ],
    modalImage: "https://imageio.forbes.com/specials-images/imageserve/5efe00ef531e15000701b33d/Behind-the-scenes-of-a-business-vlog/960x0.jpg?height=474&width=711&fit=bounds",
     path:"/services/digital/video-marketing",
    price: "$8,000 | Campaign video production and distribution " ,
     section: "digital",
    area: "methods-techniques"
  },
 "E-Commerce Marketing": {
    title: "E-Commerce Marketing",
    description: "E-commerce marketing involves strategies to attract, engage, and convert online shoppers through targeted advertising, SEO, email campaigns, and social media. It drives traffic, boosts sales, and builds brand loyalty by delivering personalized experiences tailored to the digital marketplace.",
    images: [
    "https://www.logicinbound.com/wp-content/uploads/2018/01/shutterstock_779835055-1024x737.jpg.webp",
 " https://www.price2spy.com/blog/wp-content/uploads/2019/10/E-commerce-marketing-strategies.png",
"https://verpex.com/assets/uploads/images/blog/How-Has-E-commerce-Transformed-Marketing.webp?v=1724325713",
  ],
    modalImage: "https://altcraft.com/_next/image?url=%2Fimages%2Fuploads%2Fexamples_strategies_of_internet_marketin_83fc7cbfef.png&w=3840&q=75",
     path:"/services/digital/e-commerce-marketing",
    price: "$10,000 | Launch + campaign optimization" ,
     section: "digital",
    area: "methods-techniques"
  },
  "Email Marketing": {
    title: "Email Marketing",
    description: "Email marketing uses targeted, personalized messages to connect with your audience, promote products or services, and build lasting customer relationships. By combining compelling content and strategic design, it drives engagement, boosts sales, and nurtures brand loyalty.",
    images: [
    "https://www.searchenginejournal.com/wp-content/uploads/2024/11/email-marketing-296.png",
 " https://www.piercom.com/wp-content/uploads/2024/06/Email-Marketing.jpg",
"https://eaog2nkqckp.exactdn.com/wp-content/uploads/2024/10/112406_How_to_use_branding_in_your_email_marketing.webp?strip=all&lossy=1&ssl=1",
  ],
    modalImage: "https://blog.blendee.com/wp-content/uploads/2024/11/email-marketing.jpg",
     path:"/services/digital/email-marketing",
    price: "$6,000/year | Setup + automation series" ,
     section: "digital",
    area: "methods-techniques"
  },
  "Email Automations": {
    title: "Email Automations",
    description: "Email automations streamline your marketing by sending personalized, timely messages based on customer behavior and actions. This hands-free approach boosts engagement, nurtures leads, and drives conversions by delivering the right content at the perfect moment, helping you grow your business efficiently.",
   images: [
    "https://cdn.scoreapp.com/site/uploads/2024/07/How-to-set-up-email-marketing-automation-for-your-business.png",
 " https://mailsend.com/images/blog/automated-email-system.png?v=1664367075009506608",
"https://cdn.prod.website-files.com/605826c62e8de87de744596e/6064d721ba47d645037dc49d_The-2021-Guide-to-eCommerce-Email-Sequences-blog-cover.png",
  ],
    modalImage: "https://www.sender.net/wp-content/uploads/2022/01/What-is-Email-Automation.-Definition-Flows-Tools-smaller.png",
    path:"/services/digital/email-automations",
    price: "$7,500/year | Advanced automations" ,
     section: "digital",
    area: "methods-techniques"
  },
  "Community Boosting": {
  title: "Community Boosting",
  description: "Automate your community booasting by scheduling posts, scheduling, and engagement across multiple platforms. Save time while maintaining consistent brand visibility and boosting audience interaction with AI-powered automation tools.",
  images: [
    "https://dmacmedia.com/ie/site/uploads/sys_articles/2748/3d-render-social-media-icon-collection.webp",
    "https://www.shutterstock.com/image-vector/flat-3d-isometric-rocket-flying-600nw-2092578391.jpg",
    "https://seo-hacker.com/wp-content/uploads/2017/10/01r_Boosting-Your-Conversion-Rates-Through-the-Power-of-Effective-Social-Media-Marketing.jpg"
  ],
  modalImage: "https://impactgroupmarketing.com/Portals/0/xBlog/uploads/2020/2/14/iStock-1155073654_2.jpg",
  path: "/services/digital/ommunity-boosting",
  price: "$999 | Customized community boosting" ,
  section: "digital",
  area: "methods-techniques"
},
 
  "Marketing Strategy": {
    title: "Marketing Strategy",
    description: "Marketing strategy is a comprehensive plan that defines how a business reaches its target audience, differentiates itself from competitors, and achieves growth goals. By aligning messaging, channels, and tactics, an effective strategy drives brand awareness, customer engagement, and long-term success.",
    images: [
    "https://tkwresearch.com.au/wp-content/uploads/2023/05/Market-research-role-in-marketing-blog.jpg.webp",
 " https://bs-uploads.toptal.io/blackfish-uploads/components/blog_post_page/9795013/cover_image/retina_1708x683/unnamed-1261b66d20980261d3ada7f462a697e0.jpg",
"https://www.expandgh.com/wp-content/uploads/2017/10/marketing-strategy.jpg",
  ],
    modalImage: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/2bS9Rd8vBFkIcnziIbAqSY/426ec3a30c1f8dfe120bb9dd8a3c324d/GettyImages-1227481145.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
    path:"/services/digital/marketing-strategy",
    price: "$15,000 | Full strategy + implementation roadmap " ,
    section: "digital",
    area: "analytics-strategy"
  },
  "Brand Strategy (SEO)": {
    title: "Brand Strategy (SEO)",
    description: "Brand strategy with SEO integrates search engine optimization to boost your brand’s online visibility and authority. By aligning your brand message with targeted keywords and content, it attracts the right audience, improves search rankings, and strengthens your digital presence for lasting impact.",
    images: [
    "https://jardindeideas.net/wp-content/uploads/2024/05/SEO-FOTO-POST.jpg",
 " https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/1lzDGGzPtEoBZWwfa25ZEx/e153fd22666ea38e7a6e32f938b02df6/GettyImages-579749574.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
"https://static.wixstatic.com/media/84b06e_9e36eb3ff5744954ade0e71a80700fe8~mv2.jpg/v1/fill/w_568,h_324,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/84b06e_9e36eb3ff5744954ade0e71a80700fe8~mv2.jpg",
  ],
    modalImage: "https://orioly.com/wp-content/uploads/2016/11/seo-for-tour-operators-illustration-1.png",
     path:"/services/digital/brand-strategy-(seo)",
    price: " $2,500" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Digital Marketing strategy (SEO)": {
    title: "Digital Marketing strategy (SEO)",
    description: "Digital marketing strategy with SEO focuses on optimizing your online presence to attract organic traffic, improve search engine rankings, and increase conversions. By combining targeted keywords, quality content, and technical optimization, it drives sustainable growth and enhances your brand’s visibility across digital channels.",
    images: [
    "https://www.piercom.com/wp-content/uploads/2019/03/Digital-Marketing-Strategy.jpg",
 " https://duws858oznvmq.cloudfront.net/SEO_Marketing_ac32ea740c.webp",
"https://era9r2jcsww.exactdn.com/wp-content/uploads/2024/02/What-is-the-Importance-of-SEO-in-Digital-Marketing.jpg?strip=all&lossy=1&quality=80&ssl=1",
  ],
    modalImage: "https://blog.bluetuskr.com/hubfs/seo-search-engine-optimization-business-conceptual.jpg",
     path:"/services/digital/digital-marketing-strategy-(seo)",
    price: "$8,000 | SEO audit + 6-month implementation" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Marketing Concepts & Ideation": {
    title: "Marketing Concepts & Ideation",
    description: "Marketing concepts and ideation involve brainstorming and developing creative ideas that shape effective campaigns and strategies. This process fuels innovation by exploring fresh approaches, identifying target audience needs, and crafting unique messages that resonate and drive business growth.",
   images: [
    "https://ideascale.com/wp-content/uploads/2023/06/Ideation-cover-new.jpg",
 "https://diousa.com/wp-content/uploads/2018/09/Experience-Development-Journey-Image.jpg",
"https://www.empowerrd.com/wp-content/uploads/2023/06/ideation-1-Ideation-to-launch-Blog-final-2.svg",
  ],
    modalImage: "https://stg-uploads.slidenest.com/template_786/templateColor_819/previewImages/marketing-concepts-infographic-powerpoint-google-slides-keynote-presentation-template-1.jpg",
     path:"/services/digital/marketing-concepts-&-ideation",
    price: "$10,000 | Creative workshops and deliverables" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Conscious Branding & Marketing (SEO)": {
    title: "Conscious Branding & Marketing (SEO)",
    description: "Conscious branding and marketing with SEO focuses on building authentic, ethical brands that connect deeply with audiences while optimizing for search engines. By blending purpose-driven messaging with strategic SEO practices, it helps businesses grow sustainably, build trust, and stand out in a values-driven market.",
    images: [
    "https://purplecow.digital/wp-content/uploads/2022/07/4-scaled.jpg",
 " https://workshop.yatibusiness.com/wp-content/uploads/2022/05/SEO-article-header-750x449.jpeg",
"https://funtasticwd.ca/wp-content/uploads/2022/12/SEO-1170x576.png",
  ],
    modalImage: "https://thriveagency.com/files/What-Is-Conscious-Marketing-and-Why-It-Is-Important1200x720_011720.png",
    path:"/services/digital/conscious-branding-&-marketing-(seo)",
    price: "$12,000 | Brand positioning + SEO campaign" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Marketing Advice": {
    title: "Marketing Advice",
    description: "Marketing advice offers expert guidance to help businesses develop effective strategies, overcome challenges, and maximize results. Whether you need insights on branding, digital marketing, or customer engagement, personalized advice empowers you to make smart decisions and grow your business confidently.",
  images: [
    "https://online.maryville.edu/wp-content/uploads/sites/97/2020/07/MVU-BSBUSAD-2020-Q1-Skyscraper-Digital-Marketing-Strategy-Key-Components-Tips-to-Get-Started-01.jpg",
 " https://evergreendm.com/wp-content/uploads/2022/12/digital-marketing-strategies.jpg",
"https://digitalboostplus.com/wp-content/uploads/2024/04/01-2.jpg",
  ],
    modalImage: "https://cdn2.hubspot.net/hubfs/53/marketing-advice-1.jpg",
    path:"/services/digital/marketing-advice", 
    price: "$5,000 | Strategic consulting package" ,
     section: "digital",
    area: "analytics-strategy"
  },
  "Music Promotion": {
    title: "Music Promotion",
    description: "Music promotion helps artists get their songs heard by the right audience through targeted marketing, social media campaigns, playlist placements, and influencer outreach. Effective promotion boosts streams, grows fanbases, and builds a strong presence in a competitive music industry.",
    images: [
    "https://pbs.twimg.com/media/GxCGJZBXEAE4jsV.jpg",
 "https://d4musicmarketing.com/wp-content/uploads/2021/02/music-promo-min.jpg",
"https://soundcamps.com/wp-content/uploads/2023/12/best-music-promotion-services-12.png",
  ],
    modalImage: "https://musicreviewworld.com/wp-content/uploads/2022/08/Music-Promotion-Services-Online.webp",
     path:"/services/digital/music-promotion",
    price: "$5,000 | Single/album campaign" ,
     section: "digital",
    area: "industry-purpose-specific"
  },
  "Podcast Marketing": {
    title: "Podcast Marketing",
    description: "Podcast marketing promotes your show by increasing visibility, growing your listener base, and driving engagement through targeted campaigns, social media, and collaborations. Effective marketing helps podcasts stand out, build loyal audiences, and achieve lasting success in a crowded market.",
    images: [
    "https://cdn.prod.website-files.com/685be7dcd32275d383065239/685be7dcd32275d3830680a0_Blog%20Cover_2023_11_14%20Best%20Content%20Marketing%20Podcasts%20to%20Learn%20From%20(2023)%20(1).webp",
 " https://restream.io/blog/content/images/2024/01/how-to-promote-a-podcast.jpg",
"https://images.prismic.io/buzzsprout/782e7c94ec5f65dff6ca90ce9a150da671fb4c03_podcast-marketing.png?auto=compress,format",
  ],
    modalImage: "https://static.vecteezy.com/system/resources/previews/002/157/582/non_2x/podcast-cover-design-template-free-vector.jpg",
     path:"/services/digital/podcast-marketing",
    price: "$4,000 | Launch + promotion strategy" ,
     section: "digital",
    area: "industry-purpose-specific"
  },
  "Mobile App Marketing": {
    title: "Mobile App Marketing",
    description: "Mobile app marketing focuses on attracting, engaging, and retaining users through targeted campaigns, app store optimization, and user acquisition strategies. Effective marketing boosts downloads, increases user engagement, and drives revenue growth in the competitive app marketplace.",
    images: [
    "https://www.proideators.com/wp-content/uploads/2023/02/Learn-How-to-Make-Use-of-Mobile-App-Marketing.jpg",
 " https://cdn.bluent.com/images/promote-your-app.webp",
"https://s44783.pcdn.co/in/wp-content/uploads/sites/3/2023/03/mobile-app-marketing.jpg.optimal.jpg",
  ],
    modalImage: "https://www.goodworklabs.com/wp-content/uploads/2016/12/mobile-app-marketing.jpg",
     path:"/services/digital/mobile-app-marketing",
    price: "$6,000 | App launch campaign" ,
     section: "digital",
    area: "industry-purpose-specific"
  },
  "Book & eBook Marketing": {
    title: "Book & eBook Marketing",
    description: "Book and eBook marketing promotes your work to reach the right readers through targeted campaigns, social media, reviews, and influencer partnerships. Effective marketing increases visibility, boosts sales, and builds a loyal audience for your stories, whether in print or digital formats.",
    images: [
    "https://www.smithpublicity.com/wp-content/uploads/2020/01/ebook-marketing-sm-unsplash.jpg",
 " https://miro.medium.com/v2/resize:fit:1400/0*CoweSjfzrkQh7M74",
"https://www.bluleadz.com/hs-fs/hubfs/Promoting%20an%20ebook%20graphic-1-580655-edited-001624-edited.png?width=550&name=Promoting%20an%20ebook%20graphic-1-580655-edited-001624-edited.png",
  ],
    modalImage: "https://t4.ftcdn.net/jpg/08/75/14/37/360_F_875143782_RXquLCNJw3egkfrPIvhPfijb26vqbksp.jpg", 
    path:"/services/digital/book-&-ebook-marketing",
    price: "$4,500 | Pre-Launch campaign"  ,
     section: "digital",
    area: "industry-purpose-specific"
  },
  "Self-Publish Your Book": {
    title: "Self-Publish Your Book",
    description: "Self-publishing empowers authors to take full control of their book’s creation, distribution, and marketing. From formatting and cover design to digital and print distribution, self-publishing offers a flexible path to share your story with the world and reach readers directly—without traditional gatekeepers.",
    images: [
    "https://assets.blurb.com/pages/website-assets/self-publish/Lane_2_A_Amazon-44a3ef6fd32cbeb4de527418b9e570e72135bf36bd491e455ad3dfdf89f462bb.png",
 " https://blog-cdn.reedsy.com/directories/admin/content_upgrade/66/large_a980334477830d63338362d0ee936113.webp",
"https://images.squarespace-cdn.com/content/v1/582caad246c3c4568a7e562e/1567705946115-HK4TAIK7NVR9F6MB2JNU/Screen+Shot+2019-09-05+at+1.52.10+PM.png",
  ],
    modalImage: "https://www.adazing.com/wp-content/uploads/2018/10/book-cover_template.jpg",
    path:"/services/digital/self-publish-your-book",
    price: "$399 | Package coaching + distribution setup" ,
     section: "digital",
    area: "industry-purpose-specific"
  }
};

const musicServiceDetails = {
  "Voice Over": {
    title: "Voice Over",
    description: "Voice over brings scripts to life with clear, expressive narration that enhances videos, commercials, audiobooks, and more. A skilled voice artist adds personality and emotion, helping your message connect with audiences and leave a lasting impact.",
   images: [
    "https://www.stagemilk.com/wp-content/uploads/2021/08/voice-over-equipment.jpg",
 " https://www.spotlight.com/wp-content/uploads/2023/10/emmanuel-ikwuegbu-n_qhpu-nsyc-unsplash-scaled.jpg",
"https://media.wired.com/photos/62ccad979e1cc6cbc9061ddd/3:2/w_2560%2Cc_limit/Voice-Acting-Video-Games-Culture-GettyImages-1353302248.jpg",
  ],
    modalImage: "https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Afef12484-24df-4ae2-b257-b820c206b6ab?source=next-article&fit=scale-down&quality=highest&width=1440&dpr=1",
    path:"/services/music/voice-over",
    price: "$1,000 | 30-mins commercial narrative" ,
    section: "music",
    area: "voice-over-streaming"
  },
  "Podcast Production": {
    title: "Podcast Production",
    description: "Podcast production handles everything from recording and editing to mixing and publishing, ensuring your show sounds professional and polished. With expert audio quality, seamless storytelling, and technical support, podcast production helps you deliver content that captivates and grows your audience.",
   images: [
    "https://castos.com/wp-content/uploads/2021/05/podcast-production.jpg",
 " https://metapress.com/wp-content/uploads/2024/11/How-to-Streamline-Office-Workflow-With-Automated-Document-Management-1024x576.png",
"https://blog.native-instruments.com/wp-content/uploads/dynamic/2020/01/top-10-music-production-podcasts-hero-1200x0-c-default.jpg",
  ],
    modalImage: "https://muddhousemedia.com/wp-content/uploads/2022/10/shutterstock_583624615-scaled.jpg",
    path:"/services/music/podcast-production",
    price: "$3,500 | Full 8-episode show production " ,
    section: "music",
    area: "voice-over-streaming"
  },
  "Audiobook Production": {
    title: "Audiobook Production",
    description: "Audiobook production transforms your written work into a high-quality listening experience through professional narration, sound editing, and mastering. From voice casting to final delivery, expert production ensures your audiobook is clear, immersive, and ready for platforms like Audible, iTunes, and more.",
   images: [
    "https://images.squarespace-cdn.com/content/v1/57f66a16e4fcb5154dc8ba39/49e0f180-a02c-4f7f-89ec-39ceebf42b97/1.jpg",
 "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/blogs/2147484495/images/ed036bf-4af-cd4-042a-cb431d8b4e_DIY_Audiobook_-_Recording_Editing_and_Mastering_Tips.png",
"https://blog.libro.fm/wp-content/uploads/How-Do-Audiobooks-Get-Made-Cover.jpg",
  ],
    modalImage: "https://images.ctfassets.net/f4cbid0mhigx/1Aq8RDW5EZbkbdVwwKmpQg/0ef91254515f8c390f6e759f41103782/adobestock_2980931252.jpeg",
     path:"/services/music/audiobook-production", 
    price: "$5,000 | 10-hr audiobook" ,
      section: "music",
    area: "voice-over-streaming"
  },
  "Audio Ads Production": {
    title: "Audio Ads Production",
    description: "Audio ads production creates compelling, high-quality sound ads designed to capture attention on platforms like Spotify, podcasts, and radio. From scriptwriting to voiceover and sound design, professional audio ads deliver your message clearly and creatively, driving brand awareness and listener action.",
   images: [
    "https://media.licdn.com/dms/image/v2/C4E12AQFd62u-nxC5rA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1567603524706?e=2147483647&v=beta&t=H6UrOUQ1QfeEi_7Z5QOjCnf-53HfzsIr1NeePyCuQPY",
 " https://techcrunch.com/wp-content/uploads/2022/03/GettyImages-899910422.jpg",
"https://fiverr-res.cloudinary.com/t_main1,q_auto,f_auto/gigs2/99966831/original/2af2d6ff4c5a95b87fa2946faacc51af5c2245c1.jpg",
  ],
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
    description: "Website development involves building fast, functional, and user-friendly websites that represent your brand and support your business goals. From custom design to responsive coding and seamless user experience, professional website development ensures your site looks great, performs smoothly, and converts visitors into customers.",
     images: [
    "https://xbsoftware.com/wp-content/uploads/2023/03/website-development-process-full-guide-1-fb.jpg",
 "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/10/Website-Development.jpg",
"https://mojodesign.io/wp-content/uploads/2023/12/Screenshot_7.jpeg",
  ],
    modalImage: "https://www.imaginetventures.com/wp-content/uploads/2024/01/5467393_1687-scaled.jpg",
     path:"/services/programming/website-development",
    price: "$10,000 | 10-page custom website" ,
     section: "programming",
    area: "websites"
  },
  "Website Maintenance": {
    title: "Website Maintenance",
    description: "Website maintenance ensures your site stays secure, up-to-date, and fully functional. It includes regular updates, bug fixes, backups, performance checks, and security monitoring, keeping your website running smoothly, improving user experience, and protecting your online presence.",
     images: [
    "https://www.siteuptime.com/blog/wp-content/uploads/2019/06/b51d33623cb435cd8cc7610cac2b9b44.jpeg",
 " https://www.airwebsolutions.com/wp-content/uploads/2021/07/shutterstock_379863757-scaled.jpg",
"https://www.iowebstudio.com/wp-content/uploads/2023/11/How-to-Sell-Website-Maintenance-Services.jpg",
  ],
    modalImage: "https://wpactivethemes.com/wp-content/uploads/2024/01/Law-Website-Under-Maintenance-1024x538-1.jpg",
     path:"/services/programming/website-maintenance",
    price: "$3,000/year | Updates & hosting" ,
     section: "programming",
    area: "websites"
  },
  "WordPress": {
    title: "WordPress",
    description: "WordPress is a powerful and flexible content management system (CMS) used to build and manage websites with ease. Whether for blogs, business sites, or online stores, WordPress offers thousands of themes and plugins, allowing for fully customizable, responsive, and SEO-friendly websites, without needing to code.",
    images: [
    "https://www.eurodns.com/assets/images/blog-images/_blogOptimizedImage/21199/wordpress.jpg",
 " https://wordpress.org/documentation/files/2022/01/Appearance-Themes-showing-block-themes-1024x517.png",
"https://www.bitcatcha.com/wp-content/uploads/2024/07/customize-the-appearance.png",
  ],
    modalImage: "https://www.digitalsilk.com/wp-content/uploads/2024/05/Digital-Silk-Blog-hero-image-1200x675-V2-36.jpg",
     path:"/services/programming/wordpress",
    price: "$7,500 | WP site setup + themes /plugins " ,
     section: "programming",
    area: "websites"
  },
  "Custom Websites": {
    title: "Custom Websites",
    description: "Custom websites are tailor-made to match your brand, goals, and functionality needs, offering complete design freedom and a unique user experience. Unlike templates, custom sites are built from the ground up for performance, scalability, and visual impact, helping your business stand out and grow online.",
    images: [
    "https://uicreative.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2021/03/03010701/auto-draft-126-1024x683.jpg",
 " https://uicreative.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2021/03/03010617/auto-draft-123-1024x683.jpg",
"https://qualitapps.com/wp-content/uploads/2023/09/821783218-2.jpg",
  ],
    modalImage: "https://www.blackboxdesign.com.au/wp-content/uploads/2022/02/Custom-web-design-vs-template-web-design-scaled.jpg",
    path:"/services/programming/custom-websites",
    price: "$15,000 | Bespoke site with advanced features" ,
    section: "programming",
    area: "websites"
  },
  "Portfolio": {
  title: "Portfolio",
  description: "Showcase your skills, projects, and achievements with a professional portfolio website. Built from the ground up for performance, scalability, and visual impact, each site is custom-tailored to reflect your brand and help you stand out online.",
  images: [
    "https://uicreative.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2021/03/03010701/auto-draft-126-1024x683.jpg",
    "https://uicreative.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2021/03/03010617/auto-draft-123-1024x683.jpg",
    "https://qualitapps.com/wp-content/uploads/2023/09/821783218-2.jpg"
  ],
  modalImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  path: "/services/programming/portfolio",
  price: "$999 | Bespoke site with advanced features",
  section: "programming",
  area: "websites"
},
  "Web Applications": {
    title: "Web Applications",
    description: "Web applications are interactive, browser-based software solutions designed to perform specific functions or services online. From dashboards and booking systems to e-commerce platforms and SaaS tools, web apps offer seamless user experiences, real-time data access, and cross-device compatibility to boost efficiency and engagement.",
    images: [
    "https://miro.medium.com/v2/resize:fit:1400/1*j0gjLpN1aaHuRowTKgr6yQ.jpeg",
 " https://www.bespokesoftwaredevelopment.com/blog/wp-content/uploads/2016/04/Web_Application_Development.jpg",
"https://networkencyclopedia.com/wp-content/uploads/2019/09/web-application-architecture.png",
  ],
    modalImage: "https://b1694534.smushcdn.com/1694534/wp-content/uploads/2021/12/NOHO.jpg?lossy=1&strip=1&webp=1",
   path:"/services/programming/web-applications",
    price: "$25,000 | Full-stack web app" ,
   section: "programming",
    area: "application-development"
  },
  "Desktop Applications": {
    title: "Desktop Applications",
    description: "Desktop applications are software programs installed directly on a computer, designed for high performance, offline access, and robust functionality. Ideal for tasks that require speed, security, and heavy processing, custom desktop apps offer tailored solutions for businesses, creatives, and technical users alike.",
    images: [
    "https://5.imimg.com/data5/SELLER/Default/2021/6/HU/RJ/LM/26476262/desktop-application-development.png",
 " https://www.valuecoders.com/blog/wp-content/uploads/2020/11/Types-of-Desktop-Application-Development-Frameworks-scaled.jpg.webp",
"https://www.valuecoders.com/blog/wp-content/uploads/2020/11/What-is-Desktop-Application_-scaled.jpg.webp",
  ],
    modalImage: "https://img.freepik.com/free-vector/smart-home-management-laptop-screen-app_23-2148639320.jpg?semt=ais_hybrid&w=740",
    path:"/services/programming/desktop-applications",
    price: "$20,000 | Desktop software package" ,
    section: "programming",
    area: "application-development"
  },
  "Software Development": {
    title: "Software Development",
    description: "Software development is the process of designing, building, and maintaining custom applications tailored to solve specific problems or meet unique business needs. From mobile and web apps to enterprise systems, professional software development ensures scalable, secure, and efficient solutions that drive innovation and growth.",
     images: [
    "https://kms-solutions.asia/wp-content/uploads/top-6-types-of-software-development-you-should-know.webp",
 "https://ncube.com/wp-content/uploads/2020/02/Top-8-Software-Development-Models.jpg",
"https://media.istockphoto.com/photos/closeup-focus-on-persons-hands-typing-on-the-desktop-computer-backlit-picture-id1356364287?b=1&k=20&m=1356364287&s=170667a&w=0&h=tUdqxKA9YwL4M57YRZzP1GTEpXcUm5-onFeQnsMg10A=",
  ],
    modalImage: "https://www.slidegeeks.com/media/catalog/product/cache/1280x720/C/r/Crm_Software_Web_Development_Project_Plan_Guidelines_PDF_Slide_1_1.jpg",
    path:"/services/programming/software-development",
    price: "$30,000 | Custom software with backend" ,
    section: "programming",
    area: "software-development"
  },
  "Scripting": {
    title: "Scripting",
    description: "Scripting involves writing code to automate tasks, enhance functionality, or streamline processes across software, websites, and systems. Whether it's for web development, data processing, or app integration, scripting improves efficiency and enables powerful custom solutions with minimal manual input.",
     images: [
    "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/PkItlNjtEJyTY85HF8Rvg/f357fbed82f6df61bfd2ed677ee35fc6/GettyImages-1354692508__1_.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
 "https://www.santanderopenacademy.com/en/blog/Scripting-language/_jcr_content/root/container/responsivegrid/image_1634859508.coreimg.jpeg/1707813935988/scripting-3.jpeg",
"https://www.orientsoftware.com/Themes/Content/Images/blog/2024-05-28/server-side-languages-what-is.webp",
  ],
    modalImage: "https://docs.flaxengine.com/manual/scripting/visual/media/vs-sample.png",
    path:"/services/programming/scripting",
    price: "$5,000 | Automation or script package " ,
    section: "programming",
    area: "software-development"
  },
  "Plugins Development": {
    title: "Plugins Development",
    description: "Plugins development creates custom add-ons that extend the functionality of existing software or platforms like WordPress, browsers, or applications. By building tailored plugins, businesses can enhance features, improve user experience, and adapt tools to specific needs without altering the core system.",
    images: [
    "https://wpconnect.co/wp-content/uploads/2023/02/start-wordpress-plugin-development-3-1200x720.jpg",
 " https://bluegrid.io/wp-content/uploads/2021/05/wordpress-plugin-development.jpg",
"https://wpengine.com/wp-content/uploads/2022/10/Shutterstock_1590824893-1-1024x535.jpg",
  ],
    modalImage: "https://wpbuffs.com/wp-content/uploads/2020/03/AdobeStock_490335761-1024x576.jpeg",
    path:"/services/programming/plugins-development",
    price: "$7,000 | CMS/plugin development" ,
    section: "programming",
    area: "software-development"

  },
  "Mobile App Development": {
    title: "Mobile App Development",
    description: "Mobile app development designs and builds custom applications for smartphones and tablets, delivering seamless user experiences on iOS and Android platforms. From concept to launch, expert development ensures apps are fast, intuitive, and packed with features that engage users and drive business growth.",
     images: [
    "https://www.addevice.io/storage/ckeditor/uploads/images/65f840d316353_mobile.app.development.1920.1080.png",
 "https://api.reliasoftware.com/uploads/the_complete_guide_to_mobile_app_development_2021_ded2abd1b1.png",
"https://www.binaryfolks.com/media/blog/Reasons%20to%20build%20a%20mobile%20app/4428861.png",
  ],
    modalImage: "https://www.mindinventory.com/blog/wp-content/uploads/2023/12/mobile-app-development-trends.webp",
    path:"/services/programming/mobile-app-development",
    price: "$30,000 | Native iOS/Android app" ,
    section: "programming",
    area: "mobile-apps"
  },
  "Cross-platform Apps": {
    title: "Cross-platform Apps",
    description: "Cross-platform apps are designed to run smoothly on multiple operating systems like iOS and Android using a single codebase. This approach saves time and cost while delivering consistent performance and user experience across devices, perfect for reaching a wider audience quickly and efficiently.",
     images: [
    "https://miro.medium.com/v2/resize:fit:710/1*hMXi6r4WxFLYX08rK3CSTQ.png",
 " https://d1krbhyfejrtpz.cloudfront.net/blog/wp-content/uploads/2018/09/07170744/Cross-Development-App-Development-1024x429.jpg",
"https://cdn-images-1.medium.com/max/1200/0*ohYNJlSqTo7RDGol.jpg",
  ],
    modalImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSWx3kq1uj3Di79hy63MUj3w-q1pMPHSxkTA&s",
    path:"/services/programming/cross-platform-apps",
    price: "$25,000 | React Native/Flutter app" ,
    section: "programming",
    area: "mobile-apps"
  },
  "Mobile App Maintenance": {
    title: "Mobile App Maintenance",
    description: "Mobile app maintenance ensures your app stays up-to-date, secure, and bug-free after launch. It includes regular updates, performance optimization, compatibility fixes, and user support, helping your app run smoothly, adapt to new OS versions, and keep users engaged long-term.",
     images: [
    "https://www.mindinventory.com/blog/wp-content/uploads/2022/10/mobile-app-maintenace.jpg",
 " https://cedcoss.com/wp-content/uploads/2023/06/Mobile-App-maintenance.jpg",
"https://www.biztechcs.com/wp-content/uploads/2021/07/OG-Complete-Guide-on-Mobile-App-Maintenance-jpg-webp.webp",
  ],
    modalImage: "https://orafox.com/wp-content/uploads/2024/05/app-maintenance.jpg",
    path:"/services/programming/mobile-app-maintenance",
    price: "$8,000/year | Updates + bug fixes " ,
    section: "programming",
    area: "mobile-apps"
  },
  "Support & IT": {
    title: "Support & IT",
    description: "Support & IT services provide technical assistance and infrastructure management to keep your business technology running smoothly. From troubleshooting and network setup to cybersecurity and system upgrades, reliable IT support ensures minimal downtime, enhanced productivity, and secure operations.",
     images: [
    "https://itsupportserviceslondon.weebly.com/uploads/1/4/2/5/142503779/1_orig.jpg",
 " https://bairesdev.mo.cloudinary.net/blog/2023/10/IT-Maintenance-Support.jpg?tx=w_1920,q_auto",
"https://www.bitrebels.com/wp-content/uploads/2019/01/10-vital-it-support-article-image.png",
  ],
    modalImage: "https://adventus.com/resources/ck/images/Blog/Whats-IT-Support.jpg",
    path:"/services/programming/support-&-it",
    price: "$10,000/year | Helpdesk + support" ,
    section: "programming",
    area: "it-support"
  },
  "Cloud Computing": {
    title: "Cloud Computing",
    description: "Cloud computing delivers scalable, on-demand access to computing resources like servers, storage, and software over the internet. It enables businesses to increase flexibility, reduce costs, and improve collaboration by leveraging virtual infrastructure and services without the need for physical hardware.",
    images: [
    "https://wac-cdn.atlassian.com/dam/jcr:0f791cd5-c80c-4641-b10c-09c9c9b9a8b7/Cloud%20computing.png?cdnVersion=2841",
 " https://www.future-processing.com/blog/wp-content/uploads/2023/07/Cloud-Computing-Basics.png",
"https://cdn2.free-power-point-templates.com/articles/wp-content/uploads/2012/05/cloud-computing.jpg",
  ],
    modalImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz0w7MylN4m2JriAy_6Kl65xIM0yAgMzTeRQ&s",
    path:"/services/programming/cloud-computing",
    price: "$15,000 | Cloud migration + setup" ,
    section: "programming",
    area: "it-support"
  },
  "Convert Files": {
    title: "Convert Files",
    description: "File conversion services quickly and accurately transform your documents, images, audio, or video files into different formats to meet your needs. Whether for compatibility, editing, or sharing, seamless file conversion ensures your content is ready to use across various platforms and devices.",
     images: [
    "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/102108042/original/0bd86b51f4f9c8ea2cb8f937e1ebe23448d49065/convert-files-to-editable-docx-and-make-templates.jpg",
 " https://fiverrbox.com/wp-content/uploads/2022/09/image_2022_09_07T20_01_56_811Z-d1aa8472.png",
"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/file-conversion-design-template-e4d8b3adef700ac5c8c250d9fa47ce1d_screen.jpg?ts=1737625406",
  ],
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
    description: "Video editing transforms raw footage into polished, engaging content by trimming, adding effects, sound, and transitions. Whether for social media, marketing, or personal projects, professional video editing brings your vision to life and captures your audience’s attention.",
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
    description: "Visual effects (VFX) enhance videos and films by adding digital elements like animations, explosions, and environments that can’t be captured on camera. Expert VFX bring imagination to life, creating immersive, breathtaking visuals that elevate storytelling and captivate audiences.",
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
    description: "Video art blends visuals, motion, and sound to create expressive, experimental pieces that push the boundaries of traditional storytelling. It’s an artistic medium used to evoke emotions, challenge perspectives, and transform video into unique, captivating experiences.",
    modalImage: "https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FBOqYXj9vufwvGsU81wfvvw%2Fnormalized.jpg&width=910",
    path:"/services#editing-post-production",  
    price: "$8,000 | Creative video art project" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/vad1.mp4", // Local video path
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
    description: "Intro and outro videos add professional flair to your content by creating memorable openings and impactful closings. Designed to boost brand recognition and viewer engagement, these short clips set the tone and leave a lasting impression on your audience.",
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
    description: "Video templates editing lets you customize pre-made video designs quickly and easily, saving time while maintaining professional quality. Perfect for social media, promos, or presentations, it helps you create polished videos that match your brand without starting from scratch.",
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
    description: "Subtitles and captions make your videos accessible and engaging by displaying spoken dialogue and important sounds as text. They improve comprehension, reach wider audiences, including those with hearing impairments, and boost viewer retention across platforms.",
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
    description: "Video arts & commercials combine creative storytelling with compelling visuals to captivate audiences and promote brands effectively. Whether through artistic expression or targeted advertising, these videos inspire emotion, build brand identity, and drive viewer action.",
    modalImage: "https://www.thedvigroup.com/wp-content/uploads/2023/02/Person-Watching-the-Best-Video-Ads-Examples-on-a-Smartphone-172190875_l-1-2048x1118.jpg",
    path:"/services/video/video-arts-&-commercials",  
    price: "$4,500" ,
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
    description: "Social media videos are short, impactful clips designed to capture attention and boost engagement on platforms like Instagram, TikTok, and Facebook. With eye-catching visuals and clear messaging, they help brands connect with audiences, increase reach, and drive action quickly.",
    modalImage: "https://vidico.com/app/uploads/2022/08/Screenshot-2022-08-22-at-17.22.11.png",
    path:"/services/video/social-media-videos",
    price: "$1,200" ,
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
        // title: "Editing Sample 3", 
        videoFile: "/Videos/socmed3.mp4",
        thumbnail: "/video-thumbnails/Fulfill-First.png"
      }
    ],section: "video",area:"social-marketing-videos"
  },
  "Music Videos": {
    title: "Music Videos",
    description: "Music videos bring songs to life by combining creative visuals, storytelling, and performance to engage fans and amplify the artist’s message. They boost song popularity, enhance branding, and create memorable experiences that resonate with audiences worldwide.",
    modalImage: "https://v13.net/wp-content/uploads/quarantine_music_video_feature.png",
     path:"/services/video/music-videos",
    price: "$6,000" ,
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
    description: "Slideshow videos turn your photos and images into engaging, dynamic presentations with smooth transitions, music, and text. Perfect for events, marketing, or storytelling, they create memorable visual journeys that capture attention and emotions.",
    modalImage: "https://placeit-assets0.s3-accelerate.amazonaws.com/custom-pages/slideshow-maker/slideshow_videomaker.png",
      path:"/services/video/slideshow-videos",
    price: "$800" ,
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
    description: "Animated explainers use engaging visuals and storytelling to simplify complex ideas, products, or services. Perfect for marketing, training, or onboarding, these videos capture attention, boost understanding, and drive action with creativity and clarity.",
    modalImage: "https://animationexplainers.com/wp-content/uploads/2021/08/Animation-Explainers-Hero-Video-2.png",
    path:"/services/video/animated-explainers", 
    price: "$3,000" ,
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
    description: "Live action explainer videos use real people and settings to clearly demonstrate products, services, or concepts. They build trust and connection by showing authentic interactions, making complex ideas easy to understand and relatable for your audience.",
    modalImage: "https://fiverr-res.cloudinary.com/videos/so_29.49223,t_main1,q_auto,f_auto/wrwhmmot4gynuiwtojaw/make-tv-style-commercial-or-promo.png",
    path:"/services/video/live-action-explainers",  
    price: "$4,000" ,
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
    description: "Screencasting videos capture your screen activity to demonstrate software, tutorials, or presentations with step-by-step guidance. Ideal for training, product demos, or support, they provide clear, visual instructions that help users learn quickly and effectively.",
    modalImage: "https://www.qualitymatters.org/sites/default/files/article-faq-images/screencasting-750px.png",
    path:"/services/video/screencasting-videos",  
    price: "$1,200" ,
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
    description: "Character animation brings drawings or 3D models to life with movement and personality, telling stories that captivate and entertain. Used in films, games, and commercials, it creates memorable characters that connect emotionally with audiences and enhance storytelling.",
    modalImage: "https://darvideo.tv/wp-content/uploads/Character-Animation.jpg",
    path:"/services/video/character-animation",  
    price: "$5,000" ,
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
    description: "Animated GIFs are short, looping animations perfect for grabbing attention, expressing emotions, or enhancing social media and messaging. They add fun, shareability, and visual flair to your content—making your brand more engaging and memorable.",
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
    description: "Animation for kids combines colorful visuals, fun characters, and engaging stories to educate and entertain young audiences. Designed to spark imagination and learning, these animations create joyful experiences that capture children’s attention and inspire creativity.",
    modalImage: "https://media.istockphoto.com/id/1406654109/vector/happy-multicultural-children-hold-a-blank-poster-template-for-advertising-brochure-cute.jpg?s=170667a&w=0&k=20&c=5AREDRg0OTAraCqUPigtbkBGFwsKULeL5yK1L6_kMmU=",
    path:"/services/video/animation-for-kids",  
    price: "$4,000" ,
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
    description: "Animation for streamers adds dynamic visuals like alerts, overlays, and emotes that bring energy and personality to live streams. These custom animations help engage viewers, build a unique brand, and create a memorable streaming experience that stands out.",
    modalImage: "https://www.enzeefx.com/wp-content/uploads/2023/02/1080p.00_00_45_09.Still261.jpg",
    path:"/services/video/animation-for-streamers",  
    price: " $2,000" ,
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
    description: "Product animations in 2D, 3D, 4D, and 6D bring your products to life by showcasing features, functionality, and design from every angle. From simple flat visuals to immersive multi-dimensional experiences, these animations help explain complex details, captivate customers, and boost sales.",
    modalImage: "https://cdn.motiondesign.school/uploads/2021/06/Full_HD_Cover_2d_to_3d.png",
    path:"/services/video/2d,-3d,-4d-&-6d-product-animation",  
    price: "$7,000" ,
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
    description: "E-commerce product videos showcase your items in action with clear visuals, close-ups, and demonstrations. They build trust, highlight key features, and help customers make confident purchase decisions—boosting conversions and reducing returns for your online store.",
    modalImage: "https://www.contentbeta.com/wp-content/uploads/2024/05/Best-eCommerce-Product-Videos-Examples.webp",
    path:"/services/video/e-commerce-product-videos",  
    price: " $2,000" ,
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
    description: "Corporate videos communicate your company’s values, culture, and services through compelling storytelling and visuals. Whether for internal training, branding, or client presentations, these videos build trust, enhance reputation, and engage stakeholders effectively.",
    modalImage: "https://d9pfvpeevxz0y.cloudfront.net/blog/wp-content/uploads/2023/05/Blog_050823-1200x675.jpg",
    path:"/services/video/corporate-videos",  
    price: " $4,000" ,
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
    description: "Logo animation brings your brand identity to life with dynamic motion and creative effects. Perfect for intros, outros, and social media, animated logos grab attention, enhance brand recall, and add a professional touch to your videos and presentations.",
    modalImage: "https://cdn.shopify.com/s/files/1/1095/6418/articles/Types_of_Logo_Animations.webp?v=1667298813",
    path:"/services/video/logo-animation",  
    price: "$1,200" ,
        sampleVideos: [
      {
        // title: "Editing Sample 1",
        videoFile: "/Videos/logo1.mp4", // Local video path
        thumbnail: "/video-thumbnails/Fulfill-First.png" // Local thumbnail
      },
      {
        // title: "Editing Sample 2", 
        videoFile: "/Videos/logo2.mp4",
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
    description: "Lottie and web animations use lightweight, scalable vector graphics to create smooth, interactive animations for websites and apps. They enhance user experience with fast-loading, visually engaging effects that boost engagement without slowing down performance.",
    modalImage: "https://orpetron.com/wp-content/uploads/2023/05/Creative-Dreams-1-.png",
    path:"/services/video/lottie-&-web-animation",  
    price: " $1,500" ,
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
    description: "Text animation adds dynamic motion to your words, making headlines, titles, and messages more engaging and eye-catching. Perfect for videos, presentations, and websites, it enhances communication by drawing attention and emphasizing key points with style.",
    modalImage: "https://www.animaker.com/static_2.0/img/textanimationmaker/text_animation_ogimage.png",
    path:"/services/video/text-animation",  
    price: "$900" ,
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
    description: "Filmed video production captures real-life footage with expert cinematography, lighting, and sound to create compelling videos for marketing, events, documentaries, and more. From planning to post-production, it delivers high-quality content that tells your story and connects with your audience.",
    modalImage: "https://www.uscreen.tv/wp-content/uploads/2018/11/Ultimate-video-production-equipment.jpg",
    path:"/services/video/filmed-video-production",  
    price: " $5,000" ,
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
    description: "Videography is the art of capturing moments on camera to create engaging and visually stunning videos. Whether for events, commercials, or storytelling, expert videography combines composition, lighting, and movement to produce compelling content that resonates with viewers.",
    modalImage: "https://www.nyu.edu/content/nyu/en/life/arts-culture-and-entertainment/nyu-tv/video-production-services/jcr:content/1/par-left/nyuimage.img.320.medium.jpg/1628785323568.jpg",
    path:"/services/video/videography",  
    price: "$3,000" ,
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
    description: "Article to video transforms your written content into engaging videos with visuals, narration, and animations. This powerful format boosts audience reach, improves content retention, and brings your stories or information to life across digital platforms.",
    modalImage: "https://sendshort.ai/wp-content/uploads/2024/12/Turning-an-article-into-a-video.jpg",
    path:"/services/video/article-to-video",  
    price: "$1,200" ,
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
    description: "Book trailers are short, cinematic videos that bring your book’s story and themes to life, captivating potential readers with visuals, music, and narration. They create buzz, build anticipation, and help your book stand out in a crowded market.",
    modalImage: "https://lightmv.com/wp-content/uploads/2019/05/create-book-trailer-20190508.jpg",
    path:"/services/video/book-trailers",  
    price: " $2,500" ,
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
    description: "Articles and blog posts deliver valuable, well-researched content that informs, entertains, and engages your target audience. Crafted with SEO best practices, they boost your online presence, drive traffic, and establish your brand as an authority in your industry.",
    images: [
    "https://twinsmommy.com/wp-content/uploads/2019/01/BLOG-POST-488x405.png",
 "https://api.backlinko.com/app/uploads/2019/12/the-classic-list-post.png",
"https://ceblog.s3.amazonaws.com/wp-content/uploads/2022/11/09160815/8-Examples-of-Blog-Post-Templates-2.png",
  ],
    modalImage: "https://brands-up.ch/public/images/uploads/97bc703442fa9a38ed92e3047355fb18486c1219.png",
    path:"/services/writing/articles-&-blog-posts",  
    price: "$250" ,
      section: "writing",area:"content-writing"
  },
 "Content Strategy": {
    title: "Content Strategy",
    description: "Content strategy plans and guides the creation, delivery, and management of meaningful content that attracts and retains your target audience. By aligning content with business goals and user needs, it drives engagement, builds brand authority, and boosts conversions.",
    images: [
    "https://images.ctfassets.net/zqoz8juqulxl/ZeBDDWtgwZSq6LKUl7JPL/f448ba5e6f7c9573cf19ca67487cef3f/contentstrategy-thumb-web.png",
 " https://static.semrush.com/blog/uploads/media/07/49/07493fbf6e13d04dc16cc34cb84de688/70db8c2e6704f0877ef59da6c4190d23/original.png",
"https://enwpgo.files.wordpress.com/2022/11/image-56.png?w=800",
  ],
    modalImage: "https://www.salesforce.com/ca/blog/wp-content/uploads/sites/12/2023/10/content-strategy-open-graph.jpg",
    path:"/services/writing/content-strategy",  
    price: "$1,200" ,
      section: "writing",area:"content-writing"
  },
  "Website Content": {
    title: "Website Content",
    description: "Website content delivers clear, engaging, and SEO-friendly text that tells your brand story and guides visitors toward action. From homepage to product pages, well-crafted content builds trust, boosts search rankings, and enhances user experience.",
    images: [
    "https://images.milanote.com/milanote/9e482ced-bea7-46e1-be0b-bc4c1303c171_Website-content-plan-example.png?auto=compress,format",
 " https://linkdoctor.io/wp-content/uploads/2021/05/templatemo-example-1-1024x763.png",
"https://linkdoctor.io/wp-content/uploads/2021/05/website-template-example-1024x816.png",
  ],
    modalImage: "https://contentcloudhq.com/wp-content/uploads/2020/01/website-content.jpg",
    path:"/services/writing/website-content",  
    price: "$800" ,
      section: "writing",area:"content-writing"
  },
  "Scriptwriting": {
    title: "Scriptwriting",
    description: "Scriptwriting crafts compelling, clear, and engaging scripts for videos, commercials, podcasts, and presentations. With strong storytelling and audience focus, great scripts bring your message to life and drive action effectively.",
   images: [
    "https://pageturnerawards.com/sites/default/files/inline-images/how-to-format-a-screenplay-3-724x1024.png",
 " https://i.pinimg.com/564x/e7/e8/53/e7e85336d3a113098411f25240e839bf.jpg",
"https://i.pinimg.com/736x/22/62/5e/22625eded264e951a57c7a3b778ce3c9.jpg",
  ],
    modalImage: "https://avconsultants.com/wp-content/uploads/2021/12/scriptwriting-scaled.jpg",
    path:"/services/writing/scriptwriting",  
    price: "$1,000" ,
      section: "writing",area:"content-writing"
  },
  "Creative Writing": {
    title: "Creative Writing",
    description: "Creative writing sparks imagination through storytelling, poetry, and expressive prose that captivates readers and evokes emotion. Whether for books, scripts, or marketing, it transforms ideas into memorable and impactful content.",
    images: [
    "https://atarnotes.com/wordpress/wp-content/uploads/2016/03/Gary-Provost-e1457059098777.jpg",
 " https://img.poemhunter.com/i/poem_images/949/creative-writing-3.jpg",
"https://englishgcse.co.uk/cdn/shop/products/Slide1_d30b1217-ab15-4dd8-94da-1c759ee96fb4.png?v=1647893972",
  ],
    modalImage: "https://www.bolton.ac.uk/assets/Uploads/Picture1-v39.png",
    path:"/services/writing/creative-writing",  
    price: "$900" ,
      section: "writing",area:"content-writing"
  },
  "Podcast Writing": {
    title: "Podcast Writing",
    description: "Podcast writing crafts compelling scripts and outlines that keep your episodes focused, engaging, and easy to follow. Whether for interviews, storytelling, or educational content, well-written podcasts connect with listeners and build loyal audiences.",
   images: [
    "https://images.milanote.com/milanote/be7d1c48-e8b6-40d4-9296-fa7940229d08_Podcast-research-example.png?auto=compress,format",
 " https://images.milanote.com/milanote/40fa1b38-4e29-443d-be53-5dbdbfdcf8b9_Podcast-outline-example.png?auto=compress,formatg",
"https://images.milanote.com/milanote/ed3c2582-c81e-4fb0-957e-7317523851ff_Podcast-script-example.png?auto=compress,format",
  ],
    modalImage: "https://images.prismic.io/buzzsprout/d513dfac-dd09-44df-8d99-5996ab989db6_show-notes.png?auto=compress,format",
    path:"/services/writing/podcast-writing",  
    price: "$700" ,
      section: "writing",area:"content-writing"
  },
  "Speechwriting": {
    title: "Speechwriting",
    description: "Speechwriting creates powerful, clear, and persuasive speeches tailored to your voice and audience. Whether for business presentations, events, or public speaking, expertly crafted speeches inspire confidence, engage listeners, and leave a lasting impression.",
    images: [
    "https://www.sbwriting.com/images/speechwriting-1.jpg",
 " https://images.twinkl.co.uk/tw1n/image/private/t_630_eco/image_repo/b7/85/seventh-grade-how-to-write-a-speech-activity-us-e-1724725624_ver_1.jpg",
"https://thumbs.dreamstime.com/b/speechwriting-web-banner-landing-page-professional-speaker-journalist-write-content-public-announcement-copywriter-224823417.jpg",
  ],
    modalImage: "https://www.prdaily.com/wp-content/uploads/2024/01/iStock-1348871022.jpg",
    path:"/services/writing/speechwriting",  
    price: " $1,000" ,
      section: "writing",area:"content-writing"
  },
  "Research & Summaries": {
    title: "Research & Summaries",
    description: "Research & summaries deliver thorough information gathering and clear, concise overviews that save you time and provide key insights. Perfect for reports, articles, or decision-making, they turn complex data into easy-to-understand content.",
   images: [
    "https://images.examples.com/wp-content/uploads/2018/03/ExampleResearchSummary-1.jpg",
 " https://www.slideteam.net/wp/wp-content/uploads/2023/11/Sample-Research-Paper-Outline-in-One-Page-Summary.png",
"https://mir-s3-cdn-cf.behance.net/projects/404/2a245f72412463.Y3JvcCw4MDgsNjMyLDAsMA.png",
  ],
    modalImage: "https://www.loop11.com/wp-content/uploads/2023/06/How-to-undertake-effective-user-testing-in-multiple-languages-Loop11.webp",
    path:"/services/writing/research-&-summaries",  
    price: "$400" ,
      section: "writing",area:"content-writing"
  },
  "Blurb": {
    title: "Blurb",
    description: "Professional book blurbs that grab attention, build intrigue, and entice readers to explore more. Perfect for the back cover, online listings, or marketing campaigns—crafted to boost your book’s appeal and sales.",
    images: [
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ],
    modalImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    path: "/services/writing/blurb-writing",
    price: "$500",
    section: "writing",
    area: "content-writing"
  },
  "Proofreading & Editing": {
    title: "Proofreading & Editing",
    description: "Proofreading and editing ensure your content is polished, error-free, and clear. From grammar and spelling to style and consistency, expert editing sharpens your message and enhances readability for maximum impact.",
   images: [
    "https://londonproofreaders.co.uk/wp-content/uploads/2018/05/politics-sample.png",
 " https://www.editmyenglish.com/images/samples_edited.jpg",
"https://londonproofreaders.co.uk/wp-content/uploads/2018/05/art-history-sample-1.png",
  ],
    modalImage: "https://harvardproofreader.co.za/wp-content/uploads/2023/11/istockphoto-184928153-612x612-1.jpg",
    path:"/services/writing/proofreading-&-editing",  
    price: "$300" ,
      section: "writing",area:"editing-critique"
  },
  "Writing Advice": {
    title: "Writing Advice",
    description: "Writing advice offers expert tips and guidance to improve your style, clarity, and creativity. Whether you’re crafting stories, business content, or academic work, personalized support helps you write with confidence and impact.",
    images: [
    "https://images.twinkl.co.uk/tw1n/image/private/t_630_eco/image_repo/5c/86/letter-of-advice-for-next-years-students-for-6th-8th-grade-us-e-1674702492_ver_1.jpg",
 " https://www.dailylifedocs.com/wp-content/uploads/2022/06/letter-of-advice-on-choosing-a-new-partner.jpg",
"https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTc2MjQ3MjI5NzE4NDA3MDQ3/article-writing-templates-the-secret-all-successful-content-marketers-use.jpg",
  ],
    modalImage: "https://www.writerswrite.co.za/wp-content/uploads/2020/07/Write-The-Crap-Out-Of-It-And-Other-Short-Story-Writing-Advice.jpg",
    path:"/services/writing/writing-advice",  
    price: "$200" ,
      section: "writing",area:"editing-critique"
  },
  "Book & eBook Writing": {
    title: "Book & eBook Writing",
    description: "Book and eBook writing transforms your ideas into captivating, well-structured manuscripts ready for publishing. Whether fiction or nonfiction, our expert writing helps you tell your story, share knowledge, and reach readers worldwide.",
   images: [
    "https://designshack.net/wp-content/uploads/bold-minimal-ebook-template-269-1.jpg",
 " https://i.pinimg.com/736x/e7/08/66/e7086671896e2c6266ee7b654eadca04.jpg",
"https://venngage-wordpress.s3.amazonaws.com/uploads/2022/10/section-3-ebook-banner.png",
  ],
    modalImage: "https://miro.medium.com/v2/resize:fit:1060/1*svt__Xdw48VfUiBPDxO0yg.jpeg",
    path:"/services/writing/book-&-ebook-writing",  
    price: "$12,000" ,
      section: "writing",area:"book-ebook-publishing"
  },
  "Book Editing": {
    title: "Book Editing",
    description: "Book editing refines your manuscript to ensure clarity, consistency, and polish. From developmental edits to line editing and proofreading, expert editors help perfect your story, strengthen your voice, and prepare your book for publication.",
    images: [
    "https://www.ooliganpress.com/wp-content/uploads/2022/03/download-2-1.jpeg",
 " https://americanmanuscripteditors.com/images/NewImages/sample-4.png",
"https://www.bookbaby.com/images/line-editing-ipad-sample.png",
  ],
    modalImage: "https://resources.reed.co.uk/courses/careerguides/how-to-become-a-book-editor-career-advice.webp",
    path:"/services/writing/book-editing",  
    price: "$3,000 " ,
      section: "writing",area:"book-ebook-publishing"
  },
  "RePublication": {
  title: "RePublication",
  description: "RePublication services help authors update, refine, and prepare their previously published works for a new audience or platform. This includes manuscript review, content updates, formatting adjustments, and preparation for print or digital release to ensure your book shines in its new edition.",
  images: [
    "https://cdn.pixabay.com/photo/2015/09/05/21/51/books-925589_1280.jpg",
    "https://media.istockphoto.com/id/1498878143/photo/book-stack-and-open-book-on-the-desk-in-modern-public-library.jpg?s=612x612&w=0&k=20&c=vRcxdgfHSFJkow6DNPtaL9DT_ttdMGWel-qRLEzkQEI=",
    "https://media.istockphoto.com/id/625059250/photo/white-cover-magazine-and-blank-screen-phone-flat-lay-tabletop.jpg?s=612x612&w=0&k=20&c=btB7rHO5_ziXts703DyhG0ze4_8MFYIO1sBOde-b92c="
  ],
  modalImage: "https://media.istockphoto.com/id/2167526670/photo/stack-of-books-next-to-an-open-laptop-on-a-wooden-desk-in-a-library-3d-rendering.jpg?s=612x612&w=0&k=20&c=V2eZwljTaeGcUonNp05TfMv628qWdepRfX2Dl0Yavbo=",
  path: "/services/writing/republication",
  price: "$999.00",
  section: "writing",
  area: "book-ebook-publishing"
},
  "Translation": {
    title: "Translation",
    description: "Translation services convert your content accurately and naturally between languages, preserving meaning, tone, and cultural nuances. Whether for documents, websites, or marketing materials, expert translation helps you connect with global audiences effortlessly.",
   images: [
    "https://learn.ineight.com/Compliance/Content/4%20Template/TemplateImages/21.7/21_7_translation_excel_template.png",
 " https://www.pactranz.com/cms3/wp-content/uploads/2017/06/Translation-Invoice-Template-2-1.jpg",
"https://cdn3.f-cdn.com//files/download/1074416/LDIgOThe%20Top%2010%20Rookie%20Mistakes%20for%20Entrepreneurs.jpg?width=780&height=691&fit=crop",
  ],
    modalImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-wS1I7lm1z87VYqiQhliE8bk-Qk1K3Ac5_w&s",
    path:"/services/writing/translation",  
    price: "$0.15 | per word (roughly $300 for a 2,000-word document)" ,
      section: "writing",area:"translation-transcription"
  },
  "Transcription": {
    title: "Transcription",
    description: "Transcription converts audio and video recordings into accurate, easy-to-read text. Ideal for interviews, meetings, podcasts, and more, professional transcription ensures your content is accessible, searchable, and ready for use.",
    images: [
    "https://i.ytimg.com/vi/oyNsUVT3fQs/maxresdefault.jpg",
 " https://exemplary.ai/img/blog/transcript-editors-list/rev.png",
"https://designrr.io/wp-content/uploads/2019/04/editing-tools2-c.png",
  ],
    modalImage: "https://www.verbolabs.com/wp-content/uploads/2021/08/HOW-TRANSCRIPTION-SERVICES-HELP-TO-EMPOWER-INSURANCE-AGENTS.jpg",
    path:"/services/writing/transcription",  
    price: "$1.25 | per audio minute (about $75 per hour of audio)" ,
      section: "writing",area:"translation-transcription"
  },
  "Brand Voice & Tone": {
    title: "Brand Voice & Tone",
    description: "Brand voice and tone define how your business communicates, creating a consistent personality and style that resonates with your audience. Crafting the right voice builds trust, strengthens identity, and makes every message feel authentic and engaging.",
   images: [
    "https://www.slideteam.net/wp/wp-content/uploads/2024/05/Brand-Voice-Chart-for-Launching-the-New-Product-.jpg",
 " https://www.hubspot.com/hubfs/brand-voice-examples-1-20240828-8832561-1.webp",
"https://cdn.prod.website-files.com/5de2db6d3719a1e2f3e4454c/5e92086d36c30bd554de2bb7_mailchimp-brand-voice.png",
  ],
    modalImage: "https://api.backlinko.com/app/uploads/2024/04/brand-tone-of-voice-blog-post-image.png",
    path:"/services/writing/brand-voice-&-tone",  
    price: "$1,000" ,
      section: "writing",area:"business-marketing-copy"
  },
  "Business Names & Slogans": {
    title: "Business Names & Slogans",
    description: "Business names and slogans create memorable first impressions that capture your brand’s essence and appeal. Crafting the perfect name and tagline helps you stand out, connect with customers, and build lasting brand recognition.",
    images: [
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/luxury-real-estate-logo-design-template-c4e1d440e2d70b455503c18490d7427a_screen.jpg?ts=1676205399",
 " https://www.shutterstock.com/image-vector/m-arch-logo-vector-separate-600nw-473647582.jpg",
"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/business-logo-design-template-48306b423a8dd6afd24d7fb9c9ea71a9_screen.jpg?ts=1708758040",
  ],
    modalImage: "https://graphicdesigneye.com/assets/uploads/blogs/2025/Jul/05072025_68695e8c73405.jpg",
    path:"/services/writing/business-names-&-slogans",  
    price: "$500.00" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Product Descriptions": {
    title: "Product Descriptions",
    description: "Product descriptions highlight the features, benefits, and unique value of your items in clear, persuasive language. Well-crafted descriptions boost customer interest, improve SEO, and drive more sales by helping shoppers make confident buying decisions.",
   images: [
    "https://cdn.prod.website-files.com/659415b46df8ea43c3877776/669a75a7a4bae54ad7c2952d_66993c9d5681805e7368e772_6641d30ea7ecfdda10e88b2d_heinz-product-description-example.jpeg",
 " https://www.optimonk.com/wp-content/uploads/product-description-example-03.png",
"https://www.bigstarcopywriting.com/wp-content/uploads/2021/05/2.png",
  ],
    modalImage: "https://static.wixstatic.com/media/a77aa0_26c5be51e35641138df91c1e03cc0a3c~mv2.jpg/v1/fill/w_1000,h_571,al_c,q_85,usm_0.66_1.00_0.01/a77aa0_26c5be51e35641138df91c1e03cc0a3c~mv2.jpg",
    path:"/services/writing/product-descriptions",  
    price: " $100 each" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Ad Copy": {
    title: "Ad Copy",
    description: "Ad copy delivers short, compelling messages designed to grab attention and drive action. Whether for digital ads, print, or social media, powerful copy boosts clicks, conversions, and brand awareness with clear, persuasive language.",
   images: [
    "https://www.webfx.com/wp-content/uploads/2022/07/favor-ig-in-feed-ad.jpeg",
 " https://wordsmithie.com/wp-content/smush-webp/2024/01/Screenshot-2022-02-04-at-10.53.42-1-1024x873.png.webp",
"https://narrato.io/blog/wp-content/uploads/2024/10/image_OeaIHTH-1024x576.png",
  ],
    modalImage: "https://www.wordstream.com/wp-content/uploads/2021/12/instagram-ad-copy-examples-creative-sweet.png",
    path:"/services/writing/ad-copy",  
    price: "$300" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Sales Copy": {
    title: "Sales Copy",
    description: "Sales copy uses compelling language and proven techniques to persuade potential customers to take action. Crafted to highlight benefits and overcome objections, it drives conversions, boosts revenue, and grows your business effectively.",
   images: [
    "https://www-cms.pipedriveassets.com/cdn-cgi/image/quality=70,format=auto/https://www-cms.pipedriveassets.com/Sales-copy-innocent.png",
 " https://copyblogger.com/wp-content/uploads/2024/01/image-18.png",
"https://www-cms.pipedriveassets.com/cdn-cgi/image/quality=70,format=auto/https://www-cms.pipedriveassets.com/Sales-copy-Copyhackers.png",
  ],
    modalImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGz8YMmgDeqQp74llRwXXkhLYUlKZQOLBUXQ&s",
    path:"/services/writing/sales-copy",  
    price: "$700" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Email Copy": {
    title: "Email Copy",
    description: "Email copy crafts clear, persuasive messages that connect with your audience and inspire action. From newsletters to promotional campaigns, expertly written emails boost open rates, engagement, and conversions.",
   images: [
    "https://assets.cdn.filesafe.space/OY3bS4mcwLrdO0hSCqdL/media/679701c5c21e372a0dbb6855.png",
 "https://carminemastropierro.com/wp-content/uploads/2021/12/Jarvis-AIDA-output.png",
"https://blogcdn.gmass.co/blog/wp-content/uploads/2023/02/pas-bad-problem-tinified.png",
  ],
    modalImage: "https://www.sender.net/wp-content/uploads/2022/02/Email-Campaigns-smaller.png",
    path:"/services/writing/email-copy",  
    price: "$250" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Social Media Copywriting": {
    title: "Social Media Copywriting",
    description: "Social media copywriting creates short, impactful messages that engage followers and spark conversations. Perfectly tailored for each platform, it builds brand personality, drives interaction, and grows your online community.",
    images: [
    "https://media.sproutsocial.com/uploads/PI_Listening_Competitive_Analysis_Performance.png",
 "https://www.notion.com/_next/image?url=https%3A%2F%2Fs3.us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Ftemplate%2F88548353-fe93-4fe5-a9fd-364d815d36fb%2F1729914098251%2Fdesktop.jpg&w=3840&q=75",
"https://withxpert.com/wp-content/uploads/2025/05/social-media-copywriting-examples.webp",
  ],
    modalImage: "https://cdn.prod.website-files.com/637b64a58832c57934e9f106/63f3529585872a9e99a74cbf_How-to-Copywrite-Excelling-in-Social-Copywriting-on-Every-Platform-1024x576.png",
    path:"/services/writing/social-media-copywriting",  
    price: "$400" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Press Releases": {
    title: "Press Releases",
    description: "Press releases deliver clear, newsworthy announcements that capture media attention and build public awareness. Crafted to highlight your key messages and drive coverage, they help boost your brand’s credibility and visibility.",
   images: [
    "https://cdn.prod.website-files.com/5da60b8bfc98fdf11111b791/614b54e73cf6447b97ad75dc_strategic-partnership-announcement-press-release-template.png",
 "https://templatelab.com/wp-content/uploads/2016/06/press-release-template-23.jpg",
"https://www.thesmbguide.com/images/press-release-template-420x320-2020056.png",
  ],
    modalImage: "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2022/06/Press-Release.jpg",
    path:"/services/writing/press-releases",  
    price: "$800" ,
       section: "writing",area:"business-marketing-copy"
  },
  "Resume Writing": {
    title: "Resume Writing",
    description: "Resume writing creates clear, tailored, and professional resumes that highlight your skills and experience to land interviews. Expertly crafted resumes help you stand out to employers and advance your career confidently.",
     images: [
    " https://www.leveragedresume.com.au/wp-content/uploads/2024/11/New-Template-27-1-1-724x1024-1.webp",
 " https://cdn-images.zety.com/templates/zety/concept-10-classic-blue-navy-312@3x.png",
"https://www.my-resume-templates.com/wp-content/uploads/2023/10/simple-resume-template-221.jpg",
  ],
    modalImage: "https://blog.iawomen.com/wp-content/uploads/2018/09/resume-writing-women.jpg",
    path:"/services/writing/resume-writing",  
    price: "$300" ,
      section: "writing",area:"career-writing"
  },
  "Cover Letters": {
    title: "Cover Letters",
    description: "Cover letters complement your resume by showcasing your personality, motivation, and fit for the role. Well-crafted cover letters grab employers’ attention, highlight your strengths, and increase your chances of landing the interview.",
   images: [
    "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2023/03/Cover-Letter-Format_800x943%402x.png",
 " https://resumecompanion.com/wp-content/uploads/2020/04/basic-cover-letter-templates-featured-image-340x235.png",
"https://cdn.geckoandfly.com/wp-content/uploads/2019/06/cover-letter-template-02.jpg",
  ],
    modalImage: "https://www.myperfectresume.com/wp-content/uploads/2022/03/how-to-write-a-cover-letter-hero.png",
    path:"/services/writing/cover-letters",  
    price: "$150" ,
       section: "writing",area:"career-writing"
  },
  "LinkedIn Profiles": {
    title: "LinkedIn Profiles",
    description: "LinkedIn profile writing crafts a standout, optimized profile that highlights your skills, experience, and professional brand. A compelling LinkedIn presence helps you attract recruiters, build connections, and unlock new career opportunities.",
  images: [
    "https://img.freepik.com/free-vector/flat-design-linkedin-mockup_23-2149206472.jpg?semt=ais_hybrid&w=740&q=80",
 " https://www.figma.com/community/resource/4ab7d691-aaf1-4026-9321-0696c93a2d80/thumbnail",
"https://assets.mediamodifier.com/mockups/5e984016961ada18ba924662/linkedin-profile-page-mockup.jpg",
  ],
    modalImage: "https://helpx-prod.scene7.com/is/image/HelpxProd/linkedin-profile-picture-intro_900x506?$pjpeg$&jpegSize=200&wid=900",
    path:"/services/writing/linkedin-profiles",  
    price: "$350" ,
       section: "writing",area:"career-writing"
  },
  "Job Descriptions": {
    title: "Job Descriptions",
    description: "Job descriptions clearly define roles, responsibilities, and qualifications to attract the right candidates. Well-written descriptions streamline hiring, set expectations, and help build a strong, motivated team.",
    images: [
    "https://blr.com/app/uploads/2022/06/Job-descriptions.jpg",
 "https://www.mbaskool.com/2019_images/stories/mar_images/job-description.jpg",
"https://elmosoftware.com.au/wp-content/uploads/2023/10/How-to-write-a-detailed-job-description-1-scaled-1.jpg",
  ],
    modalImage: "https://cdn.prod.website-files.com/5e6aa7798a5728055c457ebb/64e3af7042a04e5d49967c7f_20230821T0632-d10cbc49-66f8-4631-ab87-412b25d85da4.jpeg",
    path:"/services/writing/job-descriptions",  
    price: " $200" ,
       section: "writing",area:"career-writing"
  },
  "Technical Writing": {
    title: "Technical Writing",
    description: "Technical writing creates clear, accurate, and user-friendly documentation like manuals, guides, and FAQs. It simplifies complex information, helping users understand and effectively use products or services.",
    images: [
    "https://assets.ltkcontent.com/images/16485/technical-manual_7abbbb2796.jpg",
 " https://blog.udemy.com/wp-content/uploads/2013/10/technicalwritingexamples.jpg",
"https://www.instructionalsolutions.com/hs-fs/hubfs/strong-technical-writing-example-SOP-example.jpg?width=451&height=450&name=strong-technical-writing-example-SOP-example.jpg",
  ],
    modalImage: "https://www.scilife.io/hs-fs/hubfs/Featured-image_Technical-writing.jpg?width=1200&height=675&name=Featured-image_Technical-writing.jpg",
    path:"/services/writing/technical-writing",  
    price: "$1,000" ,
       section: "writing",area:"miscellaneous-writing"
  }
};



const ServiceDetail = () => {
  const { section, serviceSlug } = useParams();
  const chatBubbleRef = React.useRef();
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  // Add these state variables at the top of your component
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Core states
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Visitor info
  const [visitorName, setVisitorName] = useState(localStorage.getItem('visitorName') || '');
  const [visitorEmail, setVisitorEmail] = useState(localStorage.getItem('visitorEmail') || '');
  const [hasSubmittedInfo, setHasSubmittedInfo] = useState(
    localStorage.getItem('visitorName') && localStorage.getItem('visitorEmail')
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  // Image popup states
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gallery states
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); 

  // Locate service (keep your existing service data logic)
  const serviceData =
    section === 'graphics' ? graphicsServiceDetails :
    section === 'business' ? businessServiceDetails :
    section === 'digital' ? digitalServiceDetails :
    section === 'music' ? musicServiceDetails :
    section === 'programming' ? programmingServiceDetails :
    section === 'video' ? videoServiceDetails :
    writingServiceDetails;

  const serviceName = Object.keys(serviceData).find((key) => 
    key.toLowerCase().replace(/\s+/g, '-') === serviceSlug
  );

  const service = serviceName ? serviceData[serviceName] : null;

  // Open gallery with all images
  const openGallery = () => {
    if (service.images && service.images.length > 0) {
      setGalleryImages(service.images);
      setIsGalleryOpen(true);
    }
  };

  // Close gallery
  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % service.images.length;
      } else {
        return (prev - 1 + service.images.length) % service.images.length;
      }
    });
  };

  // Load reviews from Supabase
  const loadReviews = async () => {
    if (!serviceSlug || !section) return;

    try {
      setIsLoading(true);
      
      // Fetch reviews from Supabase
      const { data, error } = await supabase
        .from('service_reviews')
        .select('*')
        .eq('service_slug', serviceSlug)
        .eq('section', section)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      
    } catch (err) {
      setError('Failed to load reviews');
      console.error("Error loading reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load reviews when serviceSlug or section changes
  useEffect(() => { 
    loadReviews(); 
  }, [serviceSlug, section]);

  if (!service) {
    return <div>Service not found</div>;
  }

  // Paginate and average
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const displayedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : "0.00";

  // Persist user info
  const saveUserInfo = () => {
    localStorage.setItem('visitorName', visitorName);
    localStorage.setItem('visitorEmail', visitorEmail);
    setHasSubmittedInfo(true);
  };

  // Submit review to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasSubmittedInfo && !recaptchaValue) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    if (!visitorName || !visitorEmail) return setError('Please enter name & email');
    if (userRating === 0 && !newReview.trim()) return setError('Please provide either a rating or review');

    try {
      setIsLoading(true);
      setError('');
      
      if (!hasSubmittedInfo) {
        saveUserInfo();
      }
      
      // Insert review into Supabase
      const { data, error } = await supabase
        .from('service_reviews')
        .insert({
          service_slug: serviceSlug,
          section: section,
          name: visitorName,
          email: visitorEmail,
          text: newReview.trim() || null,
          rating: userRating || null,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      setSuccessMessage('Thank you for your feedback!');
      setNewReview('');
      setUserRating(0);
      loadReviews(); // Reload reviews to show the new one
      
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsLoading(false);
    }
  };

  // Touch handlers (keep your existing code)
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const difference = touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (difference > swipeThreshold) {
      handleImageNavigation('next');
    } else if (difference < -swipeThreshold) {
      handleImageNavigation('prev');
    }

    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Your existing JSX return remains exactly the same...
  return (
    <div style={{ maxWidth: 'clamp(300px, 90vw, 1200px)', 
      margin: 'clamp(60px, 8vw, 120px) auto', 
      padding: 'clamp(10px, 3vw, 20px)' }}>

      {/* Breadcrumb & Primary Info */}
      <div style={{ marginBottom: 'clamp(10px, 2vw, 20px)',fontSize: 'clamp(0.8rem, 3vw, 1rem)', color: '#666' }}>
        <Link to="/" style={{ color: '#087830' }}>Home</Link> /
        <Link to={`/services#${service.area}`} style={{ color: '#087830', margin: '0 5px' }}>All Services</Link> /
        <span>{service.title}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: window.innerWidth <= 768 ? 'column' : 'row', gap: 'clamp(20px, 4vw, 40px)'}}>
        <div style={{ flex: 1 }}>
          <img src={service.modalImage} alt={service.title} onClick={() => section !== 'video' && setIsImagePopupOpen(true)} style={{cursor: section !== 'video' ? 'pointer' : 'default', width: '100%', height: 'clamp(200px, 40vw, 400px)', objectFit: 'cover', borderRadius: '8px',}} />
        
          {service.images && service.images.length > 0 && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <button
                onClick={openGallery}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#087830',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                View More Photos ({service.images.length})
              </button>
            </div>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "Arial", color: '#087830', fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', marginBottom: 'clamp(5px, 1vw, 10px)' }}>{service.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'clamp(5px, 1vw, 10px)', flexWrap: 'wrap' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ color: s <= averageRating ? '#ffc107' : '#e4e5e9',  fontSize: 'clamp(1rem, 3vw, 1.5rem)'}}>★</span>
            ))}
            <span style={{ marginLeft: 'clamp(5px, 2vw, 10px)', color: '#666', fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>{averageRating} ({reviews.length} reviews)</span>
          </div>
          <div style={{ color: '#087830', marginBottom: 'clamp(10px, 2vw, 20px)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>{service.price}</div>
          <button onClick={() => chatBubbleRef.current?.openChat()} style={{ backgroundColor: '#087830', color: 'white',padding: 'clamp(8px, 1.5vw, 10px)', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: 'clamp(15px, 3vw, 30px)', fontSize: 'clamp(0.8rem, 3vw, 1rem)'}}>
            CONTACT AGENT
          </button>
          <ChatBubble ref={chatBubbleRef} />
          <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 15px)', flexWrap: 'wrap', marginTop: 'clamp(10px, 2vw, 20px)'}}>
            <img src={paymentLogos.visa} alt="Visa" style={{height: 'clamp(15px, 4vw, 25px)'}} />
            <img src={paymentLogos.mastercard} alt="MasterCard" style={{height: 'clamp(15px, 4vw, 25px)'}} />
            <img src={paymentLogos.amex} alt="Amex" style={{height: 'clamp(15px, 4vw, 25px)'}} />
            <img src={paymentLogos.pay} alt="Apple Pay" style={{height: 'clamp(15px, 4vw, 25px)'}} />
          </div>
          <p style={{ fontFamily: 'Century Gothic', color: '#333', lineHeight: '1.6', textAlign: 'justify',marginTop: 'clamp(10px, 2vw, 20px)', fontSize: 'clamp(0.9rem, 3vw, 1rem)'}}>{service.description}</p>
        </div>
      </div>

   {/* Image Popup with Fixed-Position Arrows - Only for non-video services */}
{section !== 'video' && isImagePopupOpen && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    {/* Left Arrow - Hidden on small screens if not enough space */}
    <div style={{
      position: 'fixed',
      left: 'clamp(10px, 3vw, 50px)',
      top: '50%',
      transform: 'translateY(-50%)',
      display: window.innerWidth < 400 ? 'none' : 'block'
    }}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleImageNavigation('prev');
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid #087830',
          borderRadius: '50%',
          width: 'clamp(30px, 6vw, 50px)',
          height: 'clamp(30px, 6vw, 50px)',
          color: '#087830',
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          ':hover': {
            background: '#087830',
            color: 'white'
          }
        }}
      >
        ‹
      </button>
    </div>

    {/* Image Container with touch events for mobile */}
    <div 
      style={{ 
        maxWidth: '90%',
        maxHeight: '90%',
        margin: '0 clamp(10px, 3vw, 80px)',
        touchAction: 'pan-y'
      }}
      onClick={(e) => {
        // Close on tap outside image on mobile
        if (e.target === e.currentTarget) {
          setIsImagePopupOpen(false);
        }
      }}
    >
      <img 
        src={service.images[currentImageIndex]} 
        alt={`${service.title} ${currentImageIndex + 1}`}
        style={{
          maxWidth: '100%',
          maxHeight: '80vh',
          objectFit: 'contain',
          userSelect: 'none'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>

    {/* Right Arrow - Hidden on small screens if not enough space */}
    <div style={{
      position: 'fixed',
      right: 'clamp(10px, 3vw, 50px)',
      top: '50%',
      transform: 'translateY(-50%)',
      display: window.innerWidth < 400 ? 'none' : 'block'
    }}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleImageNavigation('next');
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid #087830',
          borderRadius: '50%',
          width: 'clamp(30px, 6vw, 50px)',
          height: 'clamp(30px, 6vw, 50px)',
          color: '#087830',
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          ':hover': {
            background: '#087830',
            color: 'white'
          }
        }}
      >
        ›
      </button>
    </div>

    {/* Close Button - Always visible */}
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setIsImagePopupOpen(false);
      }}
      style={{
        position: 'fixed',
        top: 'clamp(10px, 3vw, 20px)',
        right: 'clamp(10px, 3vw, 20px)',
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        width: 'clamp(30px, 6vw, 40px)',
        height: 'clamp(30px, 6vw, 40px)',
        color: '#087830',
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        zIndex: 1001
      }}
    >
      ×
    </button>

    {/* Mobile navigation dots - only show on small screens */}
    {window.innerWidth < 768 && (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
        {service.images.map((_, index) => (
          <div 
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: index === currentImageIndex ? '#087830' : 'white',
              cursor: 'pointer',
              opacity: 0.7
            }}
          />
        ))}
      </div>
    )}
  </div>
)} 


{/* Gallery Popup */}
      {isGalleryOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 'clamp(10px, 3vw, 20px)',
        }}>
          {/* <h3 style={{ color: 'white', marginBottom: 'clamp(10px, 3vw, 20px)',fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>Gallery</h3> */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 40vw, 300px), 1fr))',
            gap: 'clamp(10px, 3vw, 20px)',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: 'clamp(10px, 2vw, 20px)'
          }}>
            {galleryImages.map((img, index) => (
              <div key={index} style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.02)'
                }
              }}>
                <img 
                  src={img} 
                  alt={`Gallery image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: 'clamp(150px, 40vw, 200px)',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsImagePopupOpen(true);
                    setIsGalleryOpen(false);
                  }}
                />
              </div>
            ))}
          </div>
          <button 
            onClick={closeGallery}
            style={{
              position: 'fixed',
              top: 'clamp(10px, 3vw, 20px)',
              right: 'clamp(10px, 3vw, 20px)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: 'clamp(30px, 10vw, 40px)',
              height: 'clamp(30px, 10vw, 40px)',
              color: '#087830',
              fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              zIndex: 1001
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Video Samples Section - Only for video services */}
            {section === 'video' && service.sampleVideos && (
              <div style={{margin: 'clamp(20px, 5vw, 40px) 0'}}>
               <h3 style={{ 
                borderBottom: '2px solid #087830', 
                paddingBottom: 'clamp(5px, 1.5vw, 10px)',
                fontFamily: 'Arial, sans-serif',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)'
              }}>
                  {/* Sample Videos */}
                </h3>
                <div style={{
                  color: '#087830',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 80vw, 300px), 1fr))',
                  gap: 'clamp(10px, 3vw, 20px)',
                  marginTop: 'clamp(10px, 3vw, 20px)',
                  fontFamily: 'Arial, sans-serif', 
                  fontSize: 'clamp(0.8rem, 3vw, 1rem)'
                }}>
                  {service.sampleVideos.map((video, index) => (
                    <div key={index}>
                      <h4>{video.title}</h4>
                      <div style={{
                        position: 'relative',
                        paddingBottom: '56.25%', // 16:9 aspect ratio
                        borderRadius: '5px',
                        overflow: 'hidden'
                      }}>
                        <video
                          controls
                          autoPlay
                          muted // Required for autoplay in most browsers
                          loop // Optional: makes video loop
                          playsInline // For iOS compatibility
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                               borderColor: 'black 10px',
                          }}
                        >
                          <source src={video.videoFile} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        
                        {/* Fallback thumbnail that disappears when video loads */}
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            pointerEvents: 'none'
                          }}
                          onError={(e) => e.target.style.opacity = 1} // Show if video fails
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

      {/* Visitor Info */}
      {!hasSubmittedInfo && (
        <div style={{fontFamily: 'Franklin Gothic Medium', marginTop: 'clamp(20px, 5vw, 40px)',fontSize: 'clamp(0.9rem, 3vw, 1rem)', color: '#087830',width: '100%'}}>
          <h3>Tell Us About You</h3>
          {/* <input
            placeholder="Name"
            value={visitorName}
            onChange={e => setVisitorName(e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <input
            placeholder="Email"
            type="email"
            value={visitorEmail}
            onChange={e => setVisitorEmail(e.target.value)}
            style={{ padding: '8px', width: '300px' }}
          /> */}
          <div style={{
            flexDirection: 'column',
            gap: 'clamp(10px, 2vw, 14px)',
            marginTop: 'clamp(8px, 2vw, 12px)',
            width: '100%'
          }}>
            <input
              placeholder="Name"
              value={visitorName}
              onChange={e => setVisitorName(e.target.value)}
              style={{ 
                padding: 'clamp(8px, 2vw, 12px)', 
                width: '100%',
                maxWidth: '400px',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <input
              placeholder="Email"
              type="email"
              value={visitorEmail}
              onChange={e => setVisitorEmail(e.target.value)}
              style={{ 
                padding: 'clamp(8px, 2vw, 12px)', 
                width: '100%',
                maxWidth: '400px',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      )}

      {/* Combined Rating & Review Form */}
      <form onSubmit={handleSubmit} style={{ fontFamily: 'Franklin Gothic Medium', marginTop: 'clamp(15px, 4vw, 30px)',fontSize: 'clamp(0.9rem, 3vw, 1rem)',color: '#087830'}}>
        <h3>Share Your Experience</h3>
        
        <div style={{ marginBottom: 'clamp(8px, 2vw, 15px)' }}>
          <label style={{ fontFamily: 'Franklin Gothic Medium', display: 'block',marginBottom: 'clamp(3px, 1vw, 5px)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Your Rating:</label>
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
              style={{
                color: star <= (hoverRating || userRating) ? '#ffc107' : '#e4e5e9',
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                cursor: 'pointer',
                marginRight: 'clamp(3px, 1vw, 5px)'
              }}
            >
              ★
            </span>
          ))}
        </div>

        <div style={{ marginBottom: 'clamp(8px, 2vw, 15px)' }}>
          <label style={{ fontFamily: 'Franklin Gothic Medium', display: 'block',marginBottom: 'clamp(3px, 1vw, 5px)',fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Your Review (optional):</label>
          <textarea
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
            rows="5"
            style={{ width: '100%', padding: 'clamp(5px, 1.5vw, 10px)', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: 'clamp(0.8rem, 3vw, 1rem)'}}
            placeholder="Share your thoughts about this service..."
          />
        </div>

        {/* <ReCAPTCHA
        sitekey="6LeU6J0rAAAAAPl4nlzjVyZBkqUyERjyA5SxfBL7" // Replace with your actual site key
        onChange={(value) => setRecaptchaValue(value)}
        style={{ margin: '15px 0' }}
      /> */}

      {/* Show CAPTCHA only if user hasn't submitted info yet */}
    {!hasSubmittedInfo && (
      <ReCAPTCHA
        sitekey="6LeU6J0rAAAAAPl4nlzjVyZBkqUyERjyA5SxfBL7" // Replace with your actual site key
        onChange={(value) => setRecaptchaValue(value)}
        style={{ margin: '15px 0' }}
      />
    )}

        <button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: '#087830', color: 'white',fontSize: 'clamp(0.8rem, 3vw, 1rem)', padding: 'clamp(6px, 1.5vw, 10px) clamp(12px, 3vw, 20px)',  border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isLoading ? 'Submitting...' : 'Submit Feedback'}
        </button>

        {successMessage && <div style={{ color: '#087830',marginTop: 'clamp(5px, 1.5vw, 10px)', fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>{successMessage}</div>}
        {error && <div style={{ color: '#ff0000', marginTop: 'clamp(5px, 1.5vw, 10px)', fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>{error}</div>}
      </form>

      {/* Reviews */}
      <div style={{marginTop: 'clamp(20px, 5vw, 40px)'}}>
        <h3 style={{ fontFamily: 'Franklin Gothic Medium', color: '#087830', fontSize: 'clamp(1rem, 3.5vw, 1.2rem)'}}>Customer Reviews</h3>
        {displayedReviews.map(review => {
          const isMine = review.email === visitorEmail;
          return (
            <div key={review.id} style={{ background: isMine ? '#e7ffe7' : '#fff',padding: 'clamp(10px, 3vw, 20px)', borderRadius: '6px', border: '1px solid #ddd',marginBottom: 'clamp(8px, 2vw, 15px)',fontSize: 'clamp(0.8rem, 3vw, 1rem)'}}>
              <div style={{ fontWeight: 'bold' }}>{review.name}</div>
              <div style={{color: '#666', fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)'}}>{new Date(review.created_at).toLocaleDateString()}</div>
              {review.rating && (
                <div style={{ color: '#ffc107' }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              )}
              <p>{review.text}</p>
            </div>
          );
        })}
        {totalPages > 1 && (
          <div style={{ textAlign: 'center', marginTop: 'clamp(10px, 3vw, 20px)'}}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  margin: '0 clamp(2px, 1vw, 5px)',
                  padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
                  backgroundColor: currentPage === i + 1 ? '#087830' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;