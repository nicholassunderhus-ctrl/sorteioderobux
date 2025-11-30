import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GanharBilhetes from "./pages/GanharBilhetes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ganhar-bilhetes" element={<GanharBilhetes />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;