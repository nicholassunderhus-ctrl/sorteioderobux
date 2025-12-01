import Hero from "@/components/Hero";
import ActiveRaffles from "@/components/ActiveRaffles";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen font-fredoka">
      {/* Header com botões de Login e Cadastro */}
      <header className="absolute top-0 right-0 p-4 z-20">
        <div className="flex space-x-2">
          <Link to="/login">
            <Button variant="outline" className="font-semibold">Login</Button>
          </Link>
          <Link to="/cadastro">
            <Button className="font-semibold">Cadastre-se</Button>
          </Link>
        </div>
      </header>
      <Hero />
      <ActiveRaffles />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
