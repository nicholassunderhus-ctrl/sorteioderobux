import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Ticket, ArrowLeft, Loader2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface UserTicket {
  number: number;
  raffles: {
    title: string;
    prize: string;
  } | null;
}

const MyTicketsPage = () => {
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para ver seus bilhetes.");
        setLoading(false);
        return;
      }

      // Consulta corrigida para buscar o 'number' do bilhete e mais detalhes do sorteio
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select(`
          number,
          raffles (
            title,
            prize
          )
        `)
        .eq('user_id', user.id)
        .order('number', { ascending: true });

      if (error) {
        toast.error("Erro ao buscar seus bilhetes.");
        console.error(error);
      } else if (tickets) {
        setUserTickets(tickets as UserTicket[]);
      }

      setLoading(false);
    };

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen font-fredoka bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      {/* Header com botão de voltar */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link to="/">
          <Button variant="outline" className="font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl md:text-5xl">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Bilhetes
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Aqui estão todos os seus bilhetes para os sorteios. Boa sorte!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : userTickets.length > 0 ? (
          // Estado com bilhetes
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {userTickets.map((ticket) => (
              <Card
                key={ticket.number}
                className="font-fredoka bg-card shadow-card text-center"
              >
                <CardHeader className="p-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <p className="font-bold text-2xl text-foreground">#{ticket.number}</p>
                  <p className="text-xs text-muted-foreground truncate" title={ticket.raffles?.title}>
                    {ticket.raffles?.title || "Sorteio"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Estado sem bilhetes
          <div className="text-center py-20">
            <Ticket className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700" />
            <h3 className="mt-4 text-xl font-semibold">Você ainda não tem bilhetes</h3>
            <p className="mt-2 text-muted-foreground">Vá para a página de ganhar bilhetes para adquirir os seus!</p>
            <Link to="/ganhar-bilhetes" className="mt-6 inline-block">
              <Button>Ganhar Bilhetes</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;