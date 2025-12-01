import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, ArrowLeft, Sparkles, Tv, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Criando 10 tarefas de exemplo
const tasks = Array.from({ length: 10 }, (_, i) => ({
  id: `anuncio-${i + 1}`,
  title: `Assista ao Anúncio #${i + 1}`,
  points: Math.floor(Math.random() * 20 + 10), // Pontos aleatórios entre 10 e 30
}));

// TODO: Substitua o ID abaixo pelo ID do sorteio real da sua tabela `raffles` no Supabase.
const EXAMPLE_RAFFLE_ID = "06a96944-20a2-4ae0-8662-2135187919cb";

const GanharBilhetes = () => {
  const [loadingTicket, setLoadingTicket] = useState<number | null>(null);
  const [randomTickets, setRandomTickets] = useState<any[]>([]);

  useEffect(() => {
    // Gera um grande conjunto de bilhetes para escolher aleatoriamente
    const allTickets = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Bilhete #${i + 1}`,
      description: "Clique para adquirir seu bilhete",
    }));

    // Embaralha o array e pega os 3 primeiros
    const shuffled = allTickets.sort(() => 0.5 - Math.random());
    setRandomTickets(shuffled.slice(0, 3));
  }, []);

  const handleGetTicket = async (ticketId: number) => {
    setLoadingTicket(ticketId);

    const { data, error } = await supabase.rpc('claim_ticket', { raffle_id_to_claim: EXAMPLE_RAFFLE_ID });

    if (error) {
      toast.error("Erro ao resgatar o bilhete: " + error.message);
    } else {
      // A função RPC retorna um array, então pegamos o primeiro item.
      // O ID retornado é um UUID, mas para a mensagem podemos mostrar um trecho
      const newTicketId = data[0]?.ticket_id.substring(0, 8);
      toast.success(`Bilhete resgatado com sucesso! (ID: ...${newTicketId})`);
    }
    setLoadingTicket(null);
  };

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
            Clique em "Ganhar" para receber seus bilhetes gratuitos ou complete tarefas para ganhar pontos!
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {randomTickets.map((ticket) => (
            <Card
              key={ticket.title}
              className="font-fredoka bg-card shadow-card hover:shadow-glow transition-all hover:-translate-y-1"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Ticket className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-xl">{ticket.title}</h3>
              </CardHeader>

              <CardContent className="text-center pb-4">
                <p className="text-sm text-muted-foreground">
                  {ticket.description}
                </p>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  onClick={() => handleGetTicket(ticket.id)}
                  className="w-full font-semibold bg-gradient-secondary hover:opacity-90"
                  disabled={loadingTicket === ticket.id}
                >
                  {loadingTicket === ticket.id ? "Adquirindo..." : "Adquirir"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Seção de Tarefas para Ganhar Pontos */}
        <Card className="bg-white dark:bg-gray-900 mt-16">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Tv className="mr-3 h-7 w-7 text-amber-500" />
              Tarefas para Ganhar Pontos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-bold">+{task.points} Pontos</p>
                </div>
                <Link to={`/coletar/${task.id}`}>
                  <Button>
                    Ver Anúncio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

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
