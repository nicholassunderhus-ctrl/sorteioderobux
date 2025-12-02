import { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Award, LogOut, User, Menu, Ticket } from "lucide-react";
import { toast } from "sonner";

const MainLayout = () => {
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
    <div>
      <header className="fixed top-0 right-0 p-4 z-50">
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
                  {points !== null && (
                    <div className="p-2">
                      <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-2 shadow-lg ring-1 ring-white/10">
                        <Award className="h-5 w-5 text-amber-400" />
                        <span className="text-white font-semibold">{points} Pontos</span>
                      </div>
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <div className="p-2 flex flex-col space-y-2">
                    <Link to="/roblox-id">
                      <Button variant="outline" className="w-full font-semibold">
                        <User className="mr-2 h-4 w-4" />
                        ID Roblox
                      </Button>
                    </Link>
                    <Link to="/meus-bilhetes">
                      <Button variant="outline" className="w-full font-semibold">
                        <Ticket className="mr-2 h-4 w-4" />
                        Meus Bilhetes
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleLogout} className="w-full font-semibold">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-2 flex flex-col space-y-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full font-semibold">Login</Button>
                  </Link>
                  <Link to="/cadastro">
                    <Button className="w-full font-semibold">Cadastre-se</Button>
                  </Link>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;