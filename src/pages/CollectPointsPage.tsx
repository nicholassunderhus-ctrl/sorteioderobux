import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';
import { ArrowLeft } from 'lucide-react';

// Em um aplicativo real, isso viria do seu banco de dados.
const offers = {
  'seguir-social': { title: 'Siga-nos nas Redes Sociais', points: 50, description: 'Siga nosso perfil para ganhar pontos!' },
  'responder-pesquisa': { title: 'Responda a uma Pesquisa', points: 100, description: 'Sua opinião vale pontos! Complete a pesquisa abaixo.' },
  'assistir-video': { title: 'Assista a um Vídeo', points: 25, description: 'Assista ao vídeo promocional até o fim.' },
};

type OfferKey = keyof typeof offers;

const CollectPointsPage = () => {
  const { taskId } = useParams<{ taskId: OfferKey }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [collected, setCollected] = useState(false);

  const offer = taskId ? offers[taskId] : null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        toast.error("Você precisa estar logado para coletar pontos.");
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleCollectPoints = async () => {
    if (!session?.user || !offer) return;

    setLoading(true);
    try {
      // Chama uma função 'add_points' no Supabase (RPC)
      // Você precisa criar essa função no seu banco de dados!
      const { error } = await supabase.rpc('add_points', {
        user_id: session.user.id,
        points_to_add: offer.points,
      });

      if (error) throw error;

      toast.success(`Você coletou ${offer.points} pontos!`);
      setCollected(true);
    } catch (error) {
      console.error("Erro ao coletar pontos:", error);
      toast.error("Não foi possível coletar os pontos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!offer) {
    return <div>Oferta não encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 font-fredoka">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{offer.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{offer.description}</p>
        
        <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-300">Recompensa: {offer.points} Pontos</p>
        </div>

        <Button
          onClick={handleCollectPoints}
          disabled={loading || collected}
          className="w-full font-bold text-lg py-6"
        >
          {collected ? 'Pontos Coletados!' : loading ? 'Coletando...' : 'Coletar Pontos'}
        </Button>

        <Link to="/ganhar-bilhetes" className="mt-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar para as ofertas
        </Link>
      </div>
    </div>
  );
};

export default CollectPointsPage;