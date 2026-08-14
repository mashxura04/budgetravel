import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Homes from "./pages/Homes";
import Crafts from "./pages/Crafts";
import Cafes from "./pages/Cafes";
import HomeDetail from "./pages/HomeDetail";
import CraftDetail from "./pages/CraftDetail";
import CafeDetail from "./pages/CafeDetail";
import MyActivity from "./pages/MyActivity";
import BecomeHost from "./pages/BecomeHost";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";


function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/homes/:id" element={<HomeDetail />} />
        <Route path="/crafts" element={<Crafts />} />
        <Route path="/crafts/:id" element={<CraftDetail />} />
        <Route path="/cafes" element={<Cafes />} />
        <Route path="/cafes/:id" element={<CafeDetail />} />
        <Route path="/activity" element={<MyActivity />} />
        <Route path="/become-host" element={<BecomeHost />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        
      </Routes>
      <Footer />
      <AuthModal />
    </div>
  );
}

export default App;