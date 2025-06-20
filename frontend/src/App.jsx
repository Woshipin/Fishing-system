// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import HomePage from "./Home/HomePage";
import AboutPage from "./About/AboutPage";
import ContactPage from "./Contact/ContactPage";
import PackagePage from "./Package/PackagePage";
import PackageDetailPage from "./Package/PackageDetailPage";
import ProductPage from "./Product/ProductPage";
import ProductDetailPage from "./Product/ProductDetailPage";
import OrderPage from "./Order/OrderPage";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import ResetPasswordPage from "./Auth/ResetPasswordPage";
import CartPage from "./Cart/CartPage";
import ProfilePage from "./Auth/ProfilePage";
import ProfileEditPage from "./Auth/ProfileEditPage";
import CommentPage from "./Comment/CommentPage";
import GalleryPage from "./Gallery/GalleryPage";
import FishingTimePage from "./FishingTime/FishingTimePage";
import { UserProvider } from './contexts/UserContext';

function App() {
  console.log("App: Component rendered");
  
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="packages" element={<PackagePage />} />
            <Route path="/packages/:id" element={<PackageDetailPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<ProfileEditPage />} />
            <Route path="comments" element={<CommentPage />} />
            <Route path="fishing-time" element={<FishingTimePage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;