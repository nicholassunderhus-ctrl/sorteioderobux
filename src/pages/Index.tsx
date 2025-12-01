import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import ActiveRaffles from "@/components/ActiveRaffles";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Award, LogOut, User, Menu, Ticket } from "lucide-react";
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
          {loading ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {session ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/meus-bilhetes" className="cursor-pointer">
                        <Ticket className="mr-2 h-4 w-4" />
                        <span>Meus Bilhetes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>Login</span></Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/cadastro" className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>Cadastre-se</span></Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
