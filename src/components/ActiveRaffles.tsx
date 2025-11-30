import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Ticket, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const raffles = [
  {
    id: 1,
    title: "Sorteio Mega 1000 Robux",
    prize: "1000",
    participants: "234",
    endDate: "25 Nov 2025",
    ticketsAvailable: true,
    featured: true,
  },
];

const ActiveRaffles = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="font-fredoka mb-4 bg-gradient-primary text-primary-foreground">
            Sorteios Ativos
          </Badge>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl mb-4">
            Participe Agora!
          </h2>
          <p className="font-fredoka text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha seu sorteio favorito e ganhe bilhetes grátis para participar
          </p>
        </div>

        {/* Raffles Grid */}
        <div className="flex justify-center max-w-4xl mx-auto">
          {raffles.map((raffle) => (
            <Card 
              key={raffle.id} 
              className={`font-fredoka relative overflow-hidden transition-all hover:scale-105 hover:shadow-glow w-full max-w-lg ${
                raffle.featured ? 'ring-2 ring-primary shadow-glow' : 'shadow-card'
              }`}
            >
              {raffle.featured && (
                <div className="absolute top-6 right-6 z-10">
                  <Badge className="bg-gradient-secondary text-secondary-foreground font-semibold text-base px-4 py-2">
                    Destaque
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-6">
                <div className="w-full h-48 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="font-bold text-7xl text-white mb-2">
                      {raffle.prize}
                    </div>
                    <div className="text-xl text-white/90 font-semibold">
                      Robux
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-3xl text-center">{raffle.title}</h3>
              </CardHeader>

              <CardContent className="space-y-4 px-8">
                <div className="flex items-center gap-3 text-lg text-muted-foreground">
                  <Users className="w-6 h-6" />
                  <span>{raffle.participants} participantes</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-muted-foreground">
                  <Calendar className="w-6 h-6" />
                  <span>Termina em {raffle.endDate}</span>
                </div>
                <div className="flex items-center gap-3 text-lg font-semibold text-accent">
                  <Clock className="w-6 h-6" />
                  <span>Bilhetes Disponíveis!</span>
                </div>
              </CardContent>

              <CardFooter className="pt-6 px-8 pb-8">
                <Link to="/ganhar-bilhetes" className="w-full">
                  <Button 
                    className="w-full font-semibold bg-gradient-primary hover:opacity-90 text-xl py-6"
                  >
                    <Ticket className="w-6 h-6 mr-3" />
                    Ganhar Bilhetes
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActiveRaffles;
