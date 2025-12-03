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

// ===================================================================
//  MANUALMENTE: COLOQUE SEUS LINKS ENCURTADOS AQUI
// ===================================================================
// Para cada tarefa, substitua a URL de exemplo pela URL do seu encurtador.
// O link final do seu encurtador deve apontar de volta para o seu site,
// usando o formato: https://seusite.com/coletar/anuncio-X
const taskShortenerLinks: Record<string, string> = {
  'anuncio-1': 'https://stly.link/anuncio1',
  'anuncio-2': 'https://cuty.io/anuncio2',
  'anuncio-3': 'https://liink.uk/anuncio3',
  'anuncio-4': 'https://tpi.li/anuncio4',
  'anuncio-5': 'https://fir3.net/tarefaanuncio5',
  'anuncio-6': 'https://encurtandourl.com/anuncio6',
  'anuncio-7': 'https://gplinks.co/anuncio7',
  'anuncio-8': 'https://shortox.com/96O27uA8',
  'anuncio-9': 'https://exe.io/anuncio9',
  'anuncio-10': 'https://fbol.top/anuncio10',
  'anuncio-11': 'https://encurt4.com/anuncio11',
  'anuncio-12': 'https://seuclick.net/anuncio12',
};

// TODO: Substitua o ID abaixo pelo ID do sorteio real da sua tabela `raffles` no Supabase.
const EXAMPLE_RAFFLE_ID = "e1937833-6ebb-482e-8a78-3087ff26cf9c";

type TaskState = 'idle' | 'ready_to_collect' | 'loading' | 'collected';

const GanharBilhetes = () => {
  const [loadingTicket, setLoadingTicket] = useState<number | null>(null);
  const [randomTickets, setRandomTickets] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [taskStates, setTaskStates] = useState<Record<string, TaskState>>({});
  const location = useLocation(); // Hook para detectar mudanças na navegação


  useEffect(() => {
    const fetchAndSetRandomTickets = async () => {
      // Chama a função RPC 'get_random_available_tickets' para buscar 5 bilhetes aleatórios e disponíveis.
      // Esta abordagem é muito mais eficiente do que buscar todos os bilhetes e filtrar no cliente.
      const { data, error } = await supabase.rpc('get_random_available_tickets', {
        raffle_id_param: EXAMPLE_RAFFLE_ID,
        limit_param: 5
      });

      if (error) {
        console.error("Erro ao buscar bilhetes aleatórios:", error);
        toast.error("Não foi possível carregar os bilhetes. Tente recarregar a página.");
        return;
      }

      const availableTickets = data.map((ticket: any) => ({ id: ticket.number, title: `Bilhete #${ticket.number}` }));
      setRandomTickets(availableTickets);
    };

    fetchAndSetRandomTickets();
  }, []);

  useEffect(() => {
    // Busca as tarefas que o usuário já completou hoje
    const fetchCompletedTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('daily_task_completions')
          .select('task_id')
          .eq('user_id', user.id)
          .eq('completion_date', today);

        if (data) {
          const completedTodayIds = data.map(item => item.task_id);
          setTaskStates(prev => ({ ...prev, ...Object.fromEntries(completedTodayIds.map(id => [id, 'collected'])) }));
        }
      }
    };
    fetchCompletedTasks();
  }, []);

  useEffect(() => {
    // Busca os pontos do usuário ao carregar a página
    const fetchUserPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('points').eq('id', user.id).single();
        if (data) setUserPoints(data.points);
      }
    };
    fetchUserPoints();
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
      // Chama a nova função segura para coletar pontos da tarefa
      const { data: result, error } = await supabase.rpc('claim_task_points', { 
        task_id_to_claim: taskId, 
        points_to_add: points 
      });

      if (error) throw error;

      if (result === 'SUCCESS') {
        toast.success(`Você coletou ${points} pontos!`);
        setTaskStates(prev => ({ ...prev, [taskId]: 'collected' }));
      } else if (result === 'TASK_ALREADY_COMPLETED') {
        toast.info("Você já completou esta tarefa hoje.");
        setTaskStates(prev => ({ ...prev, [taskId]: 'collected' }));
      } else {
        throw new Error("Não foi possível coletar os pontos.");
      }

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

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Você precisa estar logado para adquirir um bilhete.");
      }
      if (userPoints < 10) {
        throw new Error("Você não tem pontos suficientes (requer 10 pontos).");
      }

      // **CORREÇÃO AQUI:** Passando os dois parâmetros necessários
      const { data, error } = await supabase.rpc('claim_ticket', {
        raffle_id_to_claim: EXAMPLE_RAFFLE_ID,
        ticket_number_to_claim: ticketId
      });

      if (error) throw error;

      const result = data;

      if (result.status === 'SUCCESS') {
        toast.success(result.message);
        setUserPoints(prev => prev - 10); // Deduz os pontos na UI
        // Opcional: remover o bilhete da lista para que não possa ser clicado novamente
        setRandomTickets(prev => prev.filter(t => t.id !== ticketId));
      } else {
        toast.warning(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao adquirir o bilhete.");
    } finally {
      setLoadingTicket(null);
    }
  };

  return (
    <div className="min-h-screen font-fredoka bg-background">
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

              <CardContent className="text-center pb-4 flex-grow">
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Custa 10 Pontos
                </p>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  onClick={() => handleGetTicket(ticket.id)}
                  className="w-full font-semibold bg-gradient-secondary hover:opacity-90"
                  disabled={loadingTicket === ticket.id || userPoints < 10}
                >
                  {loadingTicket === ticket.id ? "Adquirindo..." : "Adquirir"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/todos-os-bilhetes" className="font-semibold text-primary hover:text-primary/80 transition-colors">
            Ver mais bilhetes
          </Link>
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
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-x-3 text-4xl font-bold">
              <Tv className="h-9 w-9 text-amber-500" />
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent pb-1">
                Tarefas para Ganhar Pontos
              </span>
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
                        <a href={taskShortenerLinks[task.id]} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full font-semibold">Ver Anúncio <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </a>
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
