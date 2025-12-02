import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

// Simula uma grande quantidade de bilhetes
const allTickets = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
}));

const AllTicketsPage = () => {
  const [takenTickets, setTakenTickets] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingTicket, setClaimingTicket] = useState<number | null>(null);

  // TODO: Substitua pelo ID do sorteio real
  const EXAMPLE_RAFFLE_ID = "06a96944-20a2-4ae0-8662-2135187919cb";

  useEffect(() => {
    const fetchTakenTickets = async () => {
      setLoading(true);
      // Busca todos os bilhetes que já têm um dono (user_id não é nulo)
      const { data, error } = await supabase
        .from("tickets")
        .select("id")
        .not("user_id", "is", null)
        .eq("raffle_id", EXAMPLE_RAFFLE_ID);

      if (data && !error) {
        setTakenTickets(data.map(t => t.id));
      }
      setLoading(false);
    };

    fetchTakenTickets();
  }, []);

  const handleAcquireTicket = async (ticketId: number) => {
    setClaimingTicket(ticketId);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Você precisa estar logado para adquirir um bilhete.");
      setClaimingTicket(null);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('claim_ticket', {
        raffle_id_to_claim: EXAMPLE_RAFFLE_ID,
        ticket_id_to_claim: ticketId
      });

      if (error) throw new Error(error.message);

      // A função RPC retornará um status
      const result = data as { status: string; message: string };

      if (result.status === 'SUCCESS') {
        toast.success(result.message);
        // Adiciona o bilhete à lista de já adquiridos na UI
        setTakenTickets(prev => [...prev, ticketId]);
      } else {
        toast.warning(result.message);
        // Se já foi pego, atualiza a UI também
        if (result.status === 'TAKEN') {
          setTakenTickets(prev => [...prev, ticketId]);
        }
      }
    } catch (error: any) {
      toast.error("Erro ao adquirir bilhete: " + error.message);
    } finally {
      setClaimingTicket(null);
    }
  };

  return (
    <div className="min-h-screen font-fredoka bg-gray-100 dark:bg-gray-950 p-4 sm:p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <Link to="/ganhar-bilhetes">
            <Button variant="outline" className="font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl md:text-5xl text-gray-800 dark:text-white">
            Todos os Bilhetes Disponíveis
          </h1>
          <p className="text-muted-foreground mt-2">Escolha seus números da sorte!</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {allTickets.map(ticket => {
              const isTaken = takenTickets.includes(ticket.id);
              const isClaiming = claimingTicket === ticket.id;

              return (
                <Button
                  key={ticket.id}
                  variant={isTaken ? "destructive" : "outline"}
                  disabled={isTaken || isClaiming}
                  onClick={() => handleAcquireTicket(ticket.id)}
                  className="font-bold transition-all"
                >
                  {isClaiming ? <Loader2 className="h-4 w-4 animate-spin" /> : ticket.id}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTicketsPage;