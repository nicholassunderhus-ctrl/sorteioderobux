import { Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import GanharBilhetes from "./pages/GanharBilhetes";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <AuthProvider>
      <div className="min-h-screen font-fredoka flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ganhar-bilhetes" element={<GanharBilhetes />} />
          </Routes>
        </main>
        {isHomePage && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;