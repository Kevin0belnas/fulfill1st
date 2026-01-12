import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100%;
  background-color: white;
  overflow-x:hidden;
`;

const HeroSection = styled.section`
  position: relative;
  padding: clamp(3rem, 8vw, 6rem) 1rem;
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vw, 3rem);
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.presentationgo.com/2025/04/business-team-meeting-sunset.jpg') center/cover no-repeat;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;

  @media (max-width: 768px) {
    min-height: 50vh;
    padding: 2rem 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-family: Arial, sans-serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 700;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  line-height: 1.2;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 90%;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  font-family: Arial, sans-serif;
  background-color: #087830;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    transform: translateY(-3px);
    background-color: rgb(2, 163, 128);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const ServicesIntro = styled.div`
  text-align: center;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ServicesHeading = styled.h2`
 font-family: Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: rgb(30, 150, 90);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ServicesSubheading = styled.p`
  font-family: Arial, sans-serif;
  font-size: 1.5rem;
  color: #1e293b;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ReassuranceText = styled.p`
 font-family: Arial, sans-serif;
  font-size: 1rem;
  color: #1e293b;
  line-height: 1.4;
  margin-top: 0.5rem;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ServicesContainer = styled.div`
  padding: 1rem;
  font-family: system-ui, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
  width: 100%;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgb(30, 150, 90);
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AboutSection = styled.section`
  background-color: #f8f9fa;
  padding: 2rem 1rem;
  text-align: center;
  background: linear-gradient(rgba(236, 255, 255, 0.8), rgba(19, 102, 102, 0.8)),
    url('https://les-articleimg.s3.amazonaws.com/17397_AdobeStock_111553575.jpeg') center/cover no-repeat;
  margin-bottom: 1.5rem;
`;

const AboutHeading = styled.h2`
  font-family: Arial, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #004040;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CompanyName = styled.h3`
  font-family: Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #004040;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const AboutDescription = styled.p`
  font-family: Arial, sans-serif;
  font-size: 1rem;
  color: rgb(0, 29, 15);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    max-width: 90%;
  }
`;

const ExpertiseSection = styled.section`
  position: relative;
  padding: 5rem 20rem;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlJTIwd29ya2luZyUyMG9uJTIwbGFwdG9wfGVufDB8fDB8fHww') center/cover no-repeat;
  color: white;
  overflow: hidden;
  max-width: 100%;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const RightAlignedContent = styled.div`
 
  text-align: center;

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
  }
`;

const ExpertiseTitle = styled.h2`
  font-family: Arial, sans-serif;
  font-size: 2.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  color: rgb(91, 255, 214);
  font-style: italic;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }
`;

const ExpertiseSubtitle = styled.h3`
  font-family: Arial, sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
  }
`;

const ExpertiseDescription = styled.p`
  font-family: Arial, sans-serif;
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    text-align: center;
  }
`;

const ContactButton = styled(Link)`
  display: inline-block;
  background-color: #087830;
  font-family: Arial, sans-serif;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background-color: #00a883;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 0 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const CategoryCard = styled.div`
  background-color: #087830;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1rem;
  width: calc(33.333% - 1rem);
  min-width: 250px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  @media (max-width: 900px) {
    width: calc(50% - 1rem);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const CategoryImage = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 120px;
  }
`;

const CategoryName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CategoryDescription = styled.p`
  font-size: 0.9rem;
  color: white;
  margin: 0;
  line-height: 1.5;
  flex-grow: 1;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const ViewAllLink = styled(Link)`
 font-size: 0.9rem;
  color: #32CD32;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const ServicesCarousel = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
`;

const ServicesGrid = styled.div`
  display: flex;
  gap: 1rem;
  scroll-behavior: smooth;
  padding: 1rem 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: auto;
  width: 100%;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ServiceCard = styled.div`
  background-color: #087830;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  width: 180px;
  height: 200px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    width: 160px;
    height: 180px;
  }

  @media (max-width: 480px) {
    width: 140px;
    height: 160px;
  }
`;

const ServiceTitle = styled.h3`
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  color: white;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.5em;
  line-height: 1.25;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ImagePlaceholder = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  height: 120px;

  & > div {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 6px;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 100px;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background: white;
  }

  &[disabled] {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

const LeftArrow = styled(ArrowButton)`
  left: -10px;
  background: #004040;
`;

const RightArrow = styled(ArrowButton)`
  right: -10px;
  background: #004040;
`;

const Footer = styled.footer`
  background-color: #fff;
  color: #555;
  padding: 1.5rem 0;
  font-family: sans-serif;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const FooterLinks = styled.div`
 display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FooterLink = styled(Link)`
  color: #555;
  font-size: clamp(0.8rem, 1.1vw, 0.875rem);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #0096c7;
  }

   @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const Divider = styled.span`
  color: #ddd;
  font-size: clamp(0.8rem, 1.1vw, 0.875rem);
`;

const Copyright = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;


const Services = () => {
  const categories = [
    { 
      name: 'Digital Marketing', 
      description: 'Boost your online visibility and connect with your target market with our professional digital marketing services.',
      image: 'https://info.ehl.edu/hubfs/digital-marketing-trends-in-education.jpeg',
      path: '/services#digital' // Updated to link directly to digital section
    },
    { 
      name: 'Video & Animation', 
      description: 'Engage your viewers with breathtaking animation and video services.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS28b06VtUCgYZ326PzHCgXorxzZ2rwmx3XCw&s',
      path: '/services#video' // Updated to link directly to video section
    },
    { 
      name: 'Programming & Tech', 
      description: 'We provide state-of-the-art technical solutions and programming to help you stay ahead in the digital age.',
      image: 'https://cdn.builtin.com/cdn-cgi/image/f=auto,fit=cover,w=1200,h=635,q=80/https://builtin.com/sites/www.builtin.com/files/software-engineer-vs-programmer00.jpg',
      path: '/services#programming' // Updated to link directly to programming section
    },
    { 
      name: 'Business Development', 
      description: 'Make your business operations more efficient by utilizing our specialist services.',
      image: 'https://www.ziprecruiter.com/svc/fotomat/public-ziprecruiter/cms/881542122BudgetAnalyst.jpg=ws1280x960',
      path: '/services#business' // Updated to link directly to business section
    },
    { 
      name: 'Writing & Publishing', 
      description: 'Effectively convey your message by using our expert writing and publishing services.',
      image: 'https://media-www.sheridancollege.ca/-/media/project/sheridan/shared/images/sheridan-program/creative_writing_publishing.jpeg?rev=6e0c6bca3a874fde9ff500658ee6d349',
      path: '/services#writing' // Updated to link directly to writing section
    },
    { 
      name: 'Concept To Video', 
      description: 'Use our Concept to Video services to transform your ideas into artistic visuals.',
      image: 'https://media.istockphoto.com/id/1466350053/vector/motion-design-studio-designers-animators-storytellers-creating-motion-graphic-content.jpg?s=612x612&w=0&k=20&c=Z2FKLbOftgBxoOCmn7ytd1PxN4AbHNzXmI9CDazv7xU=',
      path: '/services#video' // Updated to link directly to video section
    }
  ];



   const services = [
    { name: 'Website Development', image: '/images/webdev.jpg', path: '/services/programming/website-development' }, 
    { name: 'Video Editing', image: '/images/vidEdit.jpeg', path: '/services/video/video-editing' },
    { name: 'Articles & Blog Posts', image: 'https://brands-up.ch/public/images/uploads/97bc703442fa9a38ed92e3047355fb18486c1219.png', path: '/services/writing/articles-&-blog-posts' },
    { name: 'Book Design', image: '/images/bookDesign.jpg', path: '/services/graphics/book-design' },
    { name: 'Voice Over', image: '/images/voice.jpg', path: '/services/music/voice-over' },
    { name: 'Proofreading & Editing', image: 'https://harvardproofreader.co.za/wp-content/uploads/2023/11/istockphoto-184928153-612x612-1.jpg', path: '/services/writing/proofreading-&-editing' },
    { name: 'Email Design', image: 'https://ghost-images.chamaileon.io/2017/02/really-good-emails-1280x570.png', path: '/services/graphics/email-design' },
    { name: 'Signage Design', image: 'https://www.stonefern.com/img/services/signage1.jpg', path: '/services/graphics/signage-design' },
    { name: 'Subtitles & Captions', image: 'https://cdn.prod.website-files.com/65e5ae1fb7482afd48d22155/6706e23ef5575ce4a0bd1483_6706e23c77efeab972a08431_captions-vs-subtitles-whats-the-difference-1024x576.png', path: '/services/video/subtitles-&-captions' }
  ];


const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = 300;
    
    if (container) {
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      
      setTimeout(() => {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      }, 100);
    }
  };


 const checkScroll = () => {
    const container = carouselRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

   return (
    <PageContainer>
      <HeroSection id='home-section'>
        <HeroTitle>Your Digital Journey Begins with Us.</HeroTitle>
        <HeroSubtitle>
          Whether your goal is to attract more customers, modernize your web presence, or launch an innovative idea, Fulfill First is your creative engine.
        </HeroSubtitle>
        <HeroButton to="/services">
          VIEW OUR SERVICES 
        </HeroButton>
      </HeroSection>

      <ServicesIntro id="services-section">
        <ServicesHeading>Our Services</ServicesHeading>
        <ServicesSubheading>
          Solutions That Fit Every Stage of Your Journey<br />
        </ServicesSubheading>
        <ReassuranceText>Whether you're just starting out or scaling up, we've got your back.</ReassuranceText>
      </ServicesIntro>

      <ServicesContainer>
        {/* Top Categories Section */}
        <section style={{ marginBottom: '1rem' }}>
          <CategoriesContainer>
            {categories.map((category, index) => (
              <CategoryCard 
                key={index}
                onClick={() => navigate(category.path)}
              >
                <CategoryImage>
                  <img src={category.image} alt={category.name} />
                </CategoryImage>
                <CategoryName>{category.name}</CategoryName>
                <CategoryDescription>{category.description}</CategoryDescription>
                <ViewAllLink to={category.path}>
                  View All <FaChevronRight size={12} />
                </ViewAllLink>
              </CategoryCard>
            ))}
          </CategoriesContainer>
        </section>

        {/* Popular Services Section */}
        <section>
          <SectionTitle style={{ margin: '2rem', fontSize: '2rem' }}>Popular Services</SectionTitle>
          <ServicesCarousel>
            {showLeftArrow && (
              <LeftArrow onClick={() => scroll('left')}> 
                <FaChevronLeft /> 
              </LeftArrow>
            )}
            <ServicesGrid 
              ref={carouselRef}
              onScroll={checkScroll}
            >
              {services.map((service, index) => (
                <ServiceCard key={index} onClick={() => navigate(service.path)}>
                  <ServiceTitle>{service.name}</ServiceTitle>
                  <ImagePlaceholder>
                    <div>
                      <img 
                        src={service.image} 
                        alt={service.name}
                      />
                    </div>
                  </ImagePlaceholder>
                </ServiceCard>
              ))}
            </ServicesGrid>
            {showRightArrow && (
              <RightArrow onClick={() => scroll('right')}>
                <FaChevronRight />
              </RightArrow>
            )}
          </ServicesCarousel>
        </section>
      </ServicesContainer>

      <AboutSection id="about-us-section">
        <AboutHeading>About Us</AboutHeading>
        <CompanyName>Fulfill First</CompanyName>
        <AboutDescription>
          At Fulfill First, our mission is to provide versatile, high-quality digital services that drive real impact. Backed by our structure as a fulfillment marketplace, we guarantee professionalism, transparency, and superior outcomes in every project.
        </AboutDescription>
      </AboutSection>

      <ExpertiseSection id="contact-section">
        <RightAlignedContent>
          <ExpertiseTitle>Your Success <br></br>Is Our Priority.</ExpertiseTitle>
          <ExpertiseSubtitle>More Than Just Services.<br></br> We Provide Solutions!</ExpertiseSubtitle>
          <ExpertiseDescription>
            Reach out today <br></br>and let's turn your ideas<br></br> into impactful results.
          </ExpertiseDescription>
          <ContactButton to="/contact">
            Contact Us Now !
          </ContactButton>
        </RightAlignedContent>
      </ExpertiseSection>


      
      <Footer>
        <FooterContent>
          <FooterLinks>
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <Divider>|</Divider>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <Divider>|</Divider>
            <FooterLink to="/refunds">Refund Policy</FooterLink>
            <Divider>|</Divider>
            <FooterLink to="https://app.autobooks.co/pay/page-and-pixel-digital-solutions">
              Payment Link
            </FooterLink>
            {/* <FooterLink>
            <a 
              href="https://app.autobooks.co/pay/page-and-pixel-digital-solutions" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Payment Link
            </a>
            </FooterLink> */}
          </FooterLinks>
          {/* <Copyright>© {new Date().getFullYear()} Fulfill First. All rights reserved.</Copyright> */}
          <Copyright>
  <button
    onClick={() => navigate('/login')}
    style={{
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      font: 'inherit',
      padding: 0,
      marginRight: '4px'
    }}
    title="Copyright Info"
  >
    ©
  </button>
  {new Date().getFullYear()} Fulfill First. All rights reserved.
</Copyright>
        </FooterContent>
      </Footer>
    </PageContainer>
  );
};

export default Services;