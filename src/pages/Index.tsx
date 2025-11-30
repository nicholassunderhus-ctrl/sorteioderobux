import Hero from "@/components/Hero";
import ActiveRaffles from "@/components/ActiveRaffles";
import HowItWorks from "@/components/HowItWorks";
import LiveStream from "@/components/LiveStream";
limport Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen font-fredoka">
      <main>
        <Hero />
        <ActiveRaffles />
        <HowItWorks />
        <LiveStream />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
