import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Loader2, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

// Gera uma grande quantidade de bilhetes para exibição
const allTickets = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  price: 10, // Custo de cada bilhete
}));

const AllTicketsPage = () => {
  const [takenTickets, setTakenTickets] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingTicket, setClaimingTicket] = useState<number | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);

  // TODO: Substitua pelo ID do sorteio real
  const EXAMPLE_RAFFLE_ID = "COLE_SEU_NOVO_ID_AQUI";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Busca os pontos do usuário e os bilhetes já adquiridos em paralelo
      const [pointsResponse, ticketsResponse] = await Promise.all([
        user ? supabase.from('profiles').select('points').eq('id', user.id).single() : Promise.resolve({ data: null }),
        supabase.from("tickets").select("id").not("user_id", "is", null).eq("raffle_id", EXAMPLE_RAFFLE_ID)
      ]);

      if (pointsResponse.data) {
        setUserPoints(pointsResponse.data.points);
      }

      if (ticketsResponse.data) {
        setTakenTickets(ticketsResponse.data.map(t => t.id));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAcquireTicket = async (ticketId: number) => {
    setClaimingTicket(ticketId);
    const { data: { user } } = await supabase.auth.getUser();

    try {
      if (!user) {
        throw new Error("Você precisa estar logado para adquirir um bilhete.");
      }
      if (userPoints < 10) {
        throw new Error("Você não tem pontos suficientes (requer 10 pontos).");
      }

      const { data, error } = await supabase.rpc('claim_ticket', {
        raffle_id_to_claim: EXAMPLE_RAFFLE_ID,
        ticket_number_to_claim: ticketId
      });

      if (error) throw error;

      const result = data; // A função RPC agora retorna um objeto diretamente

      if (result.status === 'SUCCESS') {
        toast.success(result.message);
        setTakenTickets(prev => [...prev, ticketId]);
        setUserPoints(prev => prev - 10); // Deduz os pontos na UI
      } else {
        toast.warning(result.message);
        if (result.status === 'TAKEN') {
          setTakenTickets(prev => [...prev, ticketId]);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao adquirir o bilhete.");
    } finally {
      setClaimingTicket(null);
    }
  };

  return (
    <div className="min-h-screen font-fredoka bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho Responsivo */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <Link to="/ganhar-bilhetes">
            <Button variant="outline" className="font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            </Link>
            <div className="font-semibold text-lg text-primary text-right">
              Seus Pontos: {userPoints}
            </div>
          </div>
          <div className="text-center">
            <h1 className="font-bold text-4xl md:text-5xl">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Todos os Bilhetes</span>
            </h1>
            <p className="text-muted-foreground mt-1">Escolha seus números da sorte!</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {allTickets.map(ticket => {
              const isTaken = takenTickets.includes(ticket.id);
              const isClaiming = claimingTicket === ticket.id;
              const canAfford = userPoints >= ticket.price;

              return (
                <Card
                  key={ticket.id}
                  className={`font-fredoka text-center transition-all ${isTaken ? 'bg-red-200 dark:bg-red-900/50' : 'bg-card'}`}
                >
                  <CardHeader className="p-3">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto ${isTaken ? 'bg-red-400' : 'bg-gradient-primary'}`}>
                      <Ticket className="w-8 h-8 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    <p className="font-bold text-2xl text-foreground">#{ticket.id}</p>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{ticket.price} Pontos</p>
                  </CardContent>
                  <CardFooter className="p-2">
                    <Button
                      size="sm"
                      className="w-full font-semibold"
                      variant={isTaken ? "destructive" : "default"}
                      disabled={isTaken || isClaiming || !canAfford}
                      onClick={() => handleAcquireTicket(ticket.id)}
                    >
                      {isClaiming 
                        ? <Loader2 className="h-4 w-4 animate-spin" /> 
                        : isTaken 
                          ? "Indisponível" 
                          : "Adquirir"
                      }
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTicketsPage;