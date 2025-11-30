import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { supabase } from "@/lib/supabaseClient";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-14 flex items-center">
          {/* Logo */}
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img 
              src="/roblox.png" 
              alt="Logo Robux Chance Hub" 
              className="h-8 w-8" 
            />
            <span className="font-bold font-fredoka hidden sm:inline-block">
              Robux Chance Hub
            </span>
          </Link>

          {/* Right side */}
          <div className="flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-semibold flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  {user.email}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsModalOpen(true)}>
                <LogIn className="w-4 h-4 mr-2" /> Entrar
              </Button>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;