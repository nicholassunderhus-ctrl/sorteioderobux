import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface UserTicket {
  id: number;
  raffles: {
    title: string;
  } | null;
}

const MyTicketsPage = () => {
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: tickets, error } = await supabase.from('tickets').select(`id, raffles ( title )`).eq('user_id', user.id);
        if (tickets && !error) {
          setUserTickets(tickets);
        }
      }
      setLoading(false);
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen font-fredoka bg-gradient-hero">
      {/* Header com botão de voltar */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/sorteios">
          <Button variant="outline" className="font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Sorteios
          </Button>
        </Link>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-fredoka font-bold text-4xl md:text-6xl mb-4">
            Meus{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Bilhetes
            </span>
          </h1>
          <p className="font-fredoka text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Aqui estão todos os seus bilhetes para os sorteios da semana. Boa sorte!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : userTickets.length > 0 ? (
          // Estado com bilhetes
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {userTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="font-fredoka bg-card shadow-card text-center"
              >
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Ticket className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    {ticket.raffles?.title || "Sorteio"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Número do Bilhete:
                  </p>
                  <p className="font-semibold text-accent">#{ticket.id}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Estado sem bilhetes
          <div className="text-center max-w-lg mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm p-8">
              <h3 className="font-fredoka text-2xl font-bold mb-4">
                Você ainda não tem bilhetes!
              </h3>
              <p className="text-muted-foreground mb-6">
                Parece que você ainda não adquiriu nenhum bilhete para os sorteios desta semana.
              </p>
              <Link to="/ganhar-bilhetes">
                <Button size="lg" className="font-semibold bg-gradient-primary hover:opacity-90">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Ganhar Bilhetes
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;