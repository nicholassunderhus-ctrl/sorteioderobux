import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, ArrowLeft, Sparkles, Tv, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Criando 12 tarefas de exemplo, cada uma dando 10 pontos
const tasks = Array.from({ length: 12 }, (_, i) => ({
  id: `anuncio-${i + 1}`,
  title: `Assista ao Anúncio #${i + 1}`,
  points: 10,
}));

// TODO: Substitua o ID abaixo pelo ID do sorteio real da sua tabela `raffles` no Supabase.
const EXAMPLE_RAFFLE_ID = "06a96944-20a2-4ae0-8662-2135187919cb";

type TaskState = 'idle' | 'ready_to_collect' | 'loading' | 'collected';

const GanharBilhetes = () => {
  const [loadingTicket, setLoadingTicket] = useState<number | null>(null);
  const [randomTickets, setRandomTickets] = useState<any[]>([]);
  const [taskStates, setTaskStates] = useState<Record<string, TaskState>>({});
  const location = useLocation(); // Hook para detectar mudanças na navegação


  useEffect(() => {
    // Gera um grande conjunto de bilhetes para escolher aleatoriamente
    const allTickets = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Bilhete #${i + 1}`,
      description: "Clique para adquirir seu bilhete",
    }));

    // Embaralha o array e pega os 3 primeiros
    const shuffled = allTickets.sort(() => 0.5 - Math.random());
    setRandomTickets(shuffled.slice(0, 5));
  }, []);

  useEffect(() => {
    // Verifica o sessionStorage sempre que a página é carregada ou o usuário volta para ela
    const readyTasksRaw = sessionStorage.getItem('readyTasks');
    const collectedTasksRaw = sessionStorage.getItem('collectedTasks');
    const readyTasks = readyTasksRaw ? JSON.parse(readyTasksRaw) : [];
    const collectedTasks = collectedTasksRaw ? JSON.parse(collectedTasksRaw) : [];

    const newStates: Record<string, TaskState> = {};
    tasks.forEach(task => {
      if (collectedTasks.includes(task.id)) {
        newStates[task.id] = 'collected';
      } else if (readyTasks.includes(task.id)) {
        newStates[task.id] = 'ready_to_collect';
      } else {
        newStates[task.id] = 'idle';
      }
    });
    setTaskStates(newStates);
  }, [location]); // Roda este efeito sempre que a URL muda (ou seja, quando o usuário volta)

  const handleCollectPoints = async (taskId: string, points: number) => {
    setTaskStates(prev => ({ ...prev, [taskId]: 'loading' }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Você precisa estar logado para coletar pontos.");
      setTaskStates(prev => ({ ...prev, [taskId]: 'ready_to_collect' })); // Volta ao estado anterior
      return;
    }

    try {
      const { error } = await supabase.rpc('add_points', { user_id: user.id, points_to_add: points });
      if (error) throw error;

      toast.success(`Você coletou ${points} pontos!`);
      setTaskStates(prev => ({ ...prev, [taskId]: 'collected' }));

      // Adiciona a tarefa à lista de coletadas no sessionStorage
      const collectedTasksRaw = sessionStorage.getItem('collectedTasks');
      const collectedTasks = collectedTasksRaw ? JSON.parse(collectedTasksRaw) : [];
      collectedTasks.push(taskId);
      sessionStorage.setItem('collectedTasks', JSON.stringify(collectedTasks));
    } catch (error: any) {
      toast.error("Erro ao coletar pontos: " + error.message);
      setTaskStates(prev => ({ ...prev, [taskId]: 'ready_to_collect' }));
    }
  };

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

        {/* Seção de Tarefas para Ganhar Pontos */}
        <Card className="bg-white dark:bg-gray-900 mt-12">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Tv className="mr-3 h-7 w-7 text-amber-500" />
              Tarefas para Ganhar Pontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tasks.map((task) => {
                const state = taskStates[task.id] || 'idle';
                return (
                  <Card
                    key={task.id}
                    className="font-fredoka bg-card shadow-card hover:shadow-glow transition-all hover:-translate-y-1 flex flex-col"
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Tv className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-bold text-lg">{task.title}</h3>
                    </CardHeader>
                    <CardContent className="text-center pb-4 flex-grow">
                      <p className="font-bold text-green-500">+{task.points} Pontos</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {state === 'idle' && (
                        <Link to={`/coletar/${task.id}`} className="w-full">
                          <Button className="w-full font-semibold">Ver Anúncio <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </Link>
                      )}
                      {state === 'ready_to_collect' && (
                        <Button onClick={() => handleCollectPoints(task.id, task.points)} className="w-full font-semibold bg-green-600 hover:bg-green-700">Coletar</Button>
                      )}
                      {state === 'loading' && (
                        <Button disabled className="w-full font-semibold"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</Button>
                      )}
                      {state === 'collected' && (
                        <Button disabled className="w-full font-semibold">Coletado</Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GanharBilhetes;
