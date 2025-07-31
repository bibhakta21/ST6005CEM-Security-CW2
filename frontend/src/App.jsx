import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Cart from "./components/cart/Cart";
import OrderHistory from "./components/cart/OrderHistory";
import ChangePass from "./components/changepassword/ChangePass";
import ForgotPass from "./components/changepassword/ForgotPass";
import NewPass from "./components/changepassword/NewPass";
import Contact from "./components/contact/Contact";
import Dashboard from "./components/dashboard/dashboard";
import FAQPage from "./components/FAQ/Faq";
import Footer from "./components/Footer/Footer";
import About from "./components/Hero/About";
import Hero from "./components/Hero/Hero";
import Login from "./components/login/Login";
import OtpVerify from "./components/login/OtpVerify";
import Navbar from "./components/Navbar/Navbar";
import UserProfile from "./components/Navbar/UserProfile";
import Latest from "./components/NumberCounter/Latest";
import Bookmark from "./components/product/Bookmark";
import ProductDetail from "./components/product/ProductDetail";
import Product from "./components/product/Products";
import Register from "./components/Register/Register";
import RegisterSuccess from "./components/Register/RegisterSuccess";
import Story from "./components/Stories/Story";
import PaymentFailure from "./components/SuccessAndFailure/PaymentFailure";
import PaymentSuccess from "./components/SuccessAndFailure/PaymentSuccess";
import Testimonial from "./components/Testimonial/Testimonial";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import { UserContext, UserProvider } from "./context/UserContext";
import AccessDenied from "./protected/AccessDenied";
import ProtectedRoute from "./protected/ProtectedRoute";



const AppContent = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/dashboard"; 

  
  const authRedirect = (element) => {
    return user ? <Navigate to="/" replace /> : element;
  };

  return (
    <main className="overflow-x-hidden">
    <Toaster position="top-right" reverseOrder={false} />

      {!hideNavbarFooter && <Navbar />} {/* Hide Navbar on Dashboard */}

      <Routes>
     
        {/* Public Routes */}
        <Route path="/" element={<><Hero /><Latest /><Testimonial /><WhyChooseUs /></>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/stories" element={<Story />} />
        <Route path="/product" element={<Product />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/faq" element={<FAQPage />} />
       <Route path="/profile" element={<UserProfile />} />   
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/paymentfailure" element={<PaymentFailure />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Authentication Routes (Redirect if user is logged in) */}
        <Route path="/login" element={authRedirect(<Login />)} />
        <Route path="/otpverify" element={<OtpVerify />} />
        <Route path="/register" element={authRedirect(<Register />)} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/forgotpass" element={authRedirect(<ForgotPass />)} />
        <Route path="/reset-password/:token" element={authRedirect(<NewPass />)} />
      

        {/* Change Password Route (Only accessible if logged in) */}
        <Route path="/changepass" element={<ChangePass />} />


        {/* Protected Admin Dashboard Route */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Access Denied Route */}
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>

      {!hideNavbarFooter && <Footer />} 
    </main>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;
