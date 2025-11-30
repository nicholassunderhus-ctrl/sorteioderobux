import Hero from "@/components/Hero";
import ActiveRaffles from "@/components/ActiveRaffles";
import HowItWorks from "@/components/HowItWorks";
import LiveStream from "@/components/LiveStream";
import Footer from "@/components/Footer";

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
