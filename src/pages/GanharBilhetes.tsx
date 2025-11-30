import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";

// TODO: Substitua o ID abaixo pelo ID do sorteio real da sua tabela `raffles` no Supabase.
const EXAMPLE_RAFFLE_ID = "06a96944-20a2-4ae0-8662-2135187919cb";

const GanharBilhetes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [myTickets, setMyTickets] = useState<{ id: string; created_at: string }[]>([]);

  // Função para buscar os bilhetes que o usuário já possui
  const fetchMyTickets = async () => {
    const { data, error } = await supabase.from('tickets').select('id, created_at').eq('raffle_id', EXAMPLE_RAFFLE_ID);
    if (data) setMyTickets(data);
  };

  const handleGetTicket = async () => {
    setIsLoading(true);

    const { data, error } = await supabase.rpc('claim_ticket', { raffle_id_to_claim: EXAMPLE_RAFFLE_ID });

    if (error) {
      toast.error("Erro ao resgatar o bilhete: " + error.message);
    } else {
      // A função RPC retorna um array, então pegamos o primeiro item.
      const newTicketId = data[0]?.ticket_id;
      toast.success(`Novo bilhete #${newTicketId} resgatado com sucesso!`);
      // Atualiza a lista de bilhetes na tela
      fetchMyTickets();
    }
    setIsLoading(false);
  };

  // Busca os bilhetes do usuário quando a página carrega
  useEffect(() => {
    fetchMyTickets();
  }, []);

  return (
    <div className="min-h-screen font-fredoka bg-gradient-hero">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/">
          <Button variant="outline" className="font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="font-fredoka mb-4 bg-gradient-primary text-primary-foreground text-base px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Bilhetes Grátis
          </Badge>
          <h1 className="font-fredoka font-bold text-4xl md:text-6xl mb-4">
            Ganhe Seus{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Bilhetes
            </span>
          </h1>
          <p className="font-fredoka text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Clique no botão abaixo para assistir um anúncio rápido e receber seu bilhete gratuitamente!
          </p>
        </div>

        {/* Botão para ganhar bilhete */}
        <div className="text-center mb-12">
            <Button
              onClick={handleGetTicket}
              className="w-full max-w-sm mx-auto font-semibold text-lg py-6 bg-gradient-secondary hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Resgatando..." : "✨ Ganhar Novo Bilhete ✨"}
            </Button>
        </div>

        {/* Seus Bilhetes */}
        {myTickets.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="font-bold text-2xl text-center mb-6">Meus Bilhetes ({myTickets.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {myTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="font-fredoka bg-card/80 shadow-sm"
                >
                  <CardHeader className="text-center p-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">Bilhete #{ticket.id}</h3>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Info */}
        <div className="text-center mt-12">
          <Card className="bg-card/50 backdrop-blur border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <p className="font-fredoka text-muted-foreground mb-2">
                💡 <strong>Dica:</strong> Quanto mais bilhetes você ganhar, maiores suas chances de vencer!
              </p>
              <p className="font-fredoka text-sm text-muted-foreground">
                Cada anúncio dura apenas alguns segundos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GanharBilhetes;
