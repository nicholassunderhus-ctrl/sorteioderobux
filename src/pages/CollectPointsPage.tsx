import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const CollectPointsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (taskId) {
      // Pega a lista de tarefas prontas para coleta do sessionStorage
      const readyTasksRaw = sessionStorage.getItem('readyTasks');
      const readyTasks = readyTasksRaw ? JSON.parse(readyTasksRaw) : [];
      
      // Adiciona a nova tarefa à lista se ela ainda não estiver lá
      if (!readyTasks.includes(taskId)) {
        readyTasks.push(taskId);
        sessionStorage.setItem('readyTasks', JSON.stringify(readyTasks));
      }
      
      // Redireciona o usuário de volta para a página de tarefas
      navigate('/ganhar-bilhetes');
    }
  }, [taskId, navigate]);

  // Mostra uma tela de carregamento enquanto o redirecionamento acontece
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 font-fredoka">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Processando sua recompensa...</p>
    </div>
  );
};

export default CollectPointsPage;