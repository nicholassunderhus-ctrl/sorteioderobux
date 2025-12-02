import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Ticket, Tv, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const raffles = [
  {
    id: "e1937833-6ebb-482e-8a78-3087ff26cf9c", // ID real do sorteio
    title: "Sorteio Mega 1000 Robux",
    prize: "1000",
    participants: "234",
    endDate: "06 Dez 2025",
    ticketsAvailable: true,
    featured: true,
  },
];

const ActiveRaffles = () => {
  const [participantCount, setParticipantCount] = useState<number | null>(null);

  useEffect(() => {
    const raffleId = raffles[0].id;

    // Função para buscar a contagem atual de participantes
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .not('user_id', 'is', null)
        .eq('raffle_id', raffleId);

      if (error) {
        console.error("Erro ao buscar contagem de participantes:", error);
      } else if (count !== null) {
        setParticipantCount(count);
      }
    };

    // Busca a contagem inicial
    fetchCount();

    // Configura a escuta em tempo real para qualquer mudança na tabela de bilhetes
    const channel = supabase.channel('realtime-participants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets', filter: `raffle_id=eq.${raffleId}` }, fetchCount)
      .subscribe();

    // Limpa a inscrição ao desmontar o componente
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

              <CardHeader className="p-0">
                <div className="w-full h-48 bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-bold text-7xl text-white drop-shadow-lg">
                      {raffle.prize}
                    </div>
                    <div className="text-xl text-white/90 font-semibold">
                      Robux
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">{raffle.title}</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    {participantCount !== null ? (
                      <span>{participantCount} participantes</span>
                    ) : (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    <span>Termina em {raffle.endDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tv className="w-6 h-6" />
                    <span>Sorteio em live às 19:00</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
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

        {/* Live Stream Section */}
        <div className="text-center mt-20 pt-16 border-t border-border">
          <Badge className="font-fredoka mb-4 bg-gradient-accent text-accent-foreground">
            <Tv className="w-4 h-4 mr-2" />
            Ao Vivo
          </Badge>
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl mb-4">
            Transmissão dos Sorteios
          </h2>
          <p className="font-fredoka text-lg text-muted-foreground max-w-2xl mx-auto">
            Acompanhe nossos sorteios ao vivo todas as terças e sábados, a
            partir das 19:00.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ActiveRaffles;
