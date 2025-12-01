import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-2xl animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-primary/20 rounded-2xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-accent/20 rounded-2xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-card mb-6 animate-bounce-soft">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-fredoka font-semibold text-foreground">100% Grátis!</span>
          </div>

          {/* Main heading */}
          <h1 className="font-fredoka font-bold text-4xl sm:text-5xl md:text-7xl mb-6 leading-tight">
            Concorra a Ganhar{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Robux Grátis
            </span>
            {" "}Toda Semana
          </h1>

          {/* Subheading */}
          <p className="font-fredoka text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ganhe bilhetes assistindo anúncios e tenha mais chances de ganhar Robux.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center items-center">
            <Link to="/meus-bilhetes">
              <Button
                size="lg"
                className="font-fredoka font-semibold text-lg px-8 bg-gradient-primary hover:opacity-90 shadow-glow animate-pulse-glow"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Meus Bilhetes
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="font-fredoka font-bold text-3xl bg-gradient-primary bg-clip-text text-transparent mb-2">
                2x
              </div>
              <div className="font-fredoka text-sm text-muted-foreground">
                Por Semana
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="font-fredoka font-bold text-3xl bg-gradient-secondary bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="font-fredoka text-sm text-muted-foreground">
                Grátis
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="font-fredoka font-bold text-3xl bg-gradient-accent bg-clip-text text-transparent mb-2">
                Robux
              </div>
              <div className="font-fredoka text-sm text-muted-foreground">
                De Verdade
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
