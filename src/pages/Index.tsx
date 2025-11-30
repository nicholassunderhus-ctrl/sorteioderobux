import Hero from "@/components/Hero";
import ActiveRaffles from "@/components/ActiveRaffles";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen font-fredoka">
      <Hero />
      <ActiveRaffles />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
