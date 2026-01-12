import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

// Import all components
 import Navbar from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import PrivacyPolicy from './pages/privacy';
import RefundPolicy from './pages/refund';
import TermsOfService from './pages/terms';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AgentChat from './pages/AgentChat';
import ChatBubble from './components/ChatBubble';
import Payment from './pages/Payment';  
import Reset from './pages/reset';
import CreateAccount from './pages/CreateAccount';

// ADD: Import the new layout and pages
import CompanyLayout from './layouts/CompanyLayout';
import About from './pages/About';
import Bookstore from './pages/Bookstore';
import BookstoreDetail from './pages/BookstoreDetail';
import BookEvents from './pages/BookEvents';
import Cinematic from './pages/Cinematic';
import ListOfTradepad from './pages/ListOfTradepad';

import CompanyManagementLayout from './layouts/CompanyManagementLayout';
import CompanyDashboard from './pages/CompanyDashboard';
import AddBookstore from './pages/AddBookstore';
import ManageBookstore from './pages/ManageBookstore';
import CompanyLogin from './pages/CompanyLogin';
import AddAuthor from './pages/AddAuthor';
import AddBook from './pages/AddBook';
import ManageAuthors from './pages/ManageAuthors';
import ManageBooks from './pages/ManageBooks';
import ManageBookEvents from './pages/ManageBookEvents';
import ManageSocialMediaLinks from './pages/ManageSocialMediaLinks';
import AuthorMedia from './pages/AuthorMedia';

// Global style to hide scrollbar but keep scrolling
const GlobalStyle = createGlobalStyle`
  html {
    overflow: auto;
  }
  
  body {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    overflow-y: scroll; /* Always show vertical scrollbar to prevent layout shift */
  }
  
  body::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
`;

// Admin Layout Component (includes Navbar)
const AdminLayout = () => (
  <div style={styles.layout}>
    <Navbar />
    <div style={styles.mainContent}>
      <div style={styles.pageContent}>
        <Outlet />
      </div>
    </div>
    <ChatBubble />
  </div>
);

// NoNavbar Layout Component (for login only)
const NoNavbarLayout = () => (
  <div style={styles.layout}>
    <div style={styles.mainContent}>
      <div style={styles.pageContent}>
        <Outlet />
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          {/* Routes WITH Navbar */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:section" element={<Services />} />
            <Route path="/services/:section/:serviceSlug" element={<ServiceDetail />} />
            <Route path="/services/:category/:service" element={<ServiceDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refunds" element={<RefundPolicy />} /> 
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment" element={<Payment />} />
          </Route>


          {/* ADD: New Route Group for Company/Info Pages with Different Layout */}
          <Route element={<CompanyLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/bookstore" element={<Bookstore />} />
            <Route path="/bookstore/:id/:slug?" element={<BookstoreDetail />} />
            <Route path="/book-events" element={<BookEvents />} />
            <Route path="/cinematic" element={<Cinematic />} />
            <Route path="/list-of-tradepad" element={<ListOfTradepad />} />
            <Route path="/author-media" element={<AuthorMedia />} />

          </Route>

          {/* // In your Routes section, add: */}
          <Route element={<CompanyManagementLayout />}>
            <Route path="/company/manage" element={<CompanyDashboard />} />
            <Route path="/company/add-bookstore" element={<AddBookstore />} />
            <Route path="/company/manage-bookstore" element={<ManageBookstore />} />
            <Route path="/bookstore/:bookstoreId/add-author" element={<AddAuthor />} />
            <Route path="/bookstore/:bookstoreId/add-book" element={<AddBook />} />
            <Route path="/manage-authors" element={<ManageAuthors />} />
            <Route path="/manage-books" element={<ManageBooks />} />
            <Route path="/manage-book-events" element={<ManageBookEvents />} />
            <Route path="/manage-social-media-links" element={<ManageSocialMediaLinks />} />
          </Route>
          
          {/* Routes WITHOUT Navbar */}
          <Route element={<NoNavbarLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/agentchat" element={<AgentChat />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/company/login" element={<CompanyLogin />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}


const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  pageContent: {
    flexGrow: 1,
    padding: '0.5rem',
    paddingBottom: '1rem',
    backgroundColor: '#f8fafc',
  }
};