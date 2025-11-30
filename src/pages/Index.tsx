import Hero from "@/components/Hero";
import ActiveRaffles from "@/components/ActiveRaffles";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import LiveStream from "@/components/LiveStream";

const Index = () => {
  return (
    <div className="min-h-screen font-fredoka">
      <Hero />
      <ActiveRaffles />
      <HowItWorks />
      <LiveStream />
      <Footer />
    </div>
  );
};

export default Index;
