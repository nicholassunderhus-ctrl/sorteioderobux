import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ActiveRaffles from "@/components/ActiveRaffles";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Award, LogOut, User } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndPoints = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        try {
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`points`)
            .eq('id', session.user.id)
            .single();

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            setPoints(data.points);
          }
        } catch (error) {
          console.error("Erro ao buscar pontos:", error);
        }
      }
      setLoading(false);
    };

    fetchSessionAndPoints();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setPoints(null);
      } else {
        fetchSessionAndPoints();
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao fazer logout.");
    } else {
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen font-fredoka">
      {/* Header dinâmico */}
      <header className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
        {/* Pontos do Usuário (Canto Esquerdo) */}
        {session && points !== null && (
          <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm text-white font-semibold p-2 rounded-lg">
            <Award className="w-5 h-5 text-yellow-400" />
            <span>{points} Pontos</span>
          </div>
        )}

        {/* Botões de Login/Cadastro ou Conta/Logout (Canto Direito) */}
        <div className="flex space-x-2 ml-auto">
          {loading ? null : session ? (
            <>
              <Link to="/meus-bilhetes">
                <Button variant="outline" className="font-semibold">
                  <User className="w-4 h-4 mr-2" />
                  Minha Conta
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout} className="font-semibold">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="font-semibold">Login</Button>
              </Link>
              <Link to="/cadastro">
                <Button className="font-semibold">Cadastre-se</Button>
              </Link>
            </>
          )}
        </div>
      </header>
      <Hero />
      <ActiveRaffles />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;








































































































































































































































































































































































































































...
