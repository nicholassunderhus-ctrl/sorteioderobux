import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GanharBilhetes from "./pages/GanharBilhetes";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen font-fredoka flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ganhar-bilhetes" element={<GanharBilhetes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;