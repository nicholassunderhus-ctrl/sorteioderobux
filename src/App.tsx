import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GanharBilhetes from "./pages/GanharBilhetes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/ganhar-bilhetes" element={<GanharBilhetes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;