import { Badge } from "@/components/ui/badge";
import { MousePointerClick, Eye, Ticket, Trophy } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "1. Clique no Link",
    description: "Clique nos links especiais que disponibilizamos",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Eye,
    title: "2. Assista Anúncios",
    description: "Veja os anúncios curtos que aparecerem",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Ticket,
    title: "3. Ganhe Bilhetes",
    description: "Receba seus bilhetes grátis automaticamente",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Trophy,
    title: "4. Concorra ao Prêmio",
    description: "Participe do sorteio e boa sorte!",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="font-fredoka mb-4 bg-gradient-accent text-accent-foreground">
            Simples e Rápido
          </Badge>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl mb-4">
            Como Funciona?
          </h2>
          <p className="font-fredoka text-lg text-muted-foreground max-w-2xl mx-auto">
            É muito fácil participar! Siga estes passos simples e comece a ganhar
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border" />
                )}

                <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all hover:-translate-y-1 text-center relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="font-fredoka font-bold text-xl mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-fredoka text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="font-fredoka text-lg text-foreground font-semibold">
            🎉 Tudo 100% Grátis! Comece agora mesmo!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
